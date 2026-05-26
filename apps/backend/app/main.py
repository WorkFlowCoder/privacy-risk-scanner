from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import analyze_router, tasks

app = FastAPI(
    title="Privacy Risk Scanner API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router.router)
app.include_router(tasks.router)

@app.get("/")
async def root():
    return {"message": "Privacy Risk Scanner API running"}