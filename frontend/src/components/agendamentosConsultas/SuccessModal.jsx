// SuccessModal.jsx

import React, { useEffect } from "react";

/**
 * Modal para exibir uma mensagem de sucesso, que fecha automaticamente.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Se a modal está aberta.
 * @param {function} props.onClose - Função chamada para fechar a modal.
 * @param {string} props.title - O título da modal.
 * @param {string|React.ReactNode} props.message - A mensagem principal.
 */
const SuccessModal = ({ isOpen, onClose, title, message }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Fecha a modal automaticamente após 3 segundos

      // Limpa o timer se o componente for desmontado ou a modal for fechada manualmente
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    // Overlay
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      {/* Conteúdo da Modal */}
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
        {/* Ícone de Sucesso (Opcional) */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
