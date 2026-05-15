from datetime import datetime
import uuid
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Integer

from ..core.base import Base

class Clause(Base):
    __tablename__ = "clauses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"))

    title = Column(String)
    severity = Column(String)

    # métier minimal
    title = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)

    # enrichissement (optionnel mais utile)
    category = Column(String(50), nullable=True)
    score_impact = Column(Integer, nullable=True)

    explanation = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)

    # timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


    analysis = relationship("Analysis", back_populates="clauses")

class ClauseOut(BaseModel):
    title: str
    severity: str
    category: str | None

    class Config:
        from_attributes = True

class ClauseAllOut(BaseModel):
    id: uuid.UUID
    title: str
    severity: str
    category: str | None
    score_impact: int | None
    explanation: str | None
    extracted_text: str | None
    updated_at: datetime | None

    class Config:
        from_attributes = True