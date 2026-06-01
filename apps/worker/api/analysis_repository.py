from sqlalchemy.orm import Session
from .models import Analysis


def save_analysis(db: Session, user_id, website_id, url, llm_result):
    """Save analysis result using SQLAlchemy ORM"""
    
    analysis = Analysis(
        user_id=user_id,
        website_id=website_id,
        url=url,
        global_score=llm_result["global_score"],
        rating=llm_result["rating"],
        status="completed",
        summary=llm_result["summary"],
    )
    
    db.add(analysis)
    db.flush()
    
    analysis_id = analysis.id
    db.commit()
    
    return analysis_id
