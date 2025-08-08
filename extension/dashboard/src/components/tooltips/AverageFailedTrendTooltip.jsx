import {formatNumber} from "../../utils/formatNumber";

const AverageFailedTrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

        return (
            <div className="bg-white p-2 border border-gray-300 shadow-md rounded">
                <p className="font-bold text-gray-800">{`Month: ${label}`}</p>
                {sortedPayload.map((entry, index) => {
                    const workflowKey = entry.name;
                    const metaKey = `${workflowKey}__meta`;
                    const total = entry.payload[metaKey]?.total ?? 0;

                    return (
                        <p
                            key={`item-${index}`}
                            className="text-gray-700"
                            style={{ color: entry.stroke }}
                        >
                            {`${workflowKey}: ${formatNumber(
                                entry.value
                            )}s (Total fails: ${total})`}
                        </p>
                    );
                })}
            </div>
        );
    }

    return null;
};

export default AverageFailedTrendTooltip;