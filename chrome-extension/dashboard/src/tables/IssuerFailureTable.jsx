import React from "react";

export const IssuerFailureTable = ({ data }) => {
    const sortedData = data 
        ? [...data].sort((a, b) => b.faillure_rate - a.faillure_rate) 
        : [];
    
    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Contributors by failure rate</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 overflow-y-auto flex-1">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left border-r border-gray-200">Contributor</th>
                        <th className="px-4 py-2 text-left">Failure rate (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                        {sortedData && sortedData.length > 0 ? (
                            sortedData.map((row, index) => (
                                <tr key={index} className={`table-row ${index < sortedData.length - 1 ? "border-b border-gray-200" : ""}`}>
                                    <td className="px-4 py-2 border-r border-gray-200">{row.issuer_name}</td>
                                    <td className="px-4 py-2">{row.faillure_rate.toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
