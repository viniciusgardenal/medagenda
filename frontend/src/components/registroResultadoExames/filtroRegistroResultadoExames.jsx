import React from 'react';

const FiltroRegistroResultadoExames = ({ onFiltroChange }) => {
    const [filtroId, setFiltroId] = React.useState('');
    const [filtroNome, setFiltroNome] = React.useState('');

    // Atualiza o filtro no componente pai sempre que um dos campos muda
    React.useEffect(() => {
        onFiltroChange({ filtroId, filtroNome });
    }, [filtroId, filtroNome, onFiltroChange]);

    return (
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Filtrar Resultados de Exames</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        ID Registro ou Solicitação
                    </label>
                    <input
                        type="text"
                        value={filtroId}
                        onChange={(e) => setFiltroId(e.target.value)}
                        placeholder="Digite o ID"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Nome ou Resultados
                    </label>
                    <input
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        placeholder="Digite o nome ou resultado"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
                Pesquise por ID, Nome do Profissional, Paciente ou Resultados.
            </p>
        </div>
    );
};

export default FiltroRegistroResultadoExames;