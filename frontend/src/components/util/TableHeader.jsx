import React from "react";

const TableHeader = ({ label, field, sortField, sortDirection, onSort, className }) => (
  <th
    onClick={() => onSort(field)}
    className={className || "px-6 py-3.5 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer text-white bg-blue-600 hover:bg-blue-700 transition-colors select-none"}
  >
    {label}
    {sortField === field && (
      <span className="ml-2">{sortDirection === "asc" ? "↑" : "↓"}</span>
    )}
  </th>
);

export default TableHeader;
