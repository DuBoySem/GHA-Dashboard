import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import StddevTooltip from '../components/StddevTooltip.jsx'

const WorkflowStddevChart = ({ data }) => {
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
                        <Bar dataKey="duration_stddev" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default WorkflowStddevChart