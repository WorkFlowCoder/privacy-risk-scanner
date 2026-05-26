from celery import Celery

celery = Celery(
    "worker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
    include=["tasks.policy"], 
)

celery.conf.update(
    task_track_started=True
)