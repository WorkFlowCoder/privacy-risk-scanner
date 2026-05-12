from fastapi import APIRouter

from app.schemas.analysis import AnalyzeRequest, AnalyzeResponse

router = APIRouter(
    prefix="/analyze",
    tags=["analyze"]
)

@router.post("/")
async def analyze_website(payload: AnalyzeRequest) -> AnalyzeResponse:
    return {
        "success": True,
        "url": payload.url,
        "score":72,
        "rating": "orange",
        "message": "Mock analysis completed"
    }
