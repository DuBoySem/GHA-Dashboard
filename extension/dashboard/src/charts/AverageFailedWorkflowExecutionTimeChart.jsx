import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";

import AverageFailedWorkflowExecutionTimeTooltip from '../components/tooltips/AverageFailedWorkflowExecutionTimeTooltip.jsx';
import { formatNumber } from "../utils/formatNumber";

const AverageFailedWorkflowExecutionTimeChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
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
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        dataKey="median_duration"
                        label={{
                            value: "(seconds)",
                            position: "insideBottomRight",
                        }}
                        height={40}
                        tickFormatter={(value) => formatNumber(value)}
                    />
                    <YAxis
                        type="category"
                        dataKey="workflow_name"
                        width={100}
                        hide={true}
                    />
                    <Tooltip
                        content={<AverageFailedWorkflowExecutionTimeTooltip />}
                    />
                    <Bar
                        dataKey="median_duration"
                        label={({ x, y, width, height, value }) => (
                            <text
                                x={x + width + 5}
                                y={y + height / 2}
                                dy={4}
                                fill="#000"
                                fontSize={12}
                            >
                                {formatNumber(value)}
                            </text>
                        )}
                    >
                        {data.map((workflow) => (
                            <Cell
                                key={workflow["workflow_name"]}
                                fill={colorMap[workflow["workflow_name"]]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AverageFailedWorkflowExecutionTimeChart;
