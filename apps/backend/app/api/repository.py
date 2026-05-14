from sqlalchemy import select
from ..models.analyze import Analysis

class AnalysisRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        result = self.db.execute(select(Analysis))
        return result.scalars().all()