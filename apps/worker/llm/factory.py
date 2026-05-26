import os
from .ollama_client import OllamaClient

def get_llm_client():
    provider = os.getenv("LLM_PROVIDER", "ollama")

    if provider == "ollama":
        return OllamaClient(
            model=os.getenv("OLLAMA_MODEL", "qwen2.5:3b"),
            base_url=os.getenv("OLLAMA_URL")  # uniquement base host
        )

    raise ValueError(f"Unknown LLM provider: {provider}")