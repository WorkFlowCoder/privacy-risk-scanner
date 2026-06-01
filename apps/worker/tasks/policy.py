from celery_app import celery
from services.policy import analyze_with_llm

from api.website_repository import get_or_create_website
from api.analysis_repository import save_analysis
from api.clause_repository import save_clauses

from api.database import SessionLocal

@celery.task(name="analyze_policy_task")
def analyze_policy_task(user_id: str, url: str, content: str):
    
    db = SessionLocal()
    try:
        result = analyze_with_llm(content)
        # WEBSITE
        website_id = get_or_create_website(db, url)

        # ANALYSIS
        analysis_id = save_analysis(
            db=db,
            user_id=user_id,
            website_id=website_id,
            url=url,
            llm_result=result,
        )

        # CLAUSES
        save_clauses(
            db=db,
            analysis_id=analysis_id,
            findings=result.get("findings", []),
        )

        return {
            "analysis_id": analysis_id,
            **result
        }
    finally:
        db.close()