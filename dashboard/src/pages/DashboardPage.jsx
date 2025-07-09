import {useEffect, useState, useMemo} from "react";
import WorkflowStddevChart from "../charts/WorkflowStddevChart.jsx";
import WorkflowFailureChart from "../charts/WorkflowFailureChart.jsx";
import {IssuerFailureTable} from "../tables/IssuerFailureTable.jsx";
import AveragePassedTestsChart from "../charts/AveragePassedTestsChart.jsx";
import AverageChangedTestsChart from "../charts/AverageChangedTestsChart.jsx";
import AverageFailedWorkflowExecutionTimeChart from "../charts/AverageFailedWorkflowExecutionTimeChart.jsx";
import {useStore} from "../store/useStore.js";
import SideMenu from "../components/menu/SideMenu.jsx";
import * as d3 from "d3-scale-chromatic";

const DashboardPage = () => {
    const token = useStore((state) => state.token)
    const repoFromStore = useStore((state) => state.repoUrl)
    const saveNewRepoUrl = useStore((state) => state.setRepoUrl)
    const [repoUrl, setRepoUrl] = useState("");
    const [repoName, setRepoName] = useState("");
    const [eventSource, setEventSource] = useState(null)
    const [kpis, setKpis] = useState({});
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);
    const fetchKpis = async (repo) => {
        if (repo.trim()) {
            try {
                if (eventSource) {
                    eventSource.close();
                }

                const source = new EventSource("http://localhost:8000/api/csv_checker");
                setEventSource(source)

                source.onmessage = (event) => {
                    try {
                        const parsedData = JSON.parse(event.data);
                        setKpis(parsedData);

                        if (parsedData?.StdDevWorkflowExecutions) {
                            const allWorkflows = parsedData.StdDevWorkflowExecutions.map(wf => wf.workflow_name);
                            setSelectedWorkflows(allWorkflows);
                        }
                    } catch (e) {
                        console.log("Error parsing streamed kpis: ", e);
                    }
                };

                source.onerror = (e) => {
                    console.error("Error SSE: ", e);
                    source.close();
                };

                await new Promise((resolve) => setTimeout(resolve, 5000));

                await fetch("http://localhost:8000/api/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({repo_url: repoFromStore, token: token}),
                });

                if (repoUrl && repoUrl !== '' && repoUrl !== repoFromStore) {
                    saveNewRepoUrl(repoUrl);
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to refresh repo.");
            }
        }
    }

    useEffect(() => {
        setRepoName(repoFromStore.split('/').slice(-1)[0]);

        const launch = async () => {
            try {
                await fetchKpis(repoFromStore);
            } catch (e) {
                console.error('Erreur fetchKpis', e);
            }
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        launch();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRepoName(repoUrl.split('/').slice(-1)[0]);

        await fetchKpis(repoUrl)
    };

    const handleWorkflowToggle = (workflowName) => {
        setSelectedWorkflows((prevSelected) => {
            if (prevSelected.includes(workflowName)) {
                return prevSelected.filter((name) => name !== workflowName);
            } else {
                return [...prevSelected, workflowName];
            }
        });
    };

    const filteredWorkflowStddev = useMemo(() => {
        if (!kpis.StdDevWorkflowExecutions) {
            return [];
        }

        return kpis.StdDevWorkflowExecutions.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.StdDevWorkflowExecutions, selectedWorkflows]);

    const filteredWorkflowFailures = useMemo(() => {
        if (!kpis.AverageFaillureRatePerWorkflow) {
            return [];
        }

        return kpis.AverageFaillureRatePerWorkflow.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AverageFaillureRatePerWorkflow, selectedWorkflows]);

    const filteredAveragePassedTests = useMemo(() => {
        if (!kpis.AveragePassedTestsPerWorkflowExcecution) {
            return [];
        }

        return kpis.AveragePassedTestsPerWorkflowExcecution.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AveragePassedTestsPerWorkflowExcecution, selectedWorkflows]);

    const filteredAverageChangedTests = useMemo(() => {
        if (!kpis.AverageChangedTestsPerWorkflowExecution) {
            return [];
        }

        return kpis.AverageChangedTestsPerWorkflowExecution.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AverageChangedTestsPerWorkflowExecution, selectedWorkflows]);

    const filteredAverageFailedWorkflowExecutionTime = useMemo(() => {
        if (!kpis.AverageFailedWorkflowExecutionTime) {
            return [];
        }

        return kpis.AverageFailedWorkflowExecutionTime.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AverageFailedWorkflowExecutionTime, selectedWorkflows]);

    const allWorkflowNames = useMemo(() => {
        return kpis.AverageFaillureRatePerWorkflow ? kpis.AverageFaillureRatePerWorkflow.map(wf => wf.workflow_name) : [];
    }, [kpis.AverageFaillureRatePerWorkflow]);

    const colorMap = useMemo(() => {
        return Object.fromEntries(
            allWorkflowNames.map((workflowName, index) => [workflowName, d3.schemeCategory10[index % 10]])
        );
    }, [allWorkflowNames]);

    return (
        <div className="h-screen flex">
            <SideMenu
                workflows={allWorkflowNames}
                selectedWorkflows={selectedWorkflows}
                onWorkflowToggle={handleWorkflowToggle}
                colorsMap={colorMap}
            />
            <div className="flex-1 p-8 bg-white flex flex-col overflow-hidden">
                <div className="flex flex-row items-baseline justify-center gap-2">
                    <h2 className="text-5xl text-black font-weight-bold mb-6 mr-auto">{repoName}</h2>
                    {/*<form onSubmit={handleSubmit} className="flex gap-2">*/}
                    {/*    <input*/}
                    {/*        type="text"*/}
                    {/*        value={repoUrl}*/}
                    {/*        onChange={(e) => setRepoUrl(e.target.value)}*/}
                    {/*        placeholder="https://github.com/user/repo"*/}
                    {/*        className="border border-gray-300 px-4 py-2 rounded w-96"*/}
                    {/*    />*/}
                    {/*    <button*/}
                    {/*        type="submit"*/}
                    {/*        className="cursor-pointer bg-black text-white px-4 py-2 rounded hover:bg-blue-700"*/}
                    {/*    >*/}
                    {/*        Analyse GitHub repo*/}
                    {/*    </button>*/}
                    {/*</form>*/}
                </div>
                <div className="divide-y divide-gray-200 flex-1 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-4 gap-10 mb-3">
                        <WorkflowStddevChart data={filteredWorkflowStddev} colorMap={colorMap}/>
                        <AveragePassedTestsChart data={filteredAveragePassedTests}/>
                        <AverageChangedTestsChart data={filteredAverageChangedTests} colorMap={colorMap}/>
                        <AverageFailedWorkflowExecutionTimeChart data={filteredAverageFailedWorkflowExecutionTime}/>
                    </div>
                    <div className="grid grid-cols-2 gap-10 flex-1 flex flex-col overflow-hidden">
                        <WorkflowFailureChart data={filteredWorkflowFailures}/>
                        <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
