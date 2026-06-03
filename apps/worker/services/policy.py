from llm.factory import get_llm_client
from prompts.privacy_prompt import SYSTEM_PROMPT
import json


def format_category_name(category: str) -> str:
    """Convert snake_case category to Title Case (e.g., 'data_exploitation' -> 'Data Exploitation')"""
    return ' '.join(word.capitalize() for word in category.split('_'))


def get_severity_color(score_impact: int) -> str:
    """Get severity color class based on score impact (points removed)"""
    if score_impact <= -20:
        return "red"      # CRITICAL: -20 points
    elif score_impact <= -15:
        return "orange"   # HIGH: -15 points
    elif score_impact <= -8:
        return "yellow"   # MEDIUM: -8 points
    else:
        return "blue"     # LOW: -3 points


SEVERITY_SCORES = {
    "LOW": -3,
    "MEDIUM": -8,
    "HIGH": -15,
    "CRITICAL": -20,
}

# Reverse mapping: score_impact -> severity level
SCORE_TO_SEVERITY = {v: k for k, v in SEVERITY_SCORES.items()}

CATEGORY_CONSENT = {
    "consent_dark_patterns",
    "legal_asymmetry",
    "data_control_limitation",
}

CATEGORY_EXPLOITATION = {
    "surveillance_tracking",
    "data_exploitation",
}


# --------------------------------------------------
# SCORING ENGINE
# --------------------------------------------------
def compute_scores(result: dict) -> dict:
    findings = result.get("findings", [])

    global_score = 100
    consent_quality_score = 100
    data_exploitation_level = 0

    critical_count = 0
    high_count = 0

    for finding in findings:
        category = finding.get("category", "")
        
        # Get score_impact from LLM (already in finding)
        score_impact = finding.get("score_impact", -3)
        finding["score_impact"] = score_impact  # Ensure it's persisted
        
        # Map score_impact back to severity level (LOW, MEDIUM, HIGH, CRITICAL)
        finding["severity"] = SCORE_TO_SEVERITY.get(score_impact, "LOW").lower()

        # --------------------------
        # GLOBAL SCORE
        # --------------------------
        global_score += score_impact

        # --------------------------
        # CONSENT SCORE
        # --------------------------
        if category in CATEGORY_CONSENT:
            consent_quality_score += score_impact

        # --------------------------
        # EXPLOITATION SCORE (COUNT-BASED)
        # --------------------------
        if category in CATEGORY_EXPLOITATION:
            data_exploitation_level += 1

        # --------------------------
        # SEVERITY COUNTING
        # --------------------------
        severity = finding.get("severity", "LOW")
        if severity == "CRITICAL":
            critical_count += 1
        elif severity == "HIGH":
            high_count += 1

    # --------------------------
    # CLAMPING
    # --------------------------
    global_score = max(0, min(100, round(global_score)))
    consent_quality_score = max(0, min(100, round(consent_quality_score)))
    data_exploitation_level = max(0, min(100, data_exploitation_level * 10))

    # --------------------------
    # RATING
    # --------------------------
    if global_score < 50:
        rating = "red"
    elif global_score < 75:
        rating = "orange"
    else:
        rating = "green"

    # --------------------------
    # DENSITY
    # --------------------------
    if critical_count >= 1:
        dark_pattern_density = "high"
    elif high_count >= 2:
        dark_pattern_density = "medium"
    else:
        dark_pattern_density = "low"

    # --------------------------
    # OUTPUT
    # --------------------------
    result["global_score"] = global_score
    result["rating"] = rating
    result["consent_quality_score"] = consent_quality_score
    result["data_exploitation_level"] = data_exploitation_level
    result["dark_pattern_density"] = dark_pattern_density

    return result


# --------------------------------------------------
# MAIN ENTRY
# --------------------------------------------------
def analyze_with_llm(content: str):
    client = get_llm_client()

    llm_response = client.analyze(SYSTEM_PROMPT, content)

    #print("LLM raw response:", json.dumps(llm_response, indent=2, ensure_ascii=False), flush=True)

    result = compute_scores(llm_response)

    print("LLM response:", json.dumps(result, indent=2, ensure_ascii=False), flush=True)

    return result