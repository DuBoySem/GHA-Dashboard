from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from gha_runner import run_ghaminer_if_needed
import logging
# from backend.csv_checker import check_csv
from csv_checker import check_csv

router = APIRouter(prefix="/api")


@router.post("/refresh")
async def refresh(request: Request):
    """
    Triggers a refresh by running GHAminer for the given repo URL and GitHub token.
    """
    data = await request.json()
    # print("DEBUG POST BODY:", data)
    repo_url = data.get("repo_url")
    token = data.get("token")

    if not repo_url:
        return JSONResponse(status_code=400,
                            content={"status": "error", "message": "Missing 'repo_url'."})
    if not token:
        print("DEBUG: Missing token in POST body.")
        return JSONResponse(status_code=400,
                            content={"status": "error", "message": "Missing 'GITHUB_TOKEN'."})

    try:
        triggered = run_ghaminer_if_needed(repo_url, token)
        return JSONResponse(content={"status": "refreshed" if triggered else "up-to-date"})
    except Exception as e:
        logging.exception("Failed to run GHAminer")
        print("error: "+ str(e))
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})

# route to enable the event stream
@router.get("/csv_checker")
async def stream_new_data(request: Request):
    return StreamingResponse(check_csv(request), media_type="text/event-stream")
    
