import React from 'react';
<<<<<<< HEAD

const ModalEditObservacao = ({ isOpen, onClose, registro, observacaoEditada, setObservacaoEditada, onSave }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-lg border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                    X
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-5">Editar Resultado</h2>
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Editar Observações:</label>
=======
import { X, Save, FileText } from 'lucide-react';

const ModalEditObservacao = ({ 
    isOpen, 
    onClose, 
    registro, 
    observacaoEditada, 
    setObservacaoEditada, 
    onSave 
}) => {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave(registro.idRegistro);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FileText className="mr-2 text-blue-600" size={24} />
                        Definir Resultado do Exame
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informações do Registro
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="text-sm mb-1">
                            <span className="font-medium">Paciente:</span> {registro.paciente.nome}
                        </p>
                        <p className="text-sm mb-1">
                            <span className="font-medium">Solicitação de Exame:</span> {registro.solicitacaoExame.idSolicitacaoExame}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Profissional:</span> {registro.profissional.nome}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-2">
                        Observações do Resultado
                    </label>
>>>>>>> c7ec108 (update styles)
                    <textarea
                        id="observacao"
                        value={observacaoEditada}
                        onChange={(e) => setObservacaoEditada(e.target.value)}
<<<<<<< HEAD
                        placeholder="Digite suas observações"
                        rows="10"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    onClick={() => onSave(registro.idRegistro)}
                    className="mt-6 w-full py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                    Salvar
                </button>
=======
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                        placeholder="Insira as observações do resultado do exame..."
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Save className="mr-2" size={18} />
                        Salvar
                    </button>
                </div>
>>>>>>> c7ec108 (update styles)
            </div>
        </div>
    );
};

export default ModalEditObservacao;