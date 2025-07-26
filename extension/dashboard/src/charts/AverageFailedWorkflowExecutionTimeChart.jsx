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

import AverageFailedWorkflowExecutionTimeTooltip from "../components/AverageFailedWorkflowExecutionTimeTooltip.jsx";
import { formatNumber } from "../utils/formatNumber";

const AverageFailedWorkflowExecutionTimeChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="my-8 h-80 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-left">
                    Average failed workflow duration (s)
                </h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-12">
                        No data available
                    </p>
                </div>
            </div>
        );
    }
    console.log("data", data[0]["workflow_name"]);
    data.map((workflow) => {
        console.log("data lenght", workflow);
    });

    return (
        <div className="my-8 h-80 flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-left">
                Average failed workflow duration (s)
            </h3>
            <div className="chart-style flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="average_duration"
                            //    label={{value: 'Average duration (s)', position: 'insideBottomRight', offset: 0}}
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
                            content={
                                <AverageFailedWorkflowExecutionTimeTooltip />
                            }
                        />
                        <Bar
                            dataKey="average_duration"
                            //Pour les layout vertical (Bar horizontal)
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
        </div>
    );
};

export default AverageFailedWorkflowExecutionTimeChart;
