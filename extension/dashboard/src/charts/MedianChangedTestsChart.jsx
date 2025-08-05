import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
} from "recharts";

import AverageChangedTestsTooltip from "../components/tooltips/AverageChangedTestsTooltip.jsx";
import { formatNumber } from "../utils/formatNumber";

const MedianChangedTestsChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex-col flex items-center justify-center p-4">
                <p className="text-gray-500 text-center py-4 text-lg">
                    No data available
                </p>
            </div>
        );
    }

    // Utilise la clé 'median_value' pour le bar chart
    const chartData = data.map((item) => ({
        workflow_name: item.workflow_name,
        value: item.median_value,
    }));

    return (
        <div className="flex-1 overflow-hidden">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="value"
                        type="number"
                        tickFormatter={(value) => formatNumber(value)}
                        label={{
                            value: "(lines)",
                            position: "insideBottomRight",
                        }}
                        height={40}
                    />
                    <YAxis
                        dataKey="workflow_name"
                        type="category"
                        width={100}
                        hide={true}
                    />
                    <Tooltip content={<AverageChangedTestsTooltip />} />
                    <Bar
                        dataKey="value"
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
                        {chartData.map((workflow) => (
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

export default MedianChangedTestsChart;
