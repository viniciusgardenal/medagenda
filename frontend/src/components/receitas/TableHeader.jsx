import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const TableHeader = ({ label, field, sortField, sortDirection, onSort }) => {
  const isActive = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors bg-slate-800 text-slate-200 hover:bg-slate-700"
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span className="flex flex-col -space-y-0.5">
          <ChevronUp size={10} className={isActive && sortDirection === "asc" ? "text-white" : "text-slate-600"} />
          <ChevronDown size={10} className={isActive && sortDirection === "desc" ? "text-white" : "text-slate-600"} />
        </span>
      </div>
    </th>
  );
};

export default TableHeader;
