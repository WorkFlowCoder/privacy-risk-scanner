from abc import ABC, abstractmethod

class LLMClient(ABC):

    @abstractmethod
    def analyze(self, system_prompt: str, user_content: str) -> dict:
        pass