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
import WorkflowFailureLineChart from "../charts/WorkflowFailureLineChart.jsx";
import WorkflowStddevLineChart from "../charts/WorkflowStddevLineChart.jsx";

const DashboardPage = () => {
    const token = useStore((state) => state.token)
    const repoFromStore = useStore((state) => state.repoUrl)
    const saveNewRepoUrl = useStore((state) => state.setRepoUrl)
    const [repoUrl] = useState("");
    const [kpis, setKpis] = useState({});
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);

    const fetchKpis = async (repo) => {
        if (repo.trim()) {
            try {
                window.postMessage(
                    {
                        source:"GHA_DASHBOARD",
                        message:{
                            type:"REFRESH",
                            payload: { repo_url: repoFromStore, token: token },
                        }
                    }, "*",
                );

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
        const handleSSEUpdate = msg => {
            if(msg.source !== window) return;

            if(msg.data.source !== "BACKGROUND_SCRIPT") return;

            if(msg.data.type==="KPI_STREAM"){
                try {
                    const parsedData = msg.data.payload;
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

    const handleWorkflowToggle = (workflowName) => {
        setSelectedWorkflows((prevSelected) => {
            if (prevSelected.includes(workflowName)) {
                return prevSelected.filter((name) => name !== workflowName);
            }

            return [...prevSelected, workflowName];
        });
    };

    const filteredWorkflowMonthlyFailures = useMemo(() => {
        if (!kpis.AverageFaillureRatePerWorkflow) {
            return [];
        }

        return kpis.AverageFaillureRatePerWorkflow.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AverageFaillureRatePerWorkflow, selectedWorkflows]);

    const filteredWorkflowMonthlyStdDevDuration = useMemo(() => {
        if (!kpis.StdDevWorkflowExecutions) {
            return [];
        }

        return kpis.StdDevWorkflowExecutions.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.StdDevWorkflowExecutions, selectedWorkflows]);

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
        const namesFromFailureRate = kpis.AverageFaillureRatePerWorkflow
            ? kpis.AverageFaillureRatePerWorkflow.map(wf => wf.workflow_name)
            : [];
    
        const namesFromStdDev = kpis.StdDevWorkflowExecutions
            ? kpis.StdDevWorkflowExecutions.map(wf => wf.workflow_name)
            : [];
        
        const namesFromPassedTests = kpis.AveragePassedTestsPerWorkflowExcecution
            ? kpis.AveragePassedTestsPerWorkflowExcecution.map(wf => wf.workflow_name)
            : [];

        const namesFromChangedTests = kpis.AverageChangedTestsPerWorkflowExecution
            ? kpis.AverageChangedTestsPerWorkflowExecution.map(wf => wf.workflow_name)
            : [];
            
        const namesFromFailedExecTime = kpis.AverageFailedWorkflowExecutionTime
            ? kpis.AverageFailedWorkflowExecutionTime.map(wf => wf.workflow_name)
            : [];

        return Array.from(new Set([
            ...namesFromFailureRate,
            ...namesFromStdDev,
            ...namesFromPassedTests,
            ...namesFromChangedTests,
            ...namesFromFailedExecTime
        ]));
    }, [
        kpis.AverageFaillureRatePerWorkflow,
        kpis.StdDevWorkflowExecutions,
        kpis.AveragePassedTestsPerWorkflowExcecution,
        kpis.AverageChangedTestsPerWorkflowExecution,
        kpis.AverageFailedWorkflowExecutionTime
    ]);

    const colorMap = useMemo(() => {
        return Object.fromEntries(
            allWorkflowNames.map((workflowName, index) => [workflowName, d3.schemeCategory10[index % 10]])
        );
    }, [allWorkflowNames]);

    return (
        <div className="min-h-full w-full flex">
            <SideMenu
                workflows={allWorkflowNames}
                selectedWorkflows={selectedWorkflows}
                onWorkflowToggle={handleWorkflowToggle}
                colorsMap={colorMap}
            />
            <div className="flex-1 p-8 bg-white flex flex-col overflow-hidden">
                <div className="divide-y divide-gray-200 flex-1 flex flex-col">
                    <div className="grid grid-cols-3 gap-10 mb-3 flex-grow-[2]">
                        <WorkflowFailureLineChart data={filteredWorkflowMonthlyFailures} colorMap={colorMap} />
                        <WorkflowStddevLineChart data={filteredWorkflowMonthlyStdDevDuration} colorMap={colorMap} />
                        <WorkflowFailureLineChart data={filteredWorkflowMonthlyFailures} colorMap={colorMap} />
                    </div>
                    <div className="grid grid-cols-4 gap-10 mb-3 flex-grow">
                        <WorkflowStddevChart data={filteredWorkflowStddev} colorMap={colorMap} />
                        <AveragePassedTestsChart data={filteredAveragePassedTests} colorMap={colorMap}/>
                        <AverageChangedTestsChart data={filteredAverageChangedTests} colorMap={colorMap} />
                        <AverageFailedWorkflowExecutionTimeChart data={filteredAverageFailedWorkflowExecutionTime} colorMap={colorMap}/>
                    </div>
                    <div className="grid grid-cols-2 gap-10 flex-grow">
                        <WorkflowFailureChart data={filteredWorkflowFailures} colorMap={colorMap}/>
                        <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage;