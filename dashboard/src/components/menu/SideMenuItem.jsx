const SideMenuItem = ({ workflowName, isSelected, onClick, color }) => {
    const itemClasses = `sidemenu-item ${
        isSelected ? "sidemenu-item-selected" : "hover:bg-red-200"
    }`;

    return (
        <li
            className={itemClasses}
            onClick={() => onClick(workflowName)}
            style={
                isSelected
                    ? { backgroundColor: color }
                    : { backgroundColor: "#e5e7eb" }
            }
        >
            <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="mr-2 accent-black"
                tabIndex={-1}
            />
            {workflowName}
        </li>
    );
};

export default SideMenuItem;
