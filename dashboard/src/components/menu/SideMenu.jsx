import SideMenuItem from './SideMenuItem.jsx';

const SideMenu = ({ workflows, selectedWorkflows, onWorkflowToggle }) => {
    return (
        <div className="overflow-y-auto w-100 bg-gray-50 border-r border-gray-200 py-8 px-4">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Workflows</h3>
            <ul className="space-y-2">
                {workflows.length > 0 ? (
                    workflows.map((workflowName) => (
                        <SideMenuItem
                            key={workflowName}
                            workflowName={workflowName}
                            isSelected={selectedWorkflows.includes(workflowName)}
                            onClick={onWorkflowToggle}
                        />
                    ))
                ) : (
                    <li className="text-gray-500 text-sm">Aucun workflow disponible.</li>
                )}
            </ul>
        </div>
    );
};

export default SideMenu;