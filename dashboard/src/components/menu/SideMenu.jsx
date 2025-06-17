import { useState } from 'react';
import SideMenuItem from './SideMenuItem.jsx';

const SideMenu = ({ workflows, selectedWorkflows, onWorkflowToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 transform z-40 bg-blue-600 text-white px-3 py-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                Workflows
            </button>

            <div className={`${isOpen ? 'block' : 'hidden'} fixed md:static top-0 left-0 z-30 w-full md:w-auto transition-transform duration-300 ease-in-out md:block`}>
                <div className="w-full min-w-[260px] h-full overflow-y-auto bg-gray-100 md:bg-white border-r border-gray-200 py-8 px-4 flex flex-col items-center pt-20 md:pt-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-600 hidden md:block">Workflows</h3>
                    <ul className="w-full min-w-[240px] flex flex-col items-center gap-2">
                        {workflows.length > 0 ? (
                            workflows.map((workflowName) => (
                                <li className="w-full" key={workflowName}>
                                    <SideMenuItem
                                        workflowName={workflowName}
                                        isSelected={selectedWorkflows.includes(workflowName)}
                                        onClick={onWorkflowToggle}
                                        className="w-full flex justify-center items-center text-center"
                                    />
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500 text-sm">Aucun workflow disponible.</li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SideMenu;