from pydantic import BaseModel, HttpUrl

class AnalyzeRequest(BaseModel):
    url: HttpUrl

class AnalyzeResponse(BaseModel):
    success: bool
    url: HttpUrl
    score: float
    rating: str
    message: str