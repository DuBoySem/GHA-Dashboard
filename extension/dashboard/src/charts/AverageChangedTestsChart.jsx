import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
} from 'recharts';

import AverageChangedTestsTooltip from '../components/AverageChangedTestsTooltip.jsx';
import {formatNumber} from "../utils/formatNumber";

const AverageChangedTestsChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="my-8 h-80 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-left">Average changed lines per workflow</h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-12">No data available</p>
                </div>
            </div>
        );
    }
    return (
        <div className="my-8 h-80 flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-left">Average changed lines per workflow</h3>
            <div className="chart-style flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="workflow_name"
                            type="category"
                            angle={-30}
                            textAnchor="end"
                            height={30}
                            tick={false}
                            axisLine={false}
                        />
                        <YAxis
                            dataKey="average_churn"
                            type="number"
                            tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip content={<AverageChangedTestsTooltip />} />
                        <Bar
                            dataKey="average_churn"
                            //Pour les layout horizontal (Bar vertical)
                            label={({ x, y, width, value }) => (
                                <text
                                    x={x + width / 2}
                                    y={y - 7}
                                    textAnchor="middle"
                                    fill="#000"
                                    fontSize={12}
                                >
                                    {formatNumber(value)}
                                </text>
                            )}
                        >
                            {data.map((workflow) => (
                                <Cell key={workflow['workflow_name']} fill={colorMap[workflow['workflow_name']]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div>
    );
};

export default AverageChangedTestsChart;