import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import {
  criarReceita,
  getMedicamentos,
  getPacientes,
} from "../../config/apiServices";

const EmitirReceitas = () => {
  const { user } = useAuthContext();
  const [pacientes, setPacientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [medicamentosSelecionados, setMedicamentosSelecionados] = useState([
    { idMedicamento: "", dosagem: "", instrucaoUso: "" },
  ]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Carregar dados de pacientes e medicamentos ao montar o componente
  useEffect(() => {
    const loadDados = async () => {
      try {
        const pacientesData = await getPacientes();
        setPacientes(pacientesData.data);
        const medicamentosData = await getMedicamentos();
        setMedicamentos(medicamentosData.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
        setError("Erro ao carregar dados. Tente novamente.");
      }
    };
    loadDados();
  }, []);

  // Adicionar um novo medicamento ao formulário
  const handleAddMedicamento = () => {
    setMedicamentosSelecionados([
      ...medicamentosSelecionados,
      { idMedicamento: "", dosagem: "", instrucaoUso: "" },
    ]);
  };

  // Remover um medicamento do formulário
  const handleRemoveMedicamento = (index) => {
    setMedicamentosSelecionados(
      medicamentosSelecionados.filter((_, i) => i !== index)
    );
  };

  // Atualizar os campos de um medicamento específico
  const handleMedicamentoChange = (index, field, value) => {
    const updatedMedicamentos = [...medicamentosSelecionados];
    updatedMedicamentos[index][field] = value;
    setMedicamentosSelecionados(updatedMedicamentos);
  };

  // Enviar a receita para o backend
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    try {
      const dados = {
        cpfPaciente: pacienteSelecionado,
        matriculaProfissional: user.id,
        medicamentos: medicamentosSelecionados.map((med) => ({
          idMedicamento: med.idMedicamento,
          dosagem: med.dosagem,
          instrucaoUso: med.instrucaoUso,
        })),
      };
      const response = await criarReceita(dados);
      if (response.headers["content-type"] === "application/pdf") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "receita.pdf";
        link.click();
        setSuccess("Receita emitida com sucesso!");
      } else {
        setError("Erro ao emitir a receita. Resposta inválida.");
      }
    } catch (error) {
      console.error("Erro ao emitir receita", error);
      setError("Erro ao emitir a receita. Tente novamente.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Emitir Receita</h2>

      {/* Mensagens de erro e sucesso */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md">
          {success}
        </div>
      )}

      {/* Seleção de paciente */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          Paciente
        </label>
        <select
          value={pacienteSelecionado}
          onChange={(e) => setPacienteSelecionado(e.target.value)}
          className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Selecione um paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.cpf} value={paciente.cpf}>
              {paciente.nome} {paciente.sobrenome} (CPF: {paciente.cpf})
            </option>
          ))}
        </select>
      </div>

      {/* Informações do profissional (somente leitura) */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          Profissional
        </label>
        <input
          type="text"
          value={`${user?.nome || "Nome não disponível"} (CRM: ${
            user?.crm || "CRM não disponível"
          })`}
          readOnly
          className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
        />
      </div>

      {/* Lista de medicamentos */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">
          Medicamentos
        </h3>
        {medicamentosSelecionados.map((med, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <select
              value={med.idMedicamento}
              onChange={(e) =>
                handleMedicamentoChange(index, "idMedicamento", e.target.value)
              }
              className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md"
            >
              <option value="">Selecione um medicamento</option>
              {medicamentos.map((medicamento) => (
                <option
                  key={medicamento.idMedicamento}
                  value={medicamento.idMedicamento}
                >
                  {medicamento.nomeMedicamento}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Dosagem"
              value={med.dosagem}
              onChange={(e) =>
                handleMedicamentoChange(index, "dosagem", e.target.value)
              }
              className="w-24 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Instruções de uso"
              value={med.instrucaoUso}
              onChange={(e) =>
                handleMedicamentoChange(index, "instrucaoUso", e.target.value)
              }
              className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => handleRemoveMedicamento(index)}
              className="text-red-600 hover:text-red-800 transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMedicamento}
          className="mt-2 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors duration-150"
        >
          + Adicionar Medicamento
        </button>
      </div>

      {/* Botão de emissão */}
      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-150"
      >
        Emitir Receita
      </button>
    </div>
  );
};

export default EmitirReceitas;