import uuid
from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base

Base = declarative_base()


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
    raw_policy_text = Column(Text)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())