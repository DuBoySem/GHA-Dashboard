export const transformTrendData = (
    data,
    trendKey = "month_average_trend",
    valueKey = "median"
) => {
    if (!data || data.length === 0) {
        return { transformedData: [], workflowNames: [] };
    }

    const allMonths = new Set();
    const workflowDataMap = {};

    data.forEach((workflow) => {
        const workflowName = workflow.workflow_name;
        workflowDataMap[workflowName] = workflow[trendKey];

        if (workflow[trendKey]) {
            Object.keys(workflow[trendKey]).forEach((month) => {
                allMonths.add(month);
            });
        }
    });

    const sortedMonths = Array.from(allMonths).sort();

    const transformedData = sortedMonths.map((month) => {
        const monthEntry = { month };

        data.forEach((workflow) => {
            const workflowName = workflow.workflow_name;
            const trendObj =
                workflowDataMap[workflowName] &&
                workflowDataMap[workflowName][month];

            if (trendObj !== undefined && trendObj !== null) {
                const value =
                    valueKey && trendObj[valueKey] !== undefined
                        ? trendObj[valueKey]
                        : 0;
                const total = trendObj.total !== undefined ? trendObj.total : 0;

                // 🔹 On stocke la valeur normale pour dataKey
                monthEntry[workflowName] = value;
                // 🔹 On stocke aussi les meta-infos dans une clé parallèle
                monthEntry[`${workflowName}__meta`] = { total };
            } else {
                monthEntry[workflowName] = 0;
                monthEntry[`${workflowName}__meta`] = { total: 0 };
            }
        });

        return monthEntry;
    });

    const workflowNames = data.map((entry) => entry.workflow_name);

    return { transformedData, workflowNames };
};
