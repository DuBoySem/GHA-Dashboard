export const transformTrendData = (data, trendKey = 'month_average_trend') => {
    if (!data || data.length === 0) {
        return { transformedData: [], workflowNames: [] };
    }

    const allMonths = new Set();
    const workflowDataMap = {};

    data.forEach(workflow => {
        const workflowName = workflow.workflow_name;
        workflowDataMap[workflowName] = workflow[trendKey];

        if (workflow[trendKey]) {
            Object.keys(workflow[trendKey]).forEach(month => {
                allMonths.add(month);
            });
        }
    });

    const sortedMonths = Array.from(allMonths).sort();

    const transformedData = sortedMonths.map(month => {
        const monthEntry = { month: month };

        data.forEach(workflow => {
            const workflowName = workflow.workflow_name;
            
            monthEntry[workflowName] = workflowDataMap[workflowName]
                ? workflowDataMap[workflowName][month] || null
                : null;
        });

        return monthEntry;
    });

    const workflowNames = data.map(entry => entry.workflow_name);

    return { transformedData, workflowNames };
};