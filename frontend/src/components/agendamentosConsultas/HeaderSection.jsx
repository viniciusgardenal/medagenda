const HeaderSection = ({ openAddModal, isLoading }) => (
  <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
    <div>
      <h2 className="text-xl font-bold text-slate-800">
        Agendamento de Consultas
      </h2>
      <p className="text-sm text-slate-500 mt-0.5">Gerenciar consultas agendadas, em atendimento e realizadas</p>
    </div>
    <div className="flex gap-3">
      <button
        onClick={openAddModal}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Nova Consulta
      </button>
    </div>
  </div>
);

export default HeaderSection;
