import React from 'react';
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
                    <textarea
                        id="observacao"
                        value={observacaoEditada}
                        onChange={(e) => setObservacaoEditada(e.target.value)}
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
            </div>
        </div>
    );
};

export default ModalEditObservacao;