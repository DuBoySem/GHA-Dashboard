import React, { useState } from "react";
export const IssuerFailureTable = ({ data }) => {
    // Recherche et tri
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "faillure_rate",
        direction: "desc",
    });

    // Pagination
    const rowsPerPage = 10;
    const [page, setPage] = useState(1);

    // Ajout dynamique du champ failed_runs
    const dataWithFailedRuns = (data || []).map((row) => ({
        ...row,
        failed_runs:
            row.faillure_rate !== undefined &&
            (row.total_runs !== undefined || row.execution_number !== undefined)
                ? Math.round(
                      row.faillure_rate *
                          (row.total_runs !== undefined
                              ? row.total_runs
                              : row.execution_number)
                  )
                : 0,
    }));

    // Filtrage par recherche
    const filteredData =
        dataWithFailedRuns.length > 0
            ? dataWithFailedRuns.filter((row) =>
                  row.issuer_name.toLowerCase().includes(search.toLowerCase())
              )
            : [];

    // Tri (ajout du tri sur failed_runs)
    const sortedData = filteredData.slice().sort((a, b) => {
        const { key, direction } = sortConfig;
        let aValue = a[key];
        let bValue = b[key];
        if (
            key === "total_runs" ||
            key === "execution_number" ||
            key === "failed_runs"
        ) {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const paginatedData = sortedData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePrev = () => setPage((p) => Math.max(1, p - 1));
    const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return {
                    key,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
        setPage(1);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex flex-row items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                    Contributors by failure rate
                </h3>
                <input
                    type="text"
                    placeholder="Search contributor..."
                    value={search}
                    onChange={handleSearch}
                    className="border border-gray-300 rounded px-3 py-1 ml-2 w-64"
                    style={{ minWidth: 0 }}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 overflow-y-auto flex-1">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left border-r border-gray-200">
                                <div className="flex items-center gap-1">
                                    Contributor
                                    <button
                                        onClick={() =>
                                            handleSort("issuer_name")
                                        }
                                        className="ml-1 text-xs px-1 py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-200"
                                    >
                                        {sortConfig.key === "issuer_name"
                                            ? sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼"
                                            : "⇅"}
                                    </button>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-left">
                                <div className="flex items-center gap-1">
                                    Failure rate (%)
                                    <button
                                        onClick={() =>
                                            handleSort("faillure_rate")
                                        }
                                        className="ml-1 text-xs px-1 py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-200"
                                    >
                                        {sortConfig.key === "faillure_rate"
                                            ? sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼"
                                            : "⇅"}
                                    </button>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-left">
                                <div className="flex items-center gap-1">
                                    Total runs
                                    <button
                                        onClick={() =>
                                            handleSort("execution_number")
                                        }
                                        className="ml-1 text-xs px-1 py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-200"
                                    >
                                        {sortConfig.key === "execution_number"
                                            ? sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼"
                                            : "⇅"}
                                    </button>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-left">
                                <div className="flex items-center gap-1">
                                    Failed runs
                                    <button
                                        onClick={() =>
                                            handleSort("failed_runs")
                                        }
                                        className="ml-1 text-xs px-1 py-0.5 rounded border border-gray-300 bg-white hover:bg-gray-200"
                                    >
                                        {sortConfig.key === "failed_runs"
                                            ? sortConfig.direction === "asc"
                                                ? "▲"
                                                : "▼"
                                            : "⇅"}
                                    </button>
                                </div>
                            </th>
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
                                        {(row.faillure_rate * 100).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.total_runs !== undefined
                                            ? row.total_runs
                                            : row.execution_number}
                                    </td>
                                    <td className="px-4 py-2">
                                        {row.failed_runs}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
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
