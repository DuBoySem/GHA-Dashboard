import subprocess
from backend.gha_runner import run_ghaminer_if_needed

def run_all():
    try:
        run_ghaminer_if_needed()
    except subprocess.CalledProcessError as e:
        print(f"❌ GHAMiner failed\n{e}")
