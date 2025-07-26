import {
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';

import StddevTrendTooltip from '../components/tooltips/StddevTrendTooltip.jsx';
import {formatNumber} from "../utils/formatNumber";
import {transformTrendData} from "../utils/transformTrendData.js";
import TrendComparison from '../components/TrendComparison.jsx';

const WorkflowStddevLineChart = ({ data, colorMap }) => {
    const { transformedData, workflowNames } = transformTrendData(data, 'month_mad_trend');

    if (!transformedData || transformedData.length === 0) {
        return (
            <div className="my-8 h-120 flex flex-col">
                <h3 className="text-xl font-semibold h-20 text-left">Mean Absolute Deviation (MAD) per Workflow (Monthly Trend)</h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-4">No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 h-120 flex flex-col">
            <h3 className="text-xl font-semibold h-20 text-left">Mean Absolute Deviation (MAD) per Workflow (Monthly Trend)</h3>

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
                            left: 20,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            angle={-30}
                            textAnchor="end"
                            height={40}
                            label={{ value: 'Month', position: 'insideBottomRight', offset: -25 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${formatNumber(value)} s`}
                            label={{
                                value: 'MAD',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 0
                            }}
                        />
                        <Tooltip content={<StddevTrendTooltip />} />
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

export default WorkflowStddevLineChart;