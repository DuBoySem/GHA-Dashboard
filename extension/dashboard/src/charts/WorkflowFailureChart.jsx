import {
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts'

import FailureTooltip from '../components/FailureTooltip.jsx';

const COLORS = ['#60a5fa', '#facc15', '#4ade80', '#f87171', '#a78bfa', '#f472b6']

const WorkflowFailureChart = ({data}) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-left">Workflows by failure rate</h3>
                <div className="chart-style flex-1 flex items-center justify-center">
                    <p className="text-gray-500 text-center py-4">No data available</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <h3 className="text-xl font-semibold mb-4 text-left">Workflows by failure rate</h3>
            <div className="chart-style flex-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="faillure_rate" label={{ value: 'Failure Rate (%)', position: 'insideBottomRight', offset: 0 }} height={40} />
                        <YAxis type="category" dataKey="workflow_name" width={100} hide={true} />
                        <Tooltip content={<FailureTooltip />} />
                        <Bar dataKey="faillure_rate" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default WorkflowFailureChart