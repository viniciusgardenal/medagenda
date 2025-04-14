import React from 'react';

const ModalEditObservacao = ({ isOpen, onClose, registro, observacaoEditada, setObservacaoEditada, onSave }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-200">
            <div className="relative bg-white w-full max-w-2xl p-8 rounded-2xl shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Editar Resultado</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Editar Observações:</label>
                        <textarea
                            value={observacaoEditada}
                            onChange={(e) => setObservacaoEditada(e.target.value)}
                            rows={10}
                            placeholder="Digite suas observações"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                        />
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSave(registro.idRegistro)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditObservacao;