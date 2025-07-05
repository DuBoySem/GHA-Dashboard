import json
import os
import sys
import threading
import time
from datetime import datetime, timedelta
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent.parent
STATE_FILE = BASE_DIR / "output" / "state.json"
OUTPUT_DIR = BASE_DIR / "output" / "raw"

GHAMINER_API_URL = "http://localhost:8001/run"  # adjust if hosted elsewhere


def should_run():
    if STATE_FILE.exists():
        with open(STATE_FILE) as f:
            last_run = datetime.fromisoformat(
                json.load(f).get("last_run", "1970-01-01T00:00:00")
            )
        if datetime.utcnow() - last_run < timedelta(minutes=5):
            print("[wrapper] GHAMiner run is up-to-date.")
            return False
    return True


def run_ghaminer_if_needed(repo_url: str, token: str):
    if not should_run():
        return False

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    print(f"[wrapper] Posting to: {GHAMINER_API_URL}")
    print(f"[wrapper] Payload: {{'repo_url': '{repo_url}', 'token': 'gith...'}}")

    try:
        response = requests.post(GHAMINER_API_URL, json={"repo_url": repo_url, "token": token})
        response.raise_for_status()
        print("[wrapper=>GHAminer] GHAminer API call successful.")
    except Exception as e:
        print(f"[wrapper=>GHAminer] API call failed: {e}")
        return False

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({"last_run": datetime.utcnow().isoformat()}, f)

    return True