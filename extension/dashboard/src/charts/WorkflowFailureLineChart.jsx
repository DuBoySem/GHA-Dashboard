import {
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import FailuresTooltip from "../components/tooltips/FailuresTooltip.jsx";
import { formatNumber } from "../utils/formatNumber";
import { transformTrendData } from "../utils/transformTrendData.js";

const WorkflowFailureLineChart = ({ data, colorMap }) => {
    const { transformedData, workflowNames } = transformTrendData(data, "month_average_trend", "rate");

    if (!transformedData || transformedData.length === 0) {
        return (
            <div className="flex-col flex items-center justify-center p-4">
                <p className="text-gray-500 text-center py-4 text-lg">
                    No data available
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transformedData}>
                    <CartesianGrid strokeLinecap="square" />
                    <XAxis
                        dataKey="month"
                        angle={-30}
                        textAnchor="end"
                        height={40}
                    />
                    <YAxis
                        width={50}
                        axisLine={false}
                        tickFormatter={(value) =>
                            `${formatNumber(value * 100)}%`
                        }
                        domain={[0, 1]}
                    />
                    <Tooltip content={<FailuresTooltip />} />
                    {workflowNames.map((name) => (
                        <Line
                            key={name}
                            type="monotone"
                            dataKey={name}
                            stroke={colorMap[name] || "#8884d8"}
                            activeDot={{ r: 8 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WorkflowFailureLineChart;
