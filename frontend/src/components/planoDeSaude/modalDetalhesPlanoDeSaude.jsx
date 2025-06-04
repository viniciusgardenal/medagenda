import React, { useEffect, useRef } from "react";
import { FaFileMedical, FaInfoCircle, FaEdit } from "react-icons/fa";

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
      className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl relative transform transition-all"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaFileMedical className="h-8 w-8 text-blue-600" />
          <h3
            id="modal-title"
            className="text-2xl font-bold text-gray-800"
          >
            Detalhes do Plano de Saúde
          </h3>
        </div>

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
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

        {/* Content */}
        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* Nome da Operadora */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Nome da Operadora
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.nomeOperadora || "N/A"}
              </dd>
            </div>

            {/* ID */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                ID
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.idPlanoSaude}
              </dd>
            </div>

            {/* Código */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Código
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.codigoPlano || "N/A"}
              </dd>
            </div>

            {/* Tipo do Plano */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Tipo do Plano
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    planoDeSaude.tipoPlano === "Individual"
                      ? "bg-blue-200 text-blue-800"
                      : planoDeSaude.tipoPlano === "Familiar"
                      ? "bg-purple-200 text-purple-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {planoDeSaude.tipoPlano || "N/A"}
                </span>
              </dd>
            </div>

            {/* Status */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    planoDeSaude.status === "Ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {planoDeSaude.status || "N/A"}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesPlanoDeSaude;