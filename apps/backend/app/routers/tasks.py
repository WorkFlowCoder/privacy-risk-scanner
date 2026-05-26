from fastapi import APIRouter
from celery import Celery
from celery.result import AsyncResult

router = APIRouter(prefix="/tasks")

celery_client = Celery(
    "backend_client",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
)

@router.get("/{task_id}")
def get_task_status(task_id: str):
    task = AsyncResult(task_id, app=celery_client)

    if task.state == "PENDING":
        return {"status": "pending"}

    if task.state == "STARTED":
        return {"status": "processing"}

    if task.state == "SUCCESS":
        return {
            "status": "done",
            "result": task.result,
        }

    if task.state == "FAILURE":
        return {
            "status": "failed",
            "error": str(task.result),
        }

    return {
        "status": task.state
    }