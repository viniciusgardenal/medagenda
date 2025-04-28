import React from "react";

const ModalEditHorario = ({
  isOpen,
  onClose,
  horario,
  dadosHorario,
  setDadosHorario,
  onSave,
  isSaving,
  profissionais,
}) => {
  if (!isOpen || !horario) return null;

  const diasSemana = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "diaSemana") {
      setDadosHorario((prev) => ({ ...prev, diaSemana: [value] }));
    } else {
      setDadosHorario((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dadosHorario.diaSemana.length === 0) {
      alert("Selecione um dia da semana.");
      return;
    }
    if (dadosHorario.intervaloInicio && dadosHorario.intervaloFim) {
      const inicio = new Date(`1970-01-01T${dadosHorario.inicio}`);
      const fim = new Date(`1970-01-01T${dadosHorario.fim}`);
      const intervaloInicio = new Date(
        `1970-01-01T${dadosHorario.intervaloInicio}`
      );
      const intervaloFim = new Date(`1970-01-01T${dadosHorario.intervaloFim}`);
      if (
        intervaloInicio >= intervaloFim ||
        intervaloInicio < inicio ||
        intervaloFim > fim
      ) {
        alert(
          "O intervalo deve estar dentro do período de início e fim e o início do intervalo deve ser anterior ao fim."
        );
        return;
      }
    }
    onSave();
  };

  const profissional = profissionais.find(
    (p) => p.matricula.toString() === horario.matriculaProfissional.toString()
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSaving}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">
          Editar Horário
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="col-span-2">
            <label className="block text-base font-semibold text-gray-700 mb-2">
              Profissional
            </label>
            <input
              type="text"
              value={
                profissional
                  ? `${profissional.nome} ${profissional.sobrenome || ""}`
                  : "N/A"
              }
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-base text-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-1 space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Horário Início
                </label>
                <input
                  type="time"
                  name="inicio"
                  value={dadosHorario.inicio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Horário Fim
                </label>
                <input
                  type="time"
                  name="fim"
                  value={dadosHorario.fim}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Início do Intervalo (opcional)
                </label>
                <input
                  type="time"
                  name="intervaloInicio"
                  value={dadosHorario.intervaloInicio || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Fim do Intervalo (opcional)
                </label>
                <input
                  type="time"
                  name="intervaloFim"
                  value={dadosHorario.intervaloFim || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="col-span-1 space-y-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Dia da Semana
                </label>
                <select
                  name="diaSemana"
                  value={dadosHorario.diaSemana[0] || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                >
                  <option value="">Selecione um dia</option>
                  {diasSemana.map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={dadosHorario.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md text-base text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditHorario;