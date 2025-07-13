import {useEffect, useState, useMemo} from "react";
import WorkflowStddevChart from "../charts/WorkflowStddevChart.jsx";
import WorkflowFailureChart from "../charts/WorkflowFailureChart.jsx";
import {IssuerFailureTable} from "../tables/IssuerFailureTable.jsx";
import AveragePassedTestsChart from "../charts/AveragePassedTestsChart.jsx";
import AverageChangedTestsChart from "../charts/AverageChangedTestsChart.jsx";
import AverageFailedWorkflowExecutionTimeChart from "../charts/AverageFailedWorkflowExecutionTimeChart.jsx";
import {useStore} from "../store/useStore.js";
import SideMenu from "../components/menu/SideMenu.jsx";
import React from "react";
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
                // sends refresh request
                window.postMessage(
                    {
                        source:"GHA_DASHBOARD",
                        message:{
                            type:"REFRESH",
                            // payload: JSON.stringify({ repo_url: repoFromStore, token: token }),
                            payload: { repo_url: repoFromStore, token: token },
                        }
                        // headers: {
                        //     "Content-Type": "application/json",
                        // },
                    },"*");


                // await fetch("http://localhost:8000/api/refresh", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json",
                //     },
                //     body: JSON.stringify({ repo_url: repoFromStore, token: token }),
                // });

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

        //listen to SSE updates
        const handleSSEUpdate = msg =>{
            console.log("in sse handler")
            //make sure its from the SSE stream
            if(msg.source !== window) return;
            if(msg.data.source !== "BACKGROUND_SCRIPT") return;
            if(msg.data.type==="KPI_STREAM"){
                try {
                    //parse payload to json
                    // const parsedData = JSON.parse(msg.data.payload);
                    const parsedData = msg.data.payload;
                    // console.log("parsed data prints")
                    console.log("parsed data prints", parsedData);
                    //populate dashboard
                    setKpis(parsedData);
                    if (parsedData?.StdDevWorkflowExecutions) {
                        const allWorkflows = parsedData.StdDevWorkflowExecutions.map(wf => wf.workflow_name);
                        setSelectedWorkflows(allWorkflows);
                    }
                } catch (e) {
                    console.log("Error parsing streamed kpis: ", e);
                }
            }
        }
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

        window.addEventListener("message",handleSSEUpdate);
        launch();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener("message",handleSSEUpdate);
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
        // <div className="h-screen flex">
        <div className="min-h-full w-full flex">
            <SideMenu
                workflows={allWorkflowNames}
                selectedWorkflows={selectedWorkflows}
                onWorkflowToggle={handleWorkflowToggle}
                colorsMap={colorMap}
            />
            <div className="flex-1 p-8 bg-white flex flex-col overflow-hidden">
                <div className="flex flex-row items-baseline justify-center gap-2">
                    <h2 className="text-5xl text-black font-semibold mr-auto">{repoName}</h2>
                </div>
                <div className="divide-y divide-gray-200 flex-1 flex flex-col overflow-hidden">
                    <div className="grid grid-cols-4 gap-10 mb-3">
                        <WorkflowStddevChart data={filteredWorkflowStddev} colorMap={colorMap} />
                        <AveragePassedTestsChart data={filteredAveragePassedTests} colorMap={colorMap}/>
                        <AverageChangedTestsChart data={filteredAverageChangedTests} colorMap={colorMap} />
                        <AverageFailedWorkflowExecutionTimeChart data={filteredAverageFailedWorkflowExecutionTime} colorMap={colorMap}/>
                    </div>
                    <div className="grid grid-cols-2 gap-10 flex-1 flex flex-col overflow-hidden">
                        <WorkflowFailureChart data={filteredWorkflowFailures} colorMap={colorMap}/>
                        <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage