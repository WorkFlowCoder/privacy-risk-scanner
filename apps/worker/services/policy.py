from llm.factory import get_llm_client
from prompts.privacy_prompt import SYSTEM_PROMPT
import json

SEVERITY_SCORES = {
    "LOW": -3,
    "MEDIUM": -8,
    "HIGH": -15,
    "CRITICAL": -20,
}

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
        severity = (finding.get("severity") or "LOW").upper().strip()
        category = finding.get("category", "")

        if severity not in SEVERITY_SCORES:
            severity = "LOW"

        # --------------------------
        # SCORE IMPACT (PER FINDING)
        # --------------------------
        score_impact = SEVERITY_SCORES[severity]
        finding["score_impact"] = score_impact

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