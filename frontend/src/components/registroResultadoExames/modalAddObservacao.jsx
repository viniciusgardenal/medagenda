import React from 'react';

const ModalAddObservacao = ({ isOpen, onClose, registro, observacaoEditada, setObservacaoEditada, onSave }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="relative bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
=======
            <div className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-lg border border-gray-200">
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                    X
                </button>
<<<<<<< HEAD
                <h2 className="text-2xl text-gray-800 font-semibold text-center mb-5">Definir Resultado</h2>
                <div className="space-y-4">
                    <label className="block text-gray-700 font-medium">Definir Observações:</label>
=======
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-5">Definir Resultado</h2>
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Definir Observações:</label>
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                    <textarea
                        value={observacaoEditada}
                        onChange={(e) => setObservacaoEditada(e.target.value)}
                        placeholder="Digite suas observações"
<<<<<<< HEAD
                        className="w-full p-3 bg-gray-50 border border-[#001233] rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233]"
=======
                        rows="10"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                    />
                </div>
                <button
                    onClick={() => onSave(registro.idRegistro)}
<<<<<<< HEAD
                    className="mt-6 w-full py-3 bg-gray-100 text-[#001233] border border-[#001233] rounded-lg font-semibold hover:bg-[#001233] hover:text-white transition-colors"
=======
                    className="mt-6 w-full py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                >
                    Salvar
                </button>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default ModalAddObservacao;
=======
export default ModalAddObservacao;
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
