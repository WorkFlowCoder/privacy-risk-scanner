from sqlalchemy import select
from sqlalchemy.orm import selectinload
from ..models.analyze import Analysis

class AnalysisRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        result = self.db.execute(select(Analysis).options(selectinload(Analysis.clauses)))
        return result.scalars().all()
    
    def get_by_id(self, analysis_id):
        result = self.db.execute(
            select(Analysis)
            .options(selectinload(Analysis.clauses))
            .where(Analysis.id == analysis_id)
        )
        return result.scalars().first()