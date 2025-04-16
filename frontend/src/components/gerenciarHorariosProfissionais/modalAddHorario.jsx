import React, { useState } from "react";

const ModalAddHorario = ({ isOpen, onClose, dadosHorario, setDadosHorario, onSave, isSaving, profissionais }) => {
  const [selecionarTodos, setSelecionarTodos] = useState(false);

  if (!isOpen) return null;

  const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const handleCheckboxChange = (dia) => {
    setDadosHorario((prev) => {
      const novosDias = prev.diaSemana.includes(dia)
        ? prev.diaSemana.filter((d) => d !== dia)
        : [...prev.diaSemana, dia];
      return { ...prev, diaSemana: novosDias };
    });
    if (selecionarTodos) setSelecionarTodos(false);
  };

  const handleSelecionarTodos = () => {
    setSelecionarTodos(!selecionarTodos);
    setDadosHorario((prev) => ({
      ...prev,
      diaSemana: !selecionarTodos ? diasSemana : [],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosHorario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dadosHorario.diaSemana.length === 0) {
      alert("Selecione pelo menos um dia da semana.");
      return;
    }
    if (!dadosHorario.profissionalId) {
      alert("Selecione um profissional.");
      return;
    }
    console.log("Dados enviados:", dadosHorario);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md relative">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Novo Horário</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profissional</label>
            <select
              name="profissionalId"
              value={dadosHorario.profissionalId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isSaving}
            >
              <option value="">Selecione um profissional</option>
              {profissionais && profissionais.length > 0 ? (
                profissionais.map((prof) => (
                  <option key={prof.matricula} value={prof.matricula.toString()}>
                    {`${prof.nome} ${prof.sobrenome || ""} (Matrícula: ${prof.matricula})`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhum profissional disponível
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dias da Semana</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selecionarTodos}
                  onChange={handleSelecionarTodos}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isSaving}
                />
                <span className="text-sm text-gray-700">Selecionar Todos</span>
              </label>
              {diasSemana.map((dia) => (
                <label key={dia} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={dadosHorario.diaSemana.includes(dia)}
                    onChange={() => handleCheckboxChange(dia)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isSaving}
                  />
                  <span className="text-sm text-gray-700">{dia}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Horário Início</label>
            <input
              type="time"
              name="inicio"
              value={dadosHorario.inicio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Horário Fim</label>
            <input
              type="time"
              name="fim"
              value={dadosHorario.fim}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={dadosHorario.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isSaving}
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
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

export default ModalAddHorario;