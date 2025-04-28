import React, { useState } from "react";
import AtestadoForm from "./gerarAtestadoForm";
import { FaUser, FaFileMedical, FaStickyNote, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const ModalAddAtestado = ({
  isOpen,
  onClose,
  dadosAtestado,
  setDadosAtestado,
  onSave,
  isSaving,
  pacientes,
  profissionais,
}) => {
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const tiposAtestado = ["Médico", "Odontológico", "Psicológico", "Outros"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosAtestado((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMatriculaChange = (matricula) => {
    setDadosAtestado((prev) => ({ ...prev, matriculaProfissional: matricula }));
    setErrors((prev) => ({ ...prev, matriculaProfissional: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!dadosAtestado.cpfPaciente) {
      newErrors.cpfPaciente = "Por favor, selecione um paciente.";
    }
    if (!dadosAtestado.matriculaProfissional) {
      newErrors.matriculaProfissional = "Nenhum profissional autenticado.";
    }
    if (!dadosAtestado.tipoAtestado) {
      newErrors.tipoAtestado = "Por favor, selecione o tipo de atestado.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-lg relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          disabled={isSaving}
        >
          <FaTimesCircle className="h-6 w-6" />
        </button>

        {/* Título */}
        <h3 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          <FaFileMedical className="h-8 w-8" />
          Novo Atestado
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos em duas colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              {/* Campo Paciente */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaUser className="h-5 w-5 text-gray-500" />
                  Paciente
                </label>
                <select
                  name="cpfPaciente"
                  value={dadosAtestado.cpfPaciente || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.cpfPaciente ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSaving}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes && pacientes.length > 0 ? (
                    pacientes.map((paciente) => (
                      <option key={paciente.cpf} value={paciente.cpf}>
                        {`${paciente.nome} ${paciente.sobrenome || ""} (CPF: ${paciente.cpf})`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      Nenhum paciente disponível
                    </option>
                  )}
                </select>
                {errors.cpfPaciente && (
                  <p className="text-sm text-red-500 mt-1">{errors.cpfPaciente}</p>
                )}
              </div>

              {/* Profissional (Autenticado) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaUser className="h-5 w-5 text-gray-500" />
                  Profissional (Autenticado)
                </label>
                <AtestadoForm onMatriculaChange={handleMatriculaChange} />
                {errors.matriculaProfissional && (
                  <p className="text-sm text-red-500 mt-1">{errors.matriculaProfissional}</p>
                )}
              </div>

              {/* Tipo de Atestado */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaFileMedical className="h-5 w-5 text-gray-500" />
                  Tipo de Atestado
                </label>
                <select
                  name="tipoAtestado"
                  value={dadosAtestado.tipoAtestado || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.tipoAtestado ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSaving}
                >
                  <option value="">Selecione o tipo de atestado</option>
                  {tiposAtestado.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoAtestado && (
                  <p className="text-sm text-red-500 mt-1">{errors.tipoAtestado}</p>
                )}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              {/* Motivo */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaStickyNote className="h-5 w-5 text-gray-500" />
                  Motivo (opcional)
                </label>
                <input
                  type="text"
                  name="motivo"
                  value={dadosAtestado.motivo || ""}
                  onChange={handleChange}
                  placeholder="Digite o motivo do atestado"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={isSaving}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaStickyNote className="h-5 w-5 text-gray-500" />
                  Observações (opcional)
                </label>
                <textarea
                  name="observacoes"
                  value={dadosAtestado.observacoes || ""}
                  onChange={handleChange}
                  placeholder="Digite observações adicionais"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  rows="2"
                  disabled={isSaving}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
                  <FaCheckCircle className="h-5 w-5 text-gray-500" />
                  Status
                </label>
                <select
                  name="status"
                  value={dadosAtestado.status || "Ativo"}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={isSaving}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 focus:outline-none"
              disabled={isSaving}
            >
              <FaTimesCircle className="h-5 w-5" />
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 focus:outline-none"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <FaSpinner className="h-5 w-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <FaFileMedical className="h-5 w-5" />
                  Gerar Atestado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddAtestado;