import React, { useState } from "react";

export const IssuerFailureTable = ({ data }) => {
    const sortedData = data
        ? [...data].sort((a, b) => b.faillure_rate - a.faillure_rate)
        : [];

    // Pagination
    const rowsPerPage = 10;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = sortedData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold mb-4">
                Contributors by failure rate
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 overflow-y-auto flex-1">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left border-r border-gray-200">
                                Contributor
                            </th>
                            <th className="px-4 py-2 text-left">
                                Failure rate (%)
                            </th>
                            <th className="px-4 py-2 text-left">Total runs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData && paginatedData.length > 0 ? (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`table-row ${
                                        index < paginatedData.length - 1
                                            ? "border-b border-gray-200"
                                            : ""
                                    }`}
                                >
                                    <td className="px-4 py-2 border-r border-gray-200">
                                        {row.issuer_name}
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-200">
                                        {row.faillure_rate.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.faillure_rate.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-4 py-4 text-center text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-4">
                    <button
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <span>
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
