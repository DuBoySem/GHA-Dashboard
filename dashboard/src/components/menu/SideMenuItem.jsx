const SideMenuItem = ({ workflowName, isSelected, onClick }) => {
    const itemClasses = `sidemenu-item ${isSelected ? 'sidemenu-item-selected' : 'hover:bg-blue-200'}`;

    return (
        <li className={itemClasses} onClick={() => onClick(workflowName)}>
            {workflowName}
        </li>
    );
};

export default SideMenuItem;