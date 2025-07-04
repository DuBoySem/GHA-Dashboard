import React from "react";

const AverageChangedTestsTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const dataEntry = payload[0]

        return (
            <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
                <p className="font-bold text-gray-800">{`${dataEntry.payload.workflow_name}`}</p>
                <p className="text-gray-700">{`Changed lines: ${dataEntry.value}`}</p>
            </div>
        )
    }

    return null
}

export default AverageChangedTestsTooltip
