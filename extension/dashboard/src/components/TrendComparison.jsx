const TrendArrowUp = ({ colorClass }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 inline-block ml-1 ${colorClass}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
        />
    </svg>
);

const TrendArrowDown = ({ colorClass }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 inline-block ml-1 ${colorClass}`}
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
        />
    </svg>
);

const TrendStable = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-500 inline-block ml-1"
        viewBox="0 0 20 20"
        fill="currentColor"
    >
        <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
        />
    </svg>
);

import { transformTrendData } from "../utils/transformTrendData.js";

const TrendComparison = ({
    data,
    trendKey = "month_average_trend",
    valueKey = "median",
    formatNumber,
    unit = "%",
    reverse = true,
}) => {
    // Adapté pour la nouvelle structure : on passe data brut et on transforme ici
    const { transformedData, workflowNames } = transformTrendData(
        data,
        trendKey,
        valueKey
    );
    let lastMonthAverage = 0;
    let currentMonthAverage = 0;
    let lastMonthLabel = "";
    let currentMonthLabel = "";
    let trendIcon = null;

    if (!transformedData || transformedData.length < 2) {
        return null;
    }

    const currentMonthData = transformedData[transformedData.length - 1];
    currentMonthLabel = currentMonthData.month;

    const currentMonthValues = workflowNames
        .map((name) => currentMonthData[name])
        .filter((value) => value !== null && value !== undefined);

    currentMonthAverage =
        currentMonthValues.length > 0
            ? currentMonthValues.reduce((sum, val) => sum + val, 0) /
              currentMonthValues.length
            : 0;

    currentMonthAverage =
        unit === "%" ? currentMonthAverage * 100 : currentMonthAverage;

    const lastMonthData = transformedData[transformedData.length - 2];
    lastMonthLabel = lastMonthData.month;

    const lastMonthValues = workflowNames
        .map((name) => lastMonthData[name])
        .filter((value) => value !== null && value !== undefined);

    lastMonthAverage =
        lastMonthValues.length > 0
            ? lastMonthValues.reduce((sum, val) => sum + val, 0) /
              lastMonthValues.length
            : 0;

    lastMonthAverage = unit === "%" ? lastMonthAverage * 100 : lastMonthAverage;
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
        <div className="chart-style flex items-center justify-center p-2 gap-2">
            <span className="text-xs text-gray-600">
                {`Average for ${lastMonthLabel}: `}
                <span className="font-semibold text-sm text-gray-800">{`${formatNumber(
                    lastMonthAverage
                )}${unit}`}</span>
            </span>
            <span className="flex items-center">{trendIcon}</span>
            <span className="text-xs text-gray-600">
                {`Average for ${currentMonthLabel}: `}
                <span className="font-semibold text-gray-800 text-sm">{`${formatNumber(
                    currentMonthAverage
                )}${unit}`}</span>
            </span>
        </div>
    );
};

export default TrendComparison;
