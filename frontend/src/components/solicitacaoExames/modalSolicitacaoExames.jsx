import React, { useState, useEffect } from "react";
import {
  criarSolicitacaoExames,
  getTiposExames,
  getPacientes,
} from "../../config/apiServices";
import ReceitaForm from "../receitas/receitaForm";

const ModalSolicitacaoExames = ({ isOpen, onClose, onSave }) => {
  const [idTipoExame, setIdTipoExame] = useState([]);
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [periodo, setPeriodo] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dataRetorno, setDataRetorno] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [erros, setErros] = useState({});
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState("");
  const [erroBackend, setErroBackend] = useState(""); // Novo estado para erros do backend

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposExameResponse, pacientesResponse] = await Promise.all([
          getTiposExames(),
          getPacientes(),
        ]);
        // Filtrar tipos de exames com nomeTipoExame válido
        const tiposExamesValidos = tiposExameResponse.data.filter(
          (tipo) => tipo.nomeTipoExame && tipo.nomeTipoExame.trim() !== ""
        );
        setIdTipoExame(tiposExamesValidos);
        setCpfPaciente(pacientesResponse.data);
        if (tiposExamesValidos.length === 0) {
          setErroBackend("Nenhum tipo de exame válido encontrado. Contate o administrador.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErroBackend("Erro ao carregar dados. Tente novamente.");
      }
    };
    fetchData();
  }, []);

  const handlePacienteChange = (event) => {
    setPacienteSelecionado(event.target.value);
    setErroBackend(""); // Limpar erro do backend ao interagir
  };

  const handleTipoExameChange = (event) => {
    setTipoExameSelecionado(event.target.value);
    setErroBackend(""); // Limpar erro do backend ao interagir
  };

  const validarCampos = () => {
    const newErros = {};
    if (!tipoExameSelecionado) newErros.tipoExame = "Obrigatório";
    if (!pacienteSelecionado) newErros.paciente = "Obrigatório";
    if (!periodo) newErros.periodo = "Obrigatório";
    if (!dataSolicitacao) newErros.dataSolicitacao = "Obrigatório";
    if (!dataRetorno) newErros.dataRetorno = "Obrigatório";
    if (!justificativa) newErros.justificativa = "Obrigatório";
    if (new Date(dataRetorno) < new Date(dataSolicitacao)) {
      newErros.dataRetorno = "Data inválida";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErroBackend(""); // Limpar erro anterior
    if (!validarCampos()) return;

    const dados = {
      idTipoExame: tipoExameSelecionado,
      periodo,
      dataSolicitacao,
      dataRetorno,
      status: "Ativo",
      justificativa,
      matriculaProfissional,
      cpfPaciente: pacienteSelecionado,
    };

    try {
      await criarSolicitacaoExames(dados);
      onSave();
      onClose();
      setIdTipoExame([]);
      setPeriodo("");
      setDataSolicitacao("");
      setDataRetorno("");
      setCpfPaciente([]);
      setJustificativa("");
      setPacienteSelecionado("");
      setTipoExameSelecionado("");
    } catch (error) {
      console.error("Erro ao adicionar solicitação de exame:", error);
      setErroBackend(
        error.response?.data?.error || "Erro ao salvar solicitação. Tente novamente."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-150"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">
          Nova Solicitação
        </h2>
        {erroBackend && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {erroBackend}
          </div>
        )}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exame
            </label>
            <select
              value={tipoExameSelecionado}
              onChange={handleTipoExameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            >
              <option value="">Selecione</option>
              {Array.isArray(idTipoExame) &&
                idTipoExame.map((tipo) => (
                  <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                    {tipo.nomeTipoExame}
                  </option>
                ))}
            </select>
            {erros.tipoExame && (
              <p className="text-red-500 text-xs">{erros.tipoExame}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Período
            </label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            >
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            {erros.periodo && (
              <p className="text-red-500 text-xs">{erros.periodo}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Médico
            </label>
            <ReceitaForm
              onMatriculaChange={setMatriculaProfissional}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <select
              value={pacienteSelecionado}
              onChange={handlePacienteChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            >
              <option value="">Selecione</option>
              {Array.isArray(cpfPaciente) &&
                cpfPaciente.map((paciente) => (
                  <option key={paciente.cpf} value={paciente.cpf}>
                    {paciente.nome} {paciente.sobrenome}
                  </option>
                ))}
            </select>
            {erros.paciente && (
              <p className="text-red-500 text-xs">{erros.paciente}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Solicitação
            </label>
            <input
              type="date"
              value={dataSolicitacao}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed shadow-sm"
              required
            />
            {erros.dataSolicitacao && (
              <p className="text-red-500 text-xs">{erros.dataSolicitacao}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Retorno
            </label>
            <input
              type="date"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            />
            {erros.dataRetorno && (
              <p className="text-red-500 text-xs">{erros.dataRetorno}</p>
            )}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Justificativa
            </label>
            <textarea
              value={justificativa}
              rows={10}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            />
            {erros.justificativa && (
              <p className="text-red-500 text-xs">{erros.justificativa}</p>
            )}
          </div>
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 mt-4"
          >
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitacaoExames;