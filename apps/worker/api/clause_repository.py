from sqlalchemy.orm import Session
from .models import Clause


def save_clauses(db: Session, analysis_id, findings):
    """Save clauses/findings using SQLAlchemy ORM"""
    
    for finding in findings:
        clause = Clause(
            analysis_id=analysis_id,
            category=finding.get("category"),
            severity=finding.get("severity"),
            score_impact=finding.get("score_impact"),
            title=finding.get("title"),
            explanation=finding.get("explanation"),
            extracted_text=finding.get("evidence"),
        )
        db.add(clause)
    
    db.commit()
