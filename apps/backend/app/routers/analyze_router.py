from http.client import HTTPException
from celery import Celery
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..api.database import get_db
from ..api.repository import AnalysisRepository
from ..schemas.analysis import AnalyzeRequest, AnalyzeResponse, AnalyzeRequestContent
from ..models.analyze import AnalysisOut, AnalysisDetailsOut

router = APIRouter(
    prefix="/analyze",
    tags=["analyze"]
)

celery_client = Celery(
    "backend_client",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
)

@router.post("/")
def analyze_policy(data: AnalyzeRequestContent):
    task = celery_client.send_task(
        "analyze_policy_task",
        args=[data.content],
    )

    return {
        "success": True,
        "task_id": task.id,
        "status": "queued",
    }

#@router.get("/")
#def analyze() -> AnalyzeResponse:
#    get_db()
#    return {
#        "success": False,
#        "url": "http://example.com",
#        "score":-1,
#        "rating": "undefined",
#        "message": "undefined URL"
#    }

@router.post("/")
def analyze_website(payload: AnalyzeRequest) -> AnalyzeResponse:
    return {
        "success": True,
        "url": payload.url,
        "score":72,
        "rating": "orange",
        "message": "Mock analysis completed"
    }

@router.get("/results", response_model=list[AnalysisOut])
def get_all_results(db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)
    res = repo.get_all()
    return res

@router.get("/{analysis_id}", response_model=AnalysisDetailsOut)
async def get_analysis(analysis_id: str, db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)
    analysis = repo.get_by_id(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return analysis