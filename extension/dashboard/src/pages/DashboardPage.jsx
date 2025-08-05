import { useEffect, useState, useMemo } from "react";
import WorkflowStddevChart from "../charts/WorkflowStddevChart.jsx";
import WorkflowFailureChart from "../charts/WorkflowFailureChart.jsx";
import MedianPassedTestsChart from "../charts/MedianPassedTestsChart.jsx";
import { useStore } from "../store/useStore.js";
import SideMenu from "../components/menu/SideMenu.jsx";
import * as d3 from "d3-scale-chromatic";
import WorkflowFailureLineChart from "../charts/WorkflowFailureLineChart.jsx";
import WorkflowStddevLineChart from "../charts/WorkflowStddevLineChart.jsx";
import MedianPassedTestsLineChart from "../charts/MedianPassedTestsLineChart.jsx";
import MedianChangedTestsLineChart from "../charts/MedianChangedTestsLineChart.jsx";
import MedianChangedTestsChart from "../charts/MedianChangedTestsChart.jsx";
import AverageFailedWorkflowExecutionTimeLineChart from "../charts/AverageFailedWorkflowExecutionTimeLineChart.jsx";
import AverageFailedWorkflowExecutionTimeChart from "../charts/AverageFailedWorkflowExecutionTimeChart.jsx";
import PullRequestTriggersLineChart from "../charts/PullRequestTriggersLineChart.jsx";
import { IssuerFailureTable } from "../tables/IssuerFailureTable.jsx";
import { KPIs as parsedData } from "../mock/KPIs.js";
import KpiCard from "../components/KpiCard.jsx";
import TrendComparison from "../components/TrendComparison.jsx";
import { formatNumber } from "../utils/formatNumber.js";

