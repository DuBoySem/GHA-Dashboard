import React, { useState } from "react";
import WorkflowStddevChart from "../charts/WorkflowStddevChart.jsx";
import WorkflowFailureChart from "../charts/WorkflowFailureChart.jsx";
import {IssuerFailureTable} from "../tables/IssuerFailureTable.jsx";
import ReactLogo from "../assets/react.svg"

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const DashboardPage = ({ kpis, onReset, onRepoSubmit }) => {
    const [repoUrl, setRepoUrl] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (repoUrl.trim()) {
            try {
                const response = await fetch("http://localhost:8000/api/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ repo_url: repoUrl, token: GITHUB_TOKEN }),
                });

                const result = await response.json();
                alert(`Status: ${result.status}`);
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to refresh repo.");
            }
        }
    };
    return (
        <div className="mx-56 p-8 bg-white">
            <div className="flex flex-row items-baseline justify-center gap-2">
                <img src={ReactLogo} alt="React Logo" width={45} height={45}/>
                <h2 className="text-5xl text-blue-600 font-semibold mb-6 mr-auto">GHA Dashboard</h2>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/user/repo"
                        className="border border-gray-300 px-4 py-2 rounded w-96"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Analyser dépôt GitHub
                    </button>
                </form>
            </div>
            <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-2 gap-10 mb-3">
                    <WorkflowStddevChart data={kpis.workflowStddev}/>
                    <WorkflowFailureChart data={kpis.workflowFailures}/>
                </div>
                <IssuerFailureTable data={kpis.issuerFailures}/>
            </div>
        </div>
    )
}

export default DashboardPage