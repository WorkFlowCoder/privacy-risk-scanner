from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..api.database import get_db
from ..api.repository import AnalysisRepository
from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse

router = APIRouter(
    prefix="/analyze",
    tags=["analyze"]
)

@router.get("/")
def analyze() -> AnalyzeResponse:
    get_db()
    return {
        "success": False,
        "url": "http://example.com",
        "score":-1,
        "rating": "undefined",
        "message": "undefined URL"
    }


@router.post("/")
def analyze_website(payload: AnalyzeRequest) -> AnalyzeResponse:
    return {
        "success": True,
        "url": payload.url,
        "score":72,
        "rating": "orange",
        "message": "Mock analysis completed"
    }

@router.get("/results")
def get_all_results(db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)
    return repo.get_all()