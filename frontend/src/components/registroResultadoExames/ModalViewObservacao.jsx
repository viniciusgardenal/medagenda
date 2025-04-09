import React from 'react';

const ModalViewObservacao = ({ isOpen, onClose, registro }) => {
    if (!isOpen || !registro) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<<<<<<< HEAD
            <div className="relative bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
=======
            <div className="relative bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg border border-gray-200">
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                    X
                </button>
<<<<<<< HEAD
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
=======
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
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default ModalViewObservacao;
=======
export default ModalViewObservacao;
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
