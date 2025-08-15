# GHA Dashboard Pipeline

This project builds an automated dashboard that monitors GitHub Actions workflows for a target repository (e.g., `milvus-io/milvus`). It uses the open-source tool **GHAminer** to extract workflow metrics and visualizes them in a dashboard made in ReactJS injected in the GitHub repository page by a Chrome extension.

## Objectives

- Automatically extract GitHub Actions workflow data
- Visualize KPIs in an interactive ReactJS dashboard

## Tech Stack

| Component         | Purpose                                        |
|-------------------|------------------------------------------------|
| GHAminer          | Extract GitHub Actions build + test metrics    |
| Python            | Automate ingestion and transformation scripts  |
| Chrome Extension  | Inject the dashboard in GitHub                 |
| ReactJS           | Visual dashboard for KPIs and trends           |

## Wrapper Setup (Python)

- Having Python 3.11 or later on your machine
- Having **pip** installed (already installed with the latest Python versions)
- Having **pipenv** installed (run the following command)

```bash
pip install pipenv
```

- Having **pipenv** in your environment variable *PATH* (to verify, run the following command)

```bash
pipenv --version
```

### 1. Install Dependencies

Run the following command in the root directory of the project:

```bash
pipenv install
```

### 2. Activate Virtual Environment

When developing specifically in the backend, it's useful to access the virtual environment:

```bash
pipenv shell
```

It's not necessary if you want to run the backend server.

### 4. Run the Backend Server

Go to the `./extension` path and run the following command:

```bash
npm run backend
```

Server will be running at: [http://localhost:8000](http://localhost:8000)

## Dashboard Setup (React)

- The Dashboard is the HTML page that will display the data as tables and graphs
    - Will be injected by the Chrome extension directly in your favorite repository Github page
- The source files are located in the `./extension/dashboard` folder
- The project uses Webpack to build and generate final files in the `./extension/dist` folder

### 1. Install dependencies

In the `./extension` folder, run the following command:

```bash
npm install
```

### 2. Build the dashboard

After modifications, the dashboard must be built again with the following command:

```bash
npm run build
```

The command must be ran from the `./extension` folder.
As long as the command is still executing, the dashboard is not built yet.
You have to wait the end of the execution before to go to the next step.

### 3. Load the extension in Chrome

1. Go to the [chrome://extensions](extensions) page in Chrome.
2. Enable the developer mode (top-right corner).
3. Click on the button **Load unpacked extension**.
4. Select the `./extension/dist` folder.

## Project Structure

```text
DHA-Dashboard/
├── .github/workflows/     # GitHub Actions scheduler
├── extensions/dashboard/  # Dashboard's source files
├── extensions/dist/       # Dashboard's built and ready to be used as extension
├── dashboard/             # Dashboard's source files that can be ran locally on a ReactJS server
├── output/                # Optional JSON output of extracted metrics
├── backend/               # Python scripts for ingestion and data cleaning
```

## Tracked KPIs

- Workflow Run Failures
- Workflow Run Durations
- Workflow passed tests
- Changed Lines in Workflows
- Failed Workflow Execution Time
- PRs Triggered per Workflow
- Failure rate by Contributor

## License

This project is released under the **MIT License**. See the `LICENSE` file for details.

# Privacy Policy

GHA-Dashboard is an open-source Chrome extension that helps GitHub users analyze their GitHub Actions workflow performance through a visual dashboard injected directly into the GitHub UI.  

## What the Extension Does

- Displays a metrics dashboard directly on GitHub repository pages.  
- Optionally connects to the GHAMiner tool running on your local machine to fetch precomputed workflow metrics.

## What the Extension Doesn't

- It does not collect or store any personal data.
- It does not track your browsing or activity.
- It does not send any data to external servers.
- It does not access your GitHub credentials or private repositories.

## Your Data, Your Control

All metrics and data used by the extension stay on your local machine. If you use GHAMiner, it processes public GitHub repository data locally — you remain the sole owner of that data.  

## Open Source Transparency

This project is fully open-source. You’re welcome to explore the code, suggest improvements, or contribute.
