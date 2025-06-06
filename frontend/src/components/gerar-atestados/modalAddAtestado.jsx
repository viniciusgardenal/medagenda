// src/components/gerar-atestados/modalAddAtestado.jsx

import React, { useState, useEffect } from "react";
import AtestadoForm from "./gerarAtestadoForm";
import { FaUserInjured, FaFileMedical, FaStickyNote, FaCheckCircle, FaTimesCircle, FaSpinner, FaSave } from "react-icons/fa";

const ModalAddAtestado = ({
  isOpen,
  onClose,
  dadosAtestado,
  setDadosAtestado,
  onSave,
  isSaving,
  pacientes,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Limpa os erros quando o modal é fechado
    if (!isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tiposAtestado = ["Médico", "Odontológico", "Psicológico", "Outros"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosAtestado((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMatriculaChange = (matricula) => {
    setDadosAtestado((prev) => ({ ...prev, matriculaProfissional: matricula }));
    if (errors.matriculaProfissional) {
      setErrors((prev) => ({ ...prev, matriculaProfissional: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!dadosAtestado.cpfPaciente) newErrors.cpfPaciente = "Selecione um paciente.";
    if (!dadosAtestado.matriculaProfissional) newErrors.matriculaProfissional = "Profissional não autenticado.";
    if (!dadosAtestado.tipoAtestado) newErrors.tipoAtestado = "Selecione o tipo de atestado.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-2xl relative transform transition-all" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" disabled={isSaving}>
          <FaTimesCircle className="h-6 w-6" />
        </button>

        <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-3">
          <FaFileMedical />
          Gerar Novo Atestado
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Paciente e Profissional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select
                name="cpfPaciente"
                value={dadosAtestado.cpfPaciente || ""}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-colors ${errors.cpfPaciente ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                disabled={isSaving}
              >
                <option value="" disabled>Selecione...</option>
                {pacientes?.map((p) => (
                  <option key={p.cpf} value={p.cpf}>
                    {`${p.nome} ${p.sobrenome || ""}`}
                  </option>
                ))}
              </select>
              {errors.cpfPaciente && <p className="text-xs text-red-600 mt-1">{errors.cpfPaciente}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
              <AtestadoForm onMatriculaChange={handleMatriculaChange} />
              {errors.matriculaProfissional && <p className="text-xs text-red-600 mt-1">{errors.matriculaProfissional}</p>}
            </div>
          </div>

          {/* Tipo de Atestado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atestado</label>
            <select
                name="tipoAtestado"
                value={dadosAtestado.tipoAtestado || ""}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 transition-colors ${errors.tipoAtestado ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                disabled={isSaving}
              >
                <option value="" disabled>Selecione o tipo...</option>
                {tiposAtestado.map((tipo) => (<option key={tipo} value={tipo}>{tipo}</option>))}
            </select>
            {errors.tipoAtestado && <p className="text-xs text-red-600 mt-1">{errors.tipoAtestado}</p>}
          </div>

          {/* Motivo e Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <input type="text" name="motivo" value={dadosAtestado.motivo || ""} onChange={handleChange} placeholder="Ex: Consulta médica, Repouso..." className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSaving} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
            <textarea name="observacoes" value={dadosAtestado.observacoes || ""} onChange={handleChange} rows="3" placeholder="Detalhes adicionais..." className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSaving} />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait" disabled={isSaving}>
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              <span>{isSaving ? "Gerando..." : "Gerar Atestado"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddAtestado;