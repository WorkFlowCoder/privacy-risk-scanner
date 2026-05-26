import os
import re
import json
import requests


class OllamaClient:
    def __init__(self, model: str, base_url: str | None = None):
        self.model = model
        self.base_url = base_url or self._resolve_base_url()

    def _resolve_base_url(self) -> str:
        candidates = [
            os.getenv("OLLAMA_URL"),  # priorité env
            "http://host.docker.internal:11434",
            "http://localhost:11434",
            "http://127.0.0.1:11434",
        ]

        for base in candidates:
            if not base:
                continue
            try:
                r = requests.get(f"{base}/api/tags", timeout=2)
                if r.status_code == 200:
                    return base
            except requests.RequestException:
                continue

        raise RuntimeError("Ollama not reachable on any known endpoint")

    def analyze(self, system_prompt: str, content: str):
        payload = {
            "model": self.model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": self.clean_text(content)},
            ],
        }

        url = f"{self.base_url}/api/chat"

        try:
            response = requests.post(url, json=payload, timeout=300)
            response.raise_for_status()
        except requests.Timeout:
            raise RuntimeError("Ollama timeout (model too slow or overloaded)")
        except requests.RequestException as e:
            raise RuntimeError(f"Ollama request failed: {e}")

        data = response.json()
        raw = data["message"]["content"]
        return json.loads(raw)

    def clean_text(self, text: str) -> str:
        text = text.replace("\n", " ").replace("\r", " ")
        text = re.sub(r"\s+", " ", text)
        return self.truncate_text(text.strip())

    def truncate_text(self, text: str, max_chars: int = 12000) -> str:
        if len(text) <= max_chars:
            return text
        return text[:max_chars].rsplit(" ", 1)[0]