import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, CartesianGrid } from 'recharts'
import StddevTooltip from '../components/StddevTooltip.jsx'
import * as d3 from "d3-scale-chromatic";

const WorkflowStddevChart = ({ data, colorMap }) => {
    if (!data || data.length === 0) {
        return (
            <div className="my-8 h-80 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-left">Workflows by duration STD DEV</h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center">No data available</p>
                </div>
            </div>
        )
    }
    return(
        <div className="my-8 h-80 flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-left">Workflows by duration STD DEV</h3>
            <div className="chart-style flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="duration_stddev" label={{ value: 'STD DEV (s)', position: 'insideBottomRight', offset: 0 }} height={40} />
                        <YAxis type="category" dataKey="workflow_name" width={100} hide={true} />
                        <Tooltip content={<StddevTooltip />} />
                        <Bar dataKey="duration_stddev"
                            //Pour les layout vertical (Bar horizontal)
                             label={({ x, y, width, height, value }) => (
                                 <text
                                     x={x + width + 5}
                                     y={y + height / 2}
                                     dy={4}
                                     fill="#000"
                                     fontSize={12}
                                 >
                                     {value}
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
    )
}

export default WorkflowStddevChart