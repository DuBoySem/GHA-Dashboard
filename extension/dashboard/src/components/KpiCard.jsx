const KpiCard = ({
    title,
    summary,
    barChart,
    lineChart,
    lineTitle,
    barTitle,
}) => (
    <div className="flex flex-col w-full min-h-0">
        {(title || summary) && (
            <div className="flex justify-between items-center border-l border-r border-t border-gray-300 bg-gray-700 rounded-t-lg p-2">
                {title && (
                    <h3
                        className="text-white mx-2 font-semibold"
                        style={{ fontSize: "1.2rem" }}
                    >
                        {title}
                    </h3>
                )}
                {summary && <div>{summary}</div>}
            </div>
        )}
        {/* Extract chart section rendering logic into independent variables */}
        {(() => {
            let chartSection = null;
            if (barChart && lineChart) {
                chartSection = (
                    <div className="flex bg-gray-100  border-b border-l border-r border-gray-200 rounded-b-lg p-2 gap-3 flex-1 min-h-0">
                        <div className="w-1/2 flex flex-col gap-2 flex-1 min-h-0">
                            {barTitle && (
                                <h3
                                    className="text-3xl text-center font-semibold text-gray-700"
                                    style={{ fontSize: "1.0rem" }}
                                >
                                    {barTitle}
                                </h3>
                            )}
                            <div className="flex-1 min-h-0">{barChart}</div>
                        </div>
                        <div className="w-1/2 flex flex-col gap-2 flex-1 min-h-0">
                            {lineTitle && (
                                <h3
                                    className="text-3xl text-center font-semibold text-gray-700"
                                    style={{ fontSize: "1.0rem" }}
                                >
                                    {lineTitle}
                                </h3>
                            )}
                            <div className="flex-1 min-h-0">{lineChart}</div>
                        </div>
                    </div>
                );
            } else if (barChart) {
                chartSection = (
                    <div className="flex bg-gray-100  border-b border-l border-r border-gray-200 rounded-b-lg p-2 gap-3 flex-1 min-h-0">
                        <div className="w-full flex flex-col gap-2 flex-1 min-h-0">
                            {barTitle && (
                                <h3
                                    className="text-3xl text-center font-semibold text-gray-700"
                                    style={{ fontSize: "1.0rem" }}
                                >
                                    {barTitle}
                                </h3>
                            )}
                            <div className="flex-1 min-h-0">{barChart}</div>
                        </div>
                    </div>
                );
            } else if (lineChart) {
                chartSection = (
                    <div className="flex bg-gray-100  border-b border-l border-r border-gray-200 rounded-b-lg p-2 gap-3 flex-1 min-h-0">
                        <div className="w-full flex flex-col gap-2 flex-1 min-h-0">
                            {lineTitle && (
                                <h3
                                    className="text-3xl text-center font-semibold text-gray-700"
                                    style={{ fontSize: "1.0rem" }}
                                >
                                    {lineTitle}
                                </h3>
                            )}
                            <div className="flex-1 min-h-0">{lineChart}</div>
                        </div>
                    </div>
                );
            }
            return chartSection;
        })()}
    </div>
);

export default KpiCard;
