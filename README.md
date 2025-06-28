# GHA Dashboard Pipeline

This project builds an automated dashboard that monitors GitHub Actions workflows for a target repository (e.g., `milvus-io/milvus`). It uses the open-source tool **GHAminer** to extract workflow metrics, stores them in **PostgreSQL**, and visualizes insights via **Grafana**.

## Objectives

- Automatically extract GitHub Actions workflow data
- Store metrics in a structured PostgreSQL database
- Visualize KPIs in an interactive Grafana dashboard
- Enable future extensions for machine learning (ML) predictions

## Tech Stack

| Component      | Purpose                                        |
|----------------|------------------------------------------------|
| GHAminer       | Extract GitHub Actions build + test metrics    |
| Python         | Automate ingestion and transformation scripts  |
| ReactJS        | Visual dashboard for KPIs and trends           |

## Wrapper Setup (Python)

- Having Python 3.13.2 in your machine
### 1. Install Dependencies

```bash
pipenv install
```

> Make sure you have Python 3.11+ and `pipenv` installed.

### 2. Activate Virtual Environment

```bash
pipenv shell
```

### 3. Set up Environment Variables

Create a `.env` file at the root of the project:

```env
GITHUB_TOKEN=your_personal_access_token
```

### 4. Run the Backend Server

```bash
pipenv run uvicorn backend.app:app --reload
```

Server will be running at: [http://localhost:8000](http://localhost:8000)

### 5. Trigger GHAMiner Run

Send a POST request to the `/refresh` endpoint:

```http
POST http://localhost:8000/refresh
```

## Dashboard Setup (React)

- The Dashboard is the HTML page that will display the data as tables and graphs
    - Will be hosted by the github pages feature that allows to host publicly a static website (to discuss)
- The source files are located in the dashboard folder
- The project uses Webpack to build and generate final files in the docs folder
- To run the website (Dashboard) locally you will have to:
    - `cd `into the dashboard folder
    - run the command: `npm install`
    - run the command: `npm run dev`
    - go to the local address given from terminal (use web browser)
- The data_samples.csv file is here for testing
    - After uploading it, there will be a table that has the file's content displayed (for now)
    - Console logs the content of the csv file too
- Usefull commands:
    - `npm run build` used to build and bundle the files without running a local server 
    - `npm run dev` used to build and bundle the files, then to run a local server to test and see the outcome


## Project Structure

```text
gha-dashboard-pipeline/
├── .github/workflows/     # GitHub Actions scheduler
├── api/                   # REST API to expose metrics
├── config/                # Repo and database config files
├── dashboard/             # Dashboard's source files ; Where we implement the dashboard site
├── docs/                  # Various documentation
├── output/                # Optional CSV output of extracted metrics
├── backend/               # Python scripts for ingestion and data cleaning
```

## Tracked KPIs

- Workflow success rate
- Average build duration
- Top failing workflows
- PR authors with repeated failures
- Workflow volume over time

## Future Extensions (ML)

The data pipeline is designed to support future machine learning use cases, such as:
- Predicting workflow failure likelihood
- Forecasting build duration
- Scoring workflow flakiness
- Clustering logs for failure analysis


## License

This project is released under the **MIT License**. See the `LICENSE` file for details.
