import {useEffect, useState, useMemo} from "react";
import WorkflowStddevChart from "../charts/WorkflowStddevChart.jsx";
import WorkflowFailureChart from "../charts/WorkflowFailureChart.jsx";
import {IssuerFailureTable} from "../tables/IssuerFailureTable.jsx";
import {useStore} from "../store/useStore.js";
import SideMenu from "../components/menu/SideMenu.jsx";
import mockKpis from "../mock/data.json";

const DashboardPage = () => {
    const token = useStore((state) => state.token)
    const repoFromStore = useStore((state) => state.repoUrl)
    const saveNewRepoUrl = useStore((state) => state.setRepoUrl)
    const [repoUrl, setRepoUrl] = useState("");
    // ---- new code----
    // to store streamed KPis and SSE elements
    // var that contains the updated data from backend (streamedKPIs)
    const [streamedKpis, setStreamedKpis] = useState(null)
    const [eventSource, setEventSource] = useState(null)
    // -----------------

    const [kpis, setKpis] = useState({});
    const [selectedWorkflows, setSelectedWorkflows] = useState([]);

    const fetchKpis = async (repo) => {
        if (repo.trim()) {
            try {
                //---- new code-----
                // code to start the SSE (event stream)
                const source = new EventSource("http://localhost:8000/api/csv_checker");
                source.onmessage= (event) => {
                  console.log("new stream event");
                  try{
                    const parsedData = JSON.parse(event.data);
                    //setting new received data
                    setStreamedKpis(parsedData);
                    console.log("new kpis streamed: ", parsedData);
                  } 
                  catch (e) {
                    console.log("error parsing streamed kpis: ",e);
                  }
                };
                source.onerror = (e) =>{
                  console.error("Error SSE: ",e);
                  source.close();
                };
                await new Promise((resolve) => setTimeout(resolve, 5000));
                //---------------------
                const response = await fetch("http://localhost:8000/api/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ repo_url: repoFromStore, token: token }),
                });
                const result = mockKpis;
                
                if (repoUrl && repoUrl !== '' && repoUrl !== repoFromStore) {
                    saveNewRepoUrl(repoUrl);
                }

                setKpis(result.data)

                if (result.data?.AverageFailureRatePerWorkflow) {
                    const allWorkflows = result.data.AverageFailureRatePerWorkflow.map(wf => wf.workflow_name);
                    setSelectedWorkflows(allWorkflows);
                }
            } catch (err) {
                const result = mockKpis; 
                setKpis(result.data);

                if (result.data?.AverageFailureRatePerWorkflow) {
                    const allWorkflows = result.data.AverageFailureRatePerWorkflow.map(wf => wf.workflow_name);
                    setSelectedWorkflows(allWorkflows);
                }

                console.error("Error:", err);
                alert("Failed to refresh repo.");
            }
        }
    }

    useEffect(() => {
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
        if (!kpis.AverageFailureRatePerWorkflow) {
            return [];
        }

        return kpis.AverageFailureRatePerWorkflow.filter(wf => selectedWorkflows.includes(wf.workflow_name));
    }, [kpis.AverageFailureRatePerWorkflow, selectedWorkflows]);

    const allWorkflowNames = useMemo(() => {
        return kpis.AverageFailureRatePerWorkflow ? kpis.AverageFailureRatePerWorkflow.map(wf => wf.workflow_name) : [];
    }, [kpis.AverageFailureRatePerWorkflow]);
    
    return (
        <div className="h-screen flex">
            <SideMenu
                workflows={allWorkflowNames}
                selectedWorkflows={selectedWorkflows}
                onWorkflowToggle={handleWorkflowToggle}
            />
            <div className="flex-1 overflow-y-auto p-8 bg-white">
                <div className="flex flex-row items-baseline justify-center gap-2">
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
                        <WorkflowStddevChart data={filteredWorkflowStddev}/>
                        <WorkflowFailureChart data={filteredWorkflowFailures}/>
                    </div>
                    <IssuerFailureTable data={kpis.AverageFaillureRatePerIssuer}/>
                </div>
            </div>
            {/*------ new code--------*/}
            {/* to display new received data*/}
            <div>test react</div>
            {streamedKpis && (
                <div className="mt-8 p-4 bg-gray-100 rounded">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Mise a jour des KPIs en temps reel</h3>
                    <pre className="text-sm text-gray-700 overflow-auto max-h-96">
                        {JSON.stringify(streamedKpis, null, 2)}
                    </pre>
                </div>
            )}
            {/*-----------------*/}
        </div>
    )
}

export default DashboardPage
