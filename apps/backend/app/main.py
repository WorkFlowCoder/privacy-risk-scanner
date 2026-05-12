from fastapi import FastAPI

from app.api.routes.analyze import router as analyze_router

app = FastAPI(
    title="Privacy Rist Scanner API",
    version="0.1.0"
)

app.include_router(analyze_router)

@app.get("/")
async def root():
    return {"message": "Privacy Rist Scanner API running"}