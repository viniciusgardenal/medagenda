import React from 'react';

const ModalViewObservacao = ({ isOpen, onClose, registro }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg border border-gray-200">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                    X
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-5">Visualizar Resultado</h2>
                
                {/* Dividindo em duas colunas para os campos de ID, Solicitação, Profissional e Paciente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: "ID Registro", value: registro.idRegistro },
                        { label: "Solicitação de Exame", value: registro.solicitacaoExame.idSolicitacaoExame },
                        { label: "Profissional", value: registro.profissional.nome },
                        { label: "Paciente", value: registro.paciente.nome }
                    ].map((item, index) => (
                        <div key={index}>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">{item.label}:</label>
                            <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-300">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Destaque para o campo de Observações */}
                <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-600 mb-1">Observações:</label>
                    <p className="w-full p-4 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-300 min-h-[200px] whitespace-pre-wrap">
                        {registro.observacoes || 'Nenhuma observação registrada'}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ModalViewObservacao;
