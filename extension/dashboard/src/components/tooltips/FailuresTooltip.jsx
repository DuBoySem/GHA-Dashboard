import {formatNumber} from "../../utils/formatNumber";

const FailuresTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
                <p className="font-bold text-gray-800">{`Month: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p 
                        key={`item-${index}`} 
                        className="text-gray-700" 
                        style={{ color: entry.stroke }}
                    >
                        {`${entry.name}: ${formatNumber(entry.value * 100)}%`} 
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

export default FailuresTooltip;