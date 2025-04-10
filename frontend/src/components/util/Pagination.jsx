// Pagination.jsx
import React from "react";
import PropTypes from "prop-types";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxPageButtons = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Não renderize se tiver apenas uma página
  if (totalPages <= 1) return null;

  // Lógica para determinar quais botões de página mostrar
  const getPageNumbers = () => {
    const pages = [];

    // Caso simples: menos páginas que o número máximo de botões
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Caso complexo: muitas páginas, precisa truncar
    const halfWay = Math.ceil(maxPageButtons / 2);

    // Próximo à primeira página
    if (currentPage <= halfWay) {
      for (let i = 1; i <= maxPageButtons - 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    // Próximo à última página
    if (currentPage > totalPages - halfWay) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - (maxPageButtons - 2); i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // No meio
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="flex items-center justify-center mt-8">
      <ul className="flex space-x-1">
        {/* Botão anterior */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
            }`}
          >
            &laquo;
          </button>
        </li>

        {/* Números de páginas */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Botão próximo */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-50 border border-gray-300"
            }`}
          >
            &raquo;
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
