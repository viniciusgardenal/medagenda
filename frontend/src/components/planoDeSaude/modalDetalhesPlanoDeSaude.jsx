import React, { useEffect, useRef } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";

const ModalDetalhesPlanoDeSaude = ({
  isOpen,
  onClose,
  planoDeSaude,
  onEditar,
}) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !planoDeSaude) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out dark:bg-gray-900 dark:bg-opacity-80"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 ease-out scale-95 animate-in slide-in-from-bottom-10 dark:shadow-gray-900"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2
              id="modal-title"
              className="text-2xl font-semibold text-gray-800 dark:text-gray-100"
            >
              Plano de Saúde
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors transform hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-6">
          {/* Seção Principal */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300">
                {planoDeSaude.nomeOperadora || "N/A"}
              </h3>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  planoDeSaude.tipoPlano === "Individual"
                    ? "bg-blue-200 text-blue-800"
                    : planoDeSaude.tipoPlano === "Familiar"
                    ? "bg-purple-200 text-purple-800"
                    : "bg-yellow-200 text-yellow-800"
                } dark:bg-opacity-50`}
              >
                {planoDeSaude.tipoPlano || "N/A"}
              </span>
            </div>
          </div>
          {/* Seção Secundária */}
          <div className="grid grid-cols-1 gap-4 text-gray-700 dark:text-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                ID:
              </span>
              <span className="text-sm">{planoDeSaude.idPlanoSaude}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Código:
              </span>
              <span className="text-sm font-mono">
                {planoDeSaude.codigoPlano || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Status:
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                  planoDeSaude.status === "Ativo"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                } dark:bg-opacity-50`}
              >
                {planoDeSaude.status === "Ativo" ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {planoDeSaude.status || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => onEditar(planoDeSaude.idPlanoSaude)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesPlanoDeSaude;
