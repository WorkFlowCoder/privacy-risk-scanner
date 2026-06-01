from urllib.parse import urlparse
from sqlalchemy.orm import Session
from sqlalchemy import select
from .models import Website


def get_or_create_website(db: Session, url: str):
    """Get or create a website record using SQLAlchemy ORM"""
    parsed = urlparse(url)
    
    domain = parsed.netloc.lower()
    normalized_url = f"{parsed.scheme}://{parsed.netloc}"
    
    # Try to find existing website
    stmt = select(Website).where(Website.normalized_url == normalized_url)
    existing = db.execute(stmt).scalar_one_or_none()
    
    if existing:
        return existing.id
    
    # Create new website
    new_website = Website(
        domain=domain,
        normalized_url=normalized_url
    )
    db.add(new_website)
    db.flush()  # Flush to get the ID without committing
    
    website_id = new_website.id
    db.commit()
    
    return website_id
