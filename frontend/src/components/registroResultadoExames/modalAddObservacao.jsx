import React from 'react';

const ModalAddObservacao = ({ isOpen, onClose, registro, observacaoEditada, setObservacaoEditada, onSave }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                    X
                </button>
                <h2 className="text-2xl text-gray-800 font-semibold text-center mb-5">Definir Resultado</h2>
                <div className="space-y-4">
                    <label className="block text-gray-700 font-medium">Definir Observações:</label>
                    <textarea
                        value={observacaoEditada}
                        onChange={(e) => setObservacaoEditada(e.target.value)}
                        placeholder="Digite suas observações"
                        className="w-full p-3 bg-gray-50 border border-[#001233] rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233]"
                    />
                </div>
                <button
                    onClick={() => onSave(registro.idRegistro)}
                    className="mt-6 w-full py-3 bg-gray-100 text-[#001233] border border-[#001233] rounded-lg font-semibold hover:bg-[#001233] hover:text-white transition-colors"
                >
                    Salvar
                </button>
            </div>
        </div>
    );
};

export default ModalAddObservacao;