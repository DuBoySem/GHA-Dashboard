from celery import Celery
from backend.gha_runner import run_ghaminer_if_needed

celery_app = Celery(
    "tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

@celery_app.task
def run_ghaminer_task(repo_url, token):
    return run_ghaminer_if_needed(repo_url, token)