from fastapi import Request
from pathlib import Path
import asyncio
import os
import json
from backend.transform_kpis import compute

# Interval between checks (in seconds)
inter_seconds = 10

# Resolve paths
root_path = Path(__file__).resolve().parent
project_root = root_path.parents[1]
ghaminer_root = project_root / "GHAminer"  # adjust if GHAminer is elsewhere

# Target files
csv_path_read = ghaminer_root / "builds_features.csv"
json_path_write = project_root / "gha-dashboard-pipeline" / "output" / "KPIs.json"
json_path_write.parent.mkdir(parents=True, exist_ok=True)

def get_line_number():
    """Returns the number of data lines (excluding header) in the CSV file."""
    try:
        with open(csv_path_read, "r", encoding="utf-8") as f:
            return sum(1 for _ in f) - 1
    except Exception as e:
        print(f"[csv_checker] error reading CSV: {e}")
        return 0

async def check_csv(request: Request):
    last_line_count = 0

    while not await request.is_disconnected():
        try:
            if csv_path_read.exists():
                curr_line_count = get_line_number()

                if curr_line_count > last_line_count:
                    delta = curr_line_count - last_line_count
                    print(f"[csv_checker] {delta} new lines found")
                    last_line_count = curr_line_count

                    try:
                        data_to_send = compute(csv_path_read, json_path_write)
                        serialized = json.dumps(data_to_send)
                        yield f"data:{serialized}\n\n"
                    except Exception as e:
                        print(f"[KPI transformer] error: {e}")
                else:
                    print("[csv_checker] no new lines found")
            else:
                print(f"[csv_checker] CSV not found at {csv_path_read}")

            await asyncio.sleep(inter_seconds)

        except Exception as e:
            print(f"[csv_checker] exception loop error: {e}")
            await asyncio.sleep(1)

if __name__ == "__main__":
    print("csv_checker running in terminal mode")