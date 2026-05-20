from .llm.factory import get_llm_client
from ..prompts.privacy_prompt import SYSTEM_PROMPT


def analyze_with_llm(content: str):
    client = get_llm_client()
    return client.analyze(SYSTEM_PROMPT, content)