import uuid
from ..core.base import Base
from sqlalchemy import Column, Integer, Text, DateTime, String, ForeignKey
from pydantic import BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .clause import ClauseOut, ClauseAllOut
from datetime import datetime

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.id"))

    url = Column(Text, nullable=False)
    global_score = Column(Integer)
    rating = Column(String(20))
    status = Column(String(20), nullable=False)

    summary = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    clauses = relationship("Clause", back_populates="analysis")

class AnalysisOut(BaseModel):
    id: uuid.UUID
    url: str
    global_score: int | None
    rating: str | None
    summary: str | None
    updated_at: datetime | None

    clauses: list[ClauseOut]

    class Config:
        from_attributes = True

class AnalysisDetailsOut(BaseModel):
    id: uuid.UUID
    url: str
    global_score: int | None
    rating: str | None
    summary: str | None
    updated_at: datetime | None

    clauses: list[ClauseAllOut]

    class Config:
        from_attributes = True