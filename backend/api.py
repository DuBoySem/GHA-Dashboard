from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from backend.gha_runner import run_ghaminer_if_needed
from backend.csv_checker import check_csv
import logging

router = APIRouter(prefix="/api")

@router.post("/refresh")
async def refresh(request: Request):
    """
    Triggers a refresh by running GHAminer for the given repo URL and GitHub token.
    """
    data = await request.json()
    repo_url = data.get("repo_url")
    token = data.get("token")

    if not repo_url:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Missing 'repo_url'."})
    if not token:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Missing 'token'."})

    try:
        triggered = run_ghaminer_if_needed(repo_url, token)
        return JSONResponse(content={"status": "refreshed" if triggered else "up-to-date"})
    except Exception as e:
        logging.exception("Failed to run GHAminer")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

@router.get("/csv_checker")
async def stream_new_data(request: Request):
    """
    Stream new CSV metrics in real-time via Server-Sent Events.
    """
    return StreamingResponse(check_csv(request), media_type="text/event-stream")