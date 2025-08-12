import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import StddevTooltip from "../components/tooltips/StddevTooltip.jsx";
import { formatNumber } from "../utils/formatNumber";

const WorkflowStddevChart = ({ data, colorMap }) => {
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
                        dataKey="duration_median"
                        height={40}
                        label={{
                            value: "(seconds)",
                            position: "insideBottomRight",
                        }}
                        tickFormatter={(value) => formatNumber(value)}
                    />
                    <YAxis
                        type="category"
                        dataKey="workflow_name"
                        width={100}
                        hide={true}
                    />
                    <Tooltip content={<StddevTooltip />} />
                    <Bar
                        dataKey="duration_median"
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

export default WorkflowStddevChart;
