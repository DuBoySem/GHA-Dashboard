// transformKpiData.js
export function transformKpiData(kpis) {
    const workflows = kpis.AverageFaillureRatePerWorkflow;

    if (!workflows || workflows.length === 0) {
        return { trendData: [], barData: [], summary: {} };
    }

    // 1️⃣ Extraire tous les mois uniques
    const months = [
        ...new Set(
            workflows.flatMap((wf) => Object.keys(wf.month_average_trend))
        ),
    ].sort();

    // 2️⃣ Générer les données pour le LineChart
    const trendData = months.map((month) => {
        const row = { month };
        workflows.forEach((wf) => {
            row[wf.workflow_name] =
                (wf.month_average_trend[month]?.rate || 0) * 100;
        });
        return row;
    });

    // 3️⃣ Générer les données pour le BarChart
    const barData = workflows.map((wf) => ({
        name: wf.workflow_name,
        value: wf.faillure_rate * 100,
    }));

    // 4️⃣ Calculer le résumé (2 derniers mois)
    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    function averageRate(month) {
        const rates = workflows.map(
            (wf) => wf.month_average_trend[month]?.rate || 0
        );
        const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
        return parseFloat((avg * 100).toFixed(1));
    }

    const summary = {
        prevMonth: { label: prevMonth, value: averageRate(prevMonth) },
        currentMonth: { label: lastMonth, value: averageRate(lastMonth) },
    };

    return { trendData, barData, summary };
}
