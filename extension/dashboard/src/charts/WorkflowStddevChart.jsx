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
import StddevTooltip from '../components/tooltips/StddevTooltip.jsx'
import * as d3 from "d3-scale-chromatic";
import { formatNumber } from "../utils/formatNumber";

const WorkflowStddevChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="my-8 h-80 flex flex-col">
                <h3 className="text-xl font-semibold h-20 text-left">
                    Workflows by duration STD DEV (s)
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
        <div className="my-8 h-80 flex flex-col">
            <h3 className="text-xl font-semibold h-20 text-left">Workflows by duration Mean Absolute Deviation (MAD)</h3>
            <div className="chart-style flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis type="number" dataKey="duration_mad"
                               tickFormatter={(value) => `${formatNumber(value)} s`}
                        />
                        <YAxis type="category" dataKey="workflow_name" width={100} hide={true}/>
                        <Tooltip content={<StddevTooltip/>}/>
                        <Bar dataKey="duration_mad"
                             label={({x, y, width, height, value}) => (
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

export default WorkflowStddevChart;
