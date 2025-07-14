# GHA Dashboard

This is a React + Vite application that lets you authenticate with a GitHub token and visualize GitHub Actions KPIs for a specific repository. The dashboard is generated dynamically using the GitHub API and displayed using interactive charts with Recharts and Tailwind CSS.

---

## Authentication & Repository Input

To get started, the user must:

1. Enter a valid GitHub personal access token (`github_pat_...` format)
2. Enter the full GitHub repository URL (e.g., `https://github.com/user/repo`)

If the token is valid and the repository exists, the dashboard will be displayed.

---

## Main Features

* GitHub token validation via `GET https://api.github.com/user`
* Repository validation and KPI computation via GitHub API
* Interactive KPI visualizations:
  * Workflow failure rate (pie chart) : number of failures per workflow
  * Workflow duration statistics (bar chart) : standard deviation of workflow durations
  * Failure rate by contributor (table or chart) : failure rate by issuer
* Clean and responsive UI using Tailwind CSS
* In-memory/session-based token storage (not persisted across browser sessions)

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/satnam-walia/gha-dashboard-pipeline.git
cd dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run frontend
```

4. Open the app in your browser:

```
http://localhost:5173
```

---

## Disclaimer

* GitHub tokens are stored only temporarily in sessionStorage, and are encrypted in-memory.
* Never share your token or commit it to version control.
* This tool is intended for local visualization and debugging only.

## Technologies

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Recharts](https://recharts.org/)
* [Zustand](https://github.com/pmndrs/zustand)
* [CryptoJS](https://github.com/brix/crypto-js)
* GitHub REST API 
