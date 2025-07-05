# GHA Dashboard
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-blue)

An observability pipeline that extracts GitHub Actions workflow metrics using [GHAminer](https://github.com/stilab-ets/GHAminer), processes them with a Python backend, and visualizes KPIs through a standalone or GitHub-integrated dashboard.

## What It Does

- Extracts GitHub Actions build & test metrics via [GHAminer](https://github.com/stilab-ets/GHAminer)
- Triggers runs through a FastAPI API
- Queues long-running jobs using Celery + Redis
- Visualizes results in a frontend dashboard or GitHub Chrome extension


## Tech Stack

| Component       | Role                                      |
|----------------|-------------------------------------------|
| GHAminer        | Extracts workflow and test log metrics    |
| FastAPI         | Backend API to trigger GHAminer runs      |
| Celery + Redis  | Background task queue                     |
| React           | Dashboard rendering (standalone + embedded) |
| Chrome Extension| Injects dashboard into GitHub UI          |

> PostgreSQL is not yet integrated — KPIs are currently saved to local CSVs.


## ⚙️ Local Setup

### 🔧 Prerequisites

- Python 3.11+
- Docker (for Redis)
- GitHub Personal Access Token
- Chrome browser (for extension)

### 1. Load Chrome Extension
To inject the dashboard directly into GitHub repo pages:
```
cd extension
npm install
npm run build
```

Then:
1. Open chrome://extensions
2. Enable Developer Mode
3. Click Load unpacked
4. Select the extension/dist/ folder
5. Visit any GitHub repo you have access to
6. A new tab named Dashboard will appear


### 2.Install Dependencies

```
pipenv install
```
### 3.Start Redis (via Docker)
```
pipenv run redis
```
### 4. Start Backend Services
```
pipenv run backend    # FastAPI API
pipenv run worker     # Celery worker
```

### Project Structure
```
gha-dashboard/
├── backend/        # API, Celery tasks, ingestion logic
├── dashboard/      # Standalone React dashboard
├── extension/      # Chrome extension to inject dashboard in GitHub
├── output/         # KPI exports (CSV/JSON)
├── GHAminer/       # GitHub Actions log metrics extractor
└── Pipfile         # Project dependencies & scripts
```
