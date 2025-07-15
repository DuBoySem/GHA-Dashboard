import json
import os
import shutil
import subprocess
import sys
import threading
from datetime import datetime, timedelta
from pathlib import Path
import re
import yaml

BASE_DIR = Path(__file__).resolve().parent.parent
GHAMINER_PATH = BASE_DIR / "ghaminer"
GHAMETRICS_PATH = GHAMINER_PATH / "src" / "GHAMetrics.py"
STATE_FILE = BASE_DIR / "output" / "state.json"
OUTPUT_DIR = BASE_DIR / "output" / "raw"


def clone_or_update_ghaminer():
    repo_url = "https://github.com/stilab-ets/GHAminer.git"

    if GHAMINER_PATH.exists() and GHAMETRICS_PATH.exists():
        print("[wrapper] GHAMiner already present. Pulling latest changes...")
        subprocess.run(["git", "-C", str(GHAMINER_PATH), "pull"], check=True)
        return

    if GHAMINER_PATH.exists():
        print(
            "[wrapper] GHAMiner folder exists but is incomplete. Removing and recloning..."
        )
        shutil.rmtree(GHAMINER_PATH)

    subprocess.run(
        ["git", "clone", repo_url, str(GHAMINER_PATH)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT,
    )
    patch_gha()
    return


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
        return
    print("[wrapper] Ensuring GHAMiner is present...")
    print("[wrapper] Starting GHAMiner pipeline...")
    clone_or_update_ghaminer()
    print("[wrapper] GHAMiner ready.")
    if not GHAMETRICS_PATH.exists():
        raise FileNotFoundError("[wrapper] GHAMetrics.py not found")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    repo_name = repo_url.split("/")[-1].replace(".git", "")

    # execute GHAMiner
    print(f"[wrapper] Running GHAMiner on {repo_name}...")
    run_gha_async(repo_url, token)

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump({"last_run": datetime.utcnow().isoformat()}, f)


# function to set bahaviour of the monitoring thread
# logs in console success or faillure of GHA's execution
def gha_monitor(process):
    stdout, stderr = process.communicate()
    if process.returncode == 0:
        print("[wrapper=>GHAminer] GHA finished the execution")
    else:
        print("[wrapper=> GHAMiner] ERROR!! GHAMiner")
        print("[wrapper=> GHAMiner] STDOUT: ", stdout)
        print("[wrapper=> GHAMiner] STDERR: ", stderr)


def run_gha_async(repo_url, token):
    process = subprocess.Popen(
        [
            sys.executable,
            str(GHAMETRICS_PATH),
            "--s",
            repo_url,
            "--token",
            token,
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        #!!uncomment to debug GHAMiner
        #!! might not work on windows
        # stdout=subprocess.PIPE,
        # stderr=subprocess.PIPE,
        # text=True,
    )
    # start the thread
    threading.Thread(target=gha_monitor, args=(process,)).start()


# code to change ghaminer's coding automatically
def patch_gha():
    base = Path(__file__).resolve().parent
    # path of files to change
    py_path = (base / "../ghaminer/src/GHAMetrics.py").resolve()
    yaml_path = (base / "../ghaminer/src/config.yaml").resolve()
    # new python code
    py_code = """
def load_config(config_file='config.yaml'):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, config_file)
    try:
        with open(config_path, 'r') as file:
            config = yaml.safe_load(file)
        return config
    except Exception as e:
        logging.error(f"Failed to load config file {config_path}: {e}")
        return {}
    """
    # new yaml config
    yaml_config = {
        'fetch_job_details': True,
        'fetch_test_parsing_results': True,
        'fetch_commit_details': True,
        'fetch_pull_request_details': True,
        'fetch_sloc': True
    }

    # ------change python code
    with open(py_path,'r') as py_file:
        py_content=py_file.read();

    pattern = r'def\s+load_config\s*\([^)]*\):(?:\n\s+.+)+'
    py_content = re.sub(pattern,py_code,py_content)
    with open(py_path,'w') as py_file:
        py_file.write(py_content)
    
    print("[GHA Runner]: changed 'load_config' function in GHAMetrics")
    #-------
    # --- change yaml config
    with open(yaml_path, 'r') as y_file:
        yaml_content = yaml.safe_load(y_file)

    # Apply the updates
    for key, value in yaml_config.items():
        yaml_content[key] = value

    with open(yaml_path, 'w') as y_file:
        yaml.safe_dump(yaml_content, y_file)

    print("[GHA Runner]: changed config values in ghaminer")


