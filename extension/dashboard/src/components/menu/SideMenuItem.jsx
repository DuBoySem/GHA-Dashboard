const SideMenuItem = ({ workflowName, isSelected, onClick, color }) => {
    const itemClasses = `sidemenu-item ${isSelected ? 'sidemenu-item-selected' : 'hover:bg-red-200'}`;

    return (
        <li
            className={itemClasses}
            onClick={() => onClick(workflowName)}
            style={isSelected ? { backgroundColor: color } : undefined}
        >
            {workflowName}
        </li>
    );
};

export default SideMenuItem;