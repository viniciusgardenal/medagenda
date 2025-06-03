const FilterSection = ({ filtros, setFiltros }) => (
  // console.log("Renderizando FilterSection com filtros:", filtros),
  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Paciente, Médico, Tipo de Consulta, Data, Motivo"
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={filtros.filtroNome}
        onChange={(e) => setFiltros({ ...filtros, filtroNome: e.target.value })}
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Data da Consulta
      </label>
      <input
        type="date"
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={filtros.filtroData}
        onChange={(e) => setFiltros({ ...filtros, filtroData: e.target.value })}
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Status
      </label>
      <select
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={filtros.filtroStatus}
        onChange={(e) =>
          setFiltros({ ...filtros, filtroStatus: e.target.value })
        }
      >
        <option value="">Todos</option>
        <option value="agendada">Agendada</option>
        <option value="checkin_realizado">Check-in Realizado</option>
        <option value="em_atendimento">Em Atendimento</option>
        <option value="realizada">Realizada</option>
        <option value="cancelada">Cancelada</option>
        <option value="adiada">Adiada</option>
      </select>
    </div>
  </div>
);

export default FilterSection;
