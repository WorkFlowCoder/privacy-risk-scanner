from celery_app import celery
from services.policy import analyze_with_llm

@celery.task(name="analyze_policy_task")
def analyze_policy_task(content: str):
    return analyze_with_llm(content)