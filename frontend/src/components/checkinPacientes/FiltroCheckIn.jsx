import React from "react";

const FiltroCheckIn = ({ onFiltroChange, defaultDate }) => {
  const [filtroNome, setFiltroNome] = React.useState("");
  const [filtroData, setFiltroData] = React.useState(defaultDate);

  React.useEffect(() => {
    onFiltroChange({ filtroNome, filtroData });
  }, [filtroNome, filtroData, onFiltroChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Busca por Nome
        </label>
        <div className="relative">
          <input
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            placeholder="Nome do paciente ou médico..."
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {filtroNome && (
            <button
              onClick={() => setFiltroNome("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Data da Consulta
        </label>
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default FiltroCheckIn;