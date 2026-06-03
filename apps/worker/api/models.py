from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()


class Website(Base):
    __tablename__ = "websites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    domain = Column(String, nullable=False)
    normalized_url = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    analyses = relationship("Analysis", back_populates="website")


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(String, nullable=False)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.id"), nullable=False)
    url = Column(String, nullable=False)
    global_score = Column(Float, nullable=False)
    rating = Column(String, nullable=False)
    status = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    website = relationship("Website", back_populates="analyses")
    clauses = relationship("Clause", back_populates="analysis")


class Clause(Base):
    __tablename__ = "clauses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"), nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    score_impact = Column(Float, nullable=False)
    title = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("Analysis", back_populates="clauses")
