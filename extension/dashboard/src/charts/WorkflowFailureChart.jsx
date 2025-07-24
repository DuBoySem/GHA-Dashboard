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

import FailureTooltip from "../components/FailureTooltip.jsx";
import { formatNumber } from "../utils/formatNumber.js";

const WorkflowFailureChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-left">
                    Workflows by failure rate (%)
                </h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-4">
                        No data available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xl font-semibold mb-4 text-left">
                Workflows by failure rate (%)
            </h3>
            <div className="chart-style flex-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="faillure_rate"
                            height={40}
                            tickFormatter={(value) => formatNumber(value*100)}
                            domain={[0, 1]}
                        />
                        <YAxis
                            type="category"
                            dataKey="workflow_name"
                            width={100}
                            hide={true}
                        />
                        <Tooltip content={<FailureTooltip />} />
                        <Bar
                            dataKey="faillure_rate"
                            label={({ x, y, width, height, value }) => (
                                <text
                                    x={x + width + 5}
                                    y={y + height / 2}
                                    dy={4}
                                    fill="#000"
                                    fontSize={12}
                                >
                                    {formatNumber(value * 100)}
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
        </div>
    );
};

export default WorkflowFailureChart;
