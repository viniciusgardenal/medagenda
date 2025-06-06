import React from "react";

/**
 * Um componente de modal de confirmação reutilizável.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Se a modal está aberta ou não.
 * @param {function} props.onClose - Função a ser chamada quando a modal for fechada (botão "Cancelar" ou clique fora).
 * @param {function} props.onConfirm - Função a ser chamada quando o usuário confirmar a ação.
 * @param {string} props.title - O título da modal.
 * @param {string|React.ReactNode} props.message - A mensagem ou conteúdo principal da modal.
 * @param {string} [props.confirmText="Confirmar"] - O texto para o botão de confirmação.
 * @param {string} [props.cancelText="Cancelar"] - O texto para o botão de cancelamento.
 * @param {string} [props.confirmColor="bg-red-600 hover:bg-red-700"] - Classes de cor para o botão de confirmação (padrão vermelho para ações destrutivas).
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "bg-red-600 hover:bg-red-700",
}) => {
  if (!isOpen) {
    return null;
  }

  // Previne o fechamento da modal ao clicar dentro do conteúdo dela
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Overlay de fundo
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Fecha a modal ao clicar no overlay
    >
      {/* Container da Modal */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={handleModalContentClick}
      >
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

        {/* Mensagem */}
        <div className="text-gray-600 mb-6">{message}</div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
