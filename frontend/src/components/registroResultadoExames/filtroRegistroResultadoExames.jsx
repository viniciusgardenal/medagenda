import React from 'react';

const FiltroRegistroResultadoExames = ({ onFiltroChange }) => {
    const [filtroId, setFiltroId] = React.useState('');
    const [filtroNome, setFiltroNome] = React.useState('');

    // Atualiza o filtro no componente pai sempre que um dos campos muda
    React.useEffect(() => {
        onFiltroChange({ filtroId, filtroNome });
    }, [filtroId, filtroNome, onFiltroChange]);

    return (
<<<<<<< HEAD
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg text-gray-800 font-semibold mb-3">Filtrar Resultados de Exames</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
=======
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Filtrar Resultados de Exames</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                        ID Registro ou Solicitação
                    </label>
                    <input
                        type="text"
                        value={filtroId}
                        onChange={(e) => setFiltroId(e.target.value)}
<<<<<<< HEAD
                        placeholder="Digite o ID do registro ou solicitação"
                        className="w-full p-3 bg-gray-50 border border-[#001233] rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233]"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                        Nome do Profissional, Paciente ou Resultados
=======
                        placeholder="Digite o ID"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Nome ou Resultados
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
                    </label>
                    <input
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
<<<<<<< HEAD
                        placeholder="Digite o nome do profissional, paciente ou resultados"
                        className="w-full p-3 bg-gray-50 border border-[#001233] rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#001233]"
                    />
                </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">
                Pesquise por ID Registro, ID Solicitação, Nome do Profissional, Nome do Paciente ou Resultados. Preencha os campos acima conforme necessário.
=======
                        placeholder="Digite o nome ou resultado"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
                Pesquise por ID, Nome do Profissional, Paciente ou Resultados.
>>>>>>> 599e8ce (Update estilização de funções fundamentais)
            </p>
        </div>
    );
};

export default FiltroRegistroResultadoExames;