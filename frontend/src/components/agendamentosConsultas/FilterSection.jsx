const FilterSection = ({ filtros, setFiltros }) => (
  <div className="flex flex-col sm:flex-row gap-3">
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Paciente, Médico, Tipo de Consulta, Data, Motivo"
        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
        value={filtros.filtroNome}
        onChange={(e) => setFiltros({ ...filtros, filtroNome: e.target.value })}
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Data da Consulta
      </label>
      <input
        type="date"
        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
        value={filtros.filtroData}
        onChange={(e) => setFiltros({ ...filtros, filtroData: e.target.value })}
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Status
      </label>
      <select
        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
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