const DashboardPage = () => {
    const token = useStore((state) => state.token);
    const repoFromStore = useStore((state) => state.repoUrl);
    const saveNewRepoUrl = useStore((state) => state.setRepoUrl);
    const [repoUrl] = useState("");
    const [kpis, setKpis] = useState({});
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);

    const fetchKpis = async (repo) => {
        if (repo.trim()) {
            try {
                window.postMessage(
                    {
                        source: "GHA_DASHBOARD",
                        message: {
                            type: "REFRESH",
                            payload: { repo_url: repoFromStore, token: token },
                        },
                    },
                    "*"
                );

                if (repoUrl && repoUrl !== "" && repoUrl !== repoFromStore) {
                    saveNewRepoUrl(repoUrl);
                }
            } catch (err) {
                console.error("Error:", err);
                alert("Failed to refresh repo.");
            }
        }
    };

    useEffect(() => {
        const handleSSEUpdate = (msg) => {
            if (msg.source !== window) return;

            setKpis(parsedData);

            if (parsedData?.MedianDurationPerWorkflowExecution) {
                const allWorkflows =
                    parsedData.MedianDurationPerWorkflowExecution.map(
                        (wf) => wf.workflow_name
                    );
                setSelectedWorkflows(allWorkflows);
            }

            // if(msg.data.source !== "BACKGROUND_SCRIPT") return;

            // if(msg.data.type==="KPI_STREAM"){
            //     try {
            //         const parsedData = msg.data.payload;
            //         setKpis(parsedData);

            //         if (parsedData?.MedianDurationPerWorkflowExecution) {
            //             const allWorkflows = parsedData.MedianDurationPerWorkflowExecution.map(wf => wf.workflow_name);
            //             setSelectedWorkflows(allWorkflows);
            //         }
            //     } catch (e) {
            //         console.log("Error parsing streamed kpis: ", e);
            //     }
            // }
        };

        const launch = async () => {
            try {
                await fetchKpis(repoFromStore);
            } catch (e) {
                console.error("Erreur fetchKpis", e);
            }
        };

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.addEventListener("message", handleSSEUpdate);
        launch();
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("message", handleSSEUpdate);
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

        return kpis.AverageFaillureRatePerWorkflow.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.AverageFaillureRatePerWorkflow, selectedWorkflows]);

    const filteredWorkflowMonthlyMedianDuration = useMemo(() => {
        if (!kpis.MedianDurationPerWorkflowExecution) {
            return [];
        }

        return kpis.MedianDurationPerWorkflowExecution.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.MedianDurationPerWorkflowExecution, selectedWorkflows]);

    const filteredPullRequestTriggers = useMemo(() => {
        if (!kpis.PullRequestTriggersTrend) {
            return [];
        }

        return kpis.PullRequestTriggersTrend.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.PullRequestTriggersTrend, selectedWorkflows]);

    const filteredWorkflowStddev = useMemo(() => {
        if (!kpis.MedianDurationPerWorkflowExecution) {
            return [];
        }

        return kpis.MedianDurationPerWorkflowExecution.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.MedianDurationPerWorkflowExecution, selectedWorkflows]);

    const filteredWorkflowFailures = useMemo(() => {
        if (!kpis.AverageFaillureRatePerWorkflow) {
            return [];
        }

        return kpis.AverageFaillureRatePerWorkflow.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.AverageFaillureRatePerWorkflow, selectedWorkflows]);

    const filteredMedianPassedTests = useMemo(() => {
        if (!kpis.MedianPassedTestsratePerWorkflow) {
            return [];
        }

        return kpis.MedianPassedTestsratePerWorkflow.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.MedianPassedTestsratePerWorkflow, selectedWorkflows]);

    const filteredMedianChangedTests = useMemo(() => {
        if (!kpis.MedianChurnPerWorkflow) {
            return [];
        }

        return kpis.MedianChurnPerWorkflow.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.MedianChurnPerWorkflow, selectedWorkflows]);

    const filteredAverageFailedWorkflowExecutionTime = useMemo(() => {
        if (!kpis.AverageFailedWorkflowExecutionTime) {
            return [];
        }

        return kpis.AverageFailedWorkflowExecutionTime.filter((wf) =>
            selectedWorkflows.includes(wf.workflow_name)
        );
    }, [kpis.AverageFailedWorkflowExecutionTime, selectedWorkflows]);

    const allWorkflowNames = useMemo(() => {
        const namesFromFailureRate = kpis.AverageFaillureRatePerWorkflow
            ? kpis.AverageFaillureRatePerWorkflow.map((wf) => wf.workflow_name)
            : [];

        const namesFromStdDev = kpis.MedianDurationPerWorkflowExecution
            ? kpis.MedianDurationPerWorkflowExecution.map(
                  (wf) => wf.workflow_name
              )
            : [];

        const namesFromPassedTests = kpis.MedianPassedTestsratePerWorkflow
            ? kpis.MedianPassedTestsratePerWorkflow.map(
                  (wf) => wf.workflow_name
              )
            : [];

        const namesFromChangedTests = kpis.MedianChurnPerWorkflow
            ? kpis.MedianChurnPerWorkflow.map((wf) => wf.workflow_name)
            : [];

        const namesFromFailedExecTime = kpis.AverageFailedWorkflowExecutionTime
            ? kpis.AverageFailedWorkflowExecutionTime.map(
                  (wf) => wf.workflow_name
              )
            : [];

        const namesFromPRTriggers = kpis.PullRequestTriggersTrend
            ? kpis.PullRequestTriggersTrend.map((wf) => wf.workflow_name)
            : [];

        return Array.from(
            new Set([
                ...namesFromFailureRate,
                ...namesFromStdDev,
                ...namesFromPassedTests,
                ...namesFromChangedTests,
                ...namesFromFailedExecTime,
                ...namesFromPRTriggers,
            ])
        );
    }, [
        kpis.AverageFaillureRatePerWorkflow,
        kpis.MedianDurationPerWorkflowExecution,
        kpis.MedianPassedTestsratePerWorkflow,
        kpis.MedianChurnPerWorkflow,
        kpis.AverageFailedWorkflowExecutionTime,
        kpis.PullRequestTriggersTrend,
    ]);

    const colorMap = useMemo(() => {
        return Object.fromEntries(
            allWorkflowNames.map((workflowName, index) => [
                workflowName,
                d3.schemeCategory10[index % 10],
            ])
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
            <div className="grid grid-cols-2 p-4 gap-8 divide-gray-200 w-full flex-grow-[2] overflow-hidden">
                <KpiCard
                    title="Workflow Run Failures"
                    lineTitle="Monthly Failure Rate Trend per Workflow"
                    barTitle="Failure Rate per Workflow"
                    summary={
                        <TrendComparison
                            data={filteredWorkflowFailures}
                            trendKey="month_average_trend"
                            valueKey="rate"
                            formatNumber={formatNumber}
                            unit="%"
                        />
                    }
                    lineChart={
                        <WorkflowFailureLineChart
                            data={filteredWorkflowMonthlyFailures}
                            colorMap={colorMap}
                        />
                    }
                    barChart={
                        <WorkflowFailureChart
                            data={filteredWorkflowFailures}
                            colorMap={colorMap}
                        />
                    }
                />

                <KpiCard
                    title="Workflow Run Durations"
                    lineTitle="Monthly Duration Trend"
                    barTitle="Median Duration"
                    summary={
                        <TrendComparison
                            data={filteredWorkflowMonthlyMedianDuration}
                            trendKey="month_median_trend"
                            valueKey="median"
                            formatNumber={formatNumber}
                            unit="s"
                        />
                    }
                    lineChart={
                        <WorkflowStddevLineChart
                            data={filteredWorkflowMonthlyMedianDuration}
                            colorMap={colorMap}
                        />
                    }
                    barChart={
                        <WorkflowStddevChart
                            data={filteredWorkflowMonthlyMedianDuration}
                            colorMap={colorMap}
                        />
                    }
                />
                <KpiCard
                    title="Workflow passed tests"
                    lineTitle="Monthly Passed Tests Trend"
                    barTitle="Median Passed Tests"
                    summary={
                        <TrendComparison
                            data={filteredMedianPassedTests}
                            trendKey="month_median_trend"
                            valueKey="rate"
                            formatNumber={formatNumber}
                            unit="tests"
                        />
                    }
                    lineChart={
                        <MedianPassedTestsLineChart
                            data={filteredMedianPassedTests}
                            colorMap={colorMap}
                        />
                    }
                    barChart={
                        <MedianPassedTestsChart
                            data={filteredMedianPassedTests}
                            colorMap={colorMap}
                        />
                    }
                />
                <KpiCard
                    title="Changed Lines in Workflows"
                    lineTitle="Monthly Changed Lines Trend"
                    barTitle="Median Changed Lines"
                    summary={
                        <TrendComparison
                            data={filteredMedianChangedTests}
                            trendKey="month_med_trend"
                            valueKey="median"
                            formatNumber={formatNumber}
                            unit="lines"
                        />
                    }
                    lineChart={
                        <MedianChangedTestsLineChart
                            data={filteredMedianChangedTests}
                            colorMap={colorMap}
                        />
                    }
                    barChart={
                        <MedianChangedTestsChart
                            data={filteredMedianChangedTests}
                            colorMap={colorMap}
                        />
                    }
                />

                <KpiCard
                    title="Failed Workflow Execution Time"
                    lineTitle="Monthly Failed Execution Time Trend"
                    barTitle="Median Failed Execution Time"
                    summary={
                        <TrendComparison
                            data={filteredAverageFailedWorkflowExecutionTime}
                            trendKey="month_median_trend"
                            valueKey="median"
                            formatNumber={formatNumber}
                            unit="s"
                        />
                    }
                    lineChart={
                        <AverageFailedWorkflowExecutionTimeLineChart
                            data={filteredAverageFailedWorkflowExecutionTime}
                            colorMap={colorMap}
                        />
                    }
                    barChart={
                        <AverageFailedWorkflowExecutionTimeChart
                            data={filteredAverageFailedWorkflowExecutionTime}
                            colorMap={colorMap}
                        />
                    }
                />
                <KpiCard
                    title="PRs Triggered per Workflow"
                    lineTitle="Monthly PR Triggers Trend"
                    summary={
                        <TrendComparison
                            data={filteredPullRequestTriggers}
                            trendKey="month_triggers_trend"
                            valueKey="total"
                            formatNumber={formatNumber}
                            unit="PRs"
                        />
                    }
                    lineChart={
                        <PullRequestTriggersLineChart
                            data={filteredPullRequestTriggers}
                            colorMap={colorMap}
                        />
                    }
                />
                <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer} />
            </div>
            {/* <div className="flex-1 p-4 bg-white flex flex-col overflow-hidden">
                <div className="divide-y  divide-gray-200 flex-1 flex flex-col"> */}
            {/* Grouped charts: chart + line chart */}
            {/* <div className="grid grid-cols-2"> */}
            {/* <div className="flex flex-col gap-4 border-r-2 border-gray-200 pr-4">
                            <WorkflowFailureLineChart
                                data={filteredWorkflowMonthlyFailures}
                                colorMap={colorMap}
                            />
                            <WorkflowFailureChart
                                data={filteredWorkflowFailures}
                                colorMap={colorMap}
                            />
                        </div> */}
            {/* <KpiCard
                            className="flex-1"
                            title="Workflow Run Failures"
                            lineTitle="Trends (monthly)"
                            barTitle="Median per workflow"
                            summary={
                                <SummaryBox
                                    prevMonth={summary.prevMonth}
                                    currentMonth={summary.currentMonth}
                                />
                            }
                            lineChart={
                                <WorkflowFailureLineChart
                                    data={filteredWorkflowMonthlyFailures}
                                    colorMap={colorMap}
                                />
                            }
                            barChart={
                                <AverageChangedTestsChart
                                    data={filteredAverageChangedTests}
                                    colorMap={colorMap}
                                />
                            }
                        />
                        <KpiCard
                            className="flex-1"
                            title="Workflow Run Failures"
                            summary={
                                <TrendComparison
                                    transformedData={filteredWorkflowFailures}
                                    workflowNames={allWorkflowNames}
                                    formatNumber={formatNumber}
                                    unit="%"
                                />
                            }
                            barChart={
                                <WorkflowFailureChart
                                    data={filteredWorkflowFailures}
                                    colorMap={colorMap}
                                />
                            }
                            lineChart={
                                <WorkflowFailureLineChart
                                    data={filteredWorkflowMonthlyFailures}
                                    colorMap={colorMap}
                                />
                            }
                        />
                        <KpiCard
                            title="Workflow Run Failures"
                            summary={
                                <TrendComparison
                                    transformedData={filteredWorkflowFailures}
                                    workflowNames={allWorkflowNames}
                                    formatNumber={formatNumber}
                                    unit="%"
                                />
                            }
                            barChart={
                                <WorkflowFailureChart
                                    data={filteredWorkflowFailures}
                                    colorMap={colorMap}
                                />
                            }
                            lineChart={
                                <WorkflowFailureLineChart
                                    data={filteredWorkflowMonthlyFailures}
                                    colorMap={colorMap}
                                />
                            }
                        /> */}
            {/* <div className="flex flex-col gap-4 border-r-2 border-gray-200 pr-4">
                            <WorkflowStddevLineChart
                                data={filteredWorkflowMonthlyMedianDuration}
                                colorMap={colorMap}
                            />
                            <WorkflowStddevChart
                                data={filteredWorkflowStddev}
                                colorMap={colorMap}
                            />
                        </div>
                        <div className="flex flex-col gap-4 border-r-2 border-gray-200 pr-4">
                            <AveragePassedTestsLineChart
                                data={filteredMedianPassedTests}
                                colorMap={colorMap}
                            />
                            <AveragePassedTestsChart
                                data={filteredMedianPassedTests}
                                colorMap={colorMap}
                            />
                        </div>
                        <div className="flex flex-col gap-4 border-r-2 border-gray-200 pr-4">
                            <AverageChangedTestsLineChart
                                data={filteredAverageChangedTests}
                                colorMap={colorMap}
                            />
                            <AverageChangedTestsChart
                                data={filteredAverageChangedTests}
                                colorMap={colorMap}
                            />
                        </div>
                        <div className="flex flex-col gap-4 border-r-2 border-gray-200 pr-4">
                            <AverageFailedWorkflowExecutionTimeLineChart
                                data={
                                    filteredAverageFailedWorkflowExecutionTime
                                }
                                colorMap={colorMap}
                            />
                            <AverageFailedWorkflowExecutionTimeChart
                                data={
                                    filteredAverageFailedWorkflowExecutionTime
                                }
                                colorMap={colorMap}
                            />
                        </div> 
                    </div> *
                     <div className="grid grid-cols-2 gap-10">
                        {/* <PullRequestTriggersLineChart
                            data={filteredPullRequestTriggers}
                            colorMap={colorMap}
                        />
                        <IssuerFailureTable
                            data={kpis.AverageFaillureRatePerIssuer}
                        /> 
                          
                    </div> 
            {/* </div> */}
            {/* </div> */}
            {/* <div className="grid grid-cols-2 gap-10">
                <PullRequestTriggersLineChart
                    data={filteredPullRequestTriggers}
                    colorMap={colorMap}
                />
                {/* <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer} /> 
            </div> */}
        </div>
    );
};

export default DashboardPage;
