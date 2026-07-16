// Pagination.jsx
import React from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxPageButtons = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const halfWay = Math.ceil(maxPageButtons / 2);
    if (currentPage <= halfWay) {
      for (let i = 1; i <= maxPageButtons - 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }
    if (currentPage > totalPages - halfWay) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - (maxPageButtons - 2); i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200">
      <p className="text-sm text-slate-500">
        Exibindo <span className="font-medium text-slate-700">{from}–{to}</span> de <span className="font-medium text-slate-700">{totalItems}</span> registros
      </p>

      <ul className="flex items-center gap-1">
        {/* Anterior */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-md border text-sm transition-colors ${
              currentPage === 1
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                : "border-slate-300 text-slate-600 hover:bg-slate-100 bg-white"
            }`}
          >
            <ChevronLeft size={15} />
          </button>
        </li>

        {/* Páginas */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-2 py-1 text-sm text-slate-400">…</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                  currentPage === page
                    ? "bg-blue-700 text-white border-blue-700 font-medium"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Próximo */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-md border text-sm transition-colors ${
              currentPage === totalPages
                ? "border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50"
                : "border-slate-300 text-slate-600 hover:bg-slate-100 bg-white"
            }`}
          >
            <ChevronRight size={15} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  maxPageButtons: PropTypes.number,
};

export default Pagination;
