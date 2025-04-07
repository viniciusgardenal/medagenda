import React from 'react';

const ModalViewObservacao = ({ isOpen, onClose, registro }) => {
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
                <h2 className="text-2xl text-gray-800 font-semibold text-center mb-5">Visualizar Resultado</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">ID Registro:</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-[#001233]">
                            {registro.idRegistro}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Solicitação de Exame:</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-[#001233]">
                            {registro.solicitacaoExame.idSolicitacaoExame}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Profissional:</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-[#001233]">
                            {registro.profissional.nome}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Paciente:</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-[#001233]">
                            {registro.paciente.nome}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Observações:</label>
                        <p className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-[#001233] min-h-[100px] whitespace-pre-wrap">
                            {registro.observacoes || 'Nenhuma observação registrada'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-gray-100 text-[#001233] border border-[#001233] rounded-lg font-semibold hover:bg-[#001233] hover:text-white transition-colors"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ModalViewObservacao;