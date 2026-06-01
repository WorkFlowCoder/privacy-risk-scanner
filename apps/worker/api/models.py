from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Website(Base):
    __tablename__ = "websites"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(255), nullable=False)
    normalized_url = Column(String(500), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    analyses = relationship("Analysis", back_populates="website")


class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False)
    website_id = Column(Integer, ForeignKey("websites.id"), nullable=False)
    url = Column(String(500), nullable=False)
    global_score = Column(Float, nullable=False)
    rating = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    website = relationship("Website", back_populates="analyses")
    clauses = relationship("Clause", back_populates="analysis")


class Clause(Base):
    __tablename__ = "clauses"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    category = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    score_impact = Column(Float, nullable=False)
    title = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    analysis = relationship("Analysis", back_populates="clauses")
