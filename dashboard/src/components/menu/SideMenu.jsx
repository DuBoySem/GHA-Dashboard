import SideMenuItem from './SideMenuItem.jsx';
import * as d3 from 'd3-scale-chromatic';
const SideMenu = ({ workflows, selectedWorkflows, onWorkflowToggle, colorsMap }) => {
    return (
        <div className="overflow-y-auto w-80 bg-gray-50 border-r border-gray-200 py-8 px-4">
            <h3 className="text-xl font-semibold mb-4 ml-1 text-black">Workflows</h3>
            <ul className="space-y-2">
                {workflows.length > 0 ? (
                    workflows.map((workflowName) => (
                        <SideMenuItem
                            key={workflowName}
                            workflowName={workflowName}
                            isSelected={selectedWorkflows.includes(workflowName)}
                            onClick={onWorkflowToggle}
                            color={colorsMap[workflowName]}
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