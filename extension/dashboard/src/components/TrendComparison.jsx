const TrendArrowUp = ({ colorClass }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 inline-block ml-2 ${colorClass}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;

const TrendArrowDown = ({ colorClass }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 inline-block ml-2 ${colorClass}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const TrendStable = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

const TrendComparison = ({ transformedData, workflowNames, formatNumber, unit = '%', reverse = true }) => {
    let lastMonthAverage = 0;
    let currentMonthAverage = 0;
    let lastMonthLabel = '';
    let currentMonthLabel = '';
    let trendIcon = null;

    if (!transformedData || transformedData.length < 2) {
        return null;
    }

    const currentMonthData = transformedData[transformedData.length - 1];
    currentMonthLabel = currentMonthData.month;

    const currentMonthValues = workflowNames
        .map(name => currentMonthData[name])
        .filter(value => value !== null && value !== undefined);

    currentMonthAverage = currentMonthValues.length > 0
        ? currentMonthValues.reduce((sum, val) => sum + val, 0) / currentMonthValues.length
        : 0;

    currentMonthAverage = unit === '%' ? currentMonthAverage * 100 : currentMonthAverage;

    const lastMonthData = transformedData[transformedData.length - 2];
    lastMonthLabel = lastMonthData.month;

    const lastMonthValues = workflowNames
        .map(name => lastMonthData[name])
        .filter(value => value !== null && value !== undefined);

    lastMonthAverage = lastMonthValues.length > 0
        ? lastMonthValues.reduce((sum, val) => sum + val, 0) / lastMonthValues.length
        : 0;

    lastMonthAverage = unit === '%' ? lastMonthAverage * 100 : lastMonthAverage;
    let colorClass = "text-gray-500";

    if (currentMonthAverage > lastMonthAverage) {
        colorClass = reverse ? "text-red-500" : "text-green-500";
        trendIcon = <TrendArrowDown colorClass={colorClass} />;
    } else if (currentMonthAverage < lastMonthAverage) {
        colorClass = reverse ? "text-green-500" : "text-red-500";
        trendIcon = <TrendArrowUp colorClass={colorClass} />;
    } else {
        trendIcon = <TrendStable />;
    }

    return (
        <div className="chart-style h-28 flex justify-around items-center mb-4 p-4">
            <div className="text-center">
                <p className="text-sm text-gray-600">{`Average for ${lastMonthLabel}`}</p>
                <p className="text-lg font-bold text-gray-800">{`${formatNumber(lastMonthAverage)}${unit}`}</p>
            </div>
            <div className="flex items-center mx-4">
                {trendIcon}
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-600">{`Average for ${currentMonthLabel}`}</p>
                <p className="text-lg font-bold text-gray-800">{`${formatNumber(currentMonthAverage)}${unit}`}</p>
            </div>
        </div>
    );
};

export default TrendComparison;