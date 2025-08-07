import {
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

import FailuresTooltip from '../components/tooltips/FailuresTooltip.jsx';
import {formatNumber} from "../utils/formatNumber";
import {transformTrendData} from "../utils/transformTrendData.js";
import TrendComparison from '../components/TrendComparison.jsx';

const WorkflowFailureLineChart = ({ data, colorMap }) => {
    const { transformedData, workflowNames } = transformTrendData(data);

    if (!transformedData || transformedData.length === 0) {
        return (
            <div className="my-8 h-120 flex flex-col">
                <h3 className="text-xl font-semibold h-20 text-left text-gray-700">Failure per Workflow (Monthly Trend)</h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-4">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 h-120 flex flex-col">
            <h3 className="text-xl font-semibold h-20 text-left text-gray-700">Failure per Workflow (Monthly Trend)</h3>

            <TrendComparison
                transformedData={transformedData}
                workflowNames={workflowNames}
                formatNumber={formatNumber}
            />

            <div className="chart-style flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={transformedData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            angle={-30}
                            textAnchor="end"
                            height={40}
                        />
                        <YAxis
                            tickFormatter={(value) => `${formatNumber(value * 100)}%`}
                            domain={[0, 1]}
                        />
                        <Tooltip content={<FailuresTooltip />} />
                        {workflowNames.map((name) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={colorMap[name] || '#8884d8'}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default WorkflowFailureLineChart;