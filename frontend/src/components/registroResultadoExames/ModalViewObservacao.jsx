import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ModalViewObservacao = ({ isOpen, onClose, registro }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-200">
            <div className="relative bg-white w-full max-w-3xl p-8 rounded-2xl shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Visualizar Resultado</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">ID Registro:</label>
                        <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                            {registro.idRegistro}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Exame:</label>
                        <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                            {registro.solicitacaoExame?.tipoExame.nomeTipoExame || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Profissional:</label>
                        <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                            {registro.profissional.nome || "N/A"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Paciente:</label>
                        <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
                            {registro.paciente.nome || "N/A"}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Observações:</label>
                        <textarea
                            rows={10}
                            readOnly
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm min-h-[120px] whitespace-pre-wrap"
                            value={registro.observacoes || 'Nenhuma observação registrada'}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalViewObservacao;