const HeaderSection = ({ openAddModal, isLoading }) => (
  <div className="border-b pb-4 flex justify-between items-center">
    <h2 className="text-3xl font-bold text-blue-600">
      Agendamento de Consultas
    </h2>
    <div className="flex gap-3">
      <button
        onClick={openAddModal}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
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
