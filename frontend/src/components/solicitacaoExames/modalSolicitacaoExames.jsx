import React, { useState, useEffect } from "react";
import { criarSolicitacaoExames, getTiposExames, getPacientes } from "../../config/apiServices";
import ReceitaForm from "../receitas/receitaForm";

const ModalSolicitacaoExames = ({ isOpen, onClose, onSave }) => {
  const [idTipoExame, setIdTipoExame] = useState("");
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(new Date().toISOString().split("T")[0]);
  const [dataRetorno, setDataRetorno] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [erros, setErros] = useState({});

  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState("");

  useEffect(() => {
    // Busca os dados para os selects
    const fetchData = async () => {
      try {
        const [tiposExameResponse, pacientesResponse] = await Promise.all([
          getTiposExames(),
          getPacientes(),
        ]);
        setIdTipoExame(tiposExameResponse.data);
        setCpfPaciente(pacientesResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handlePacienteChange = (event) => {
    const cpfSelecionado = event.target.value;
    setPacienteSelecionado(cpfSelecionado);
  };

  const handleTipoExameChange = (event) => {
    const tipoExame = event.target.value;
    setTipoExameSelecionado(tipoExame);
  };

  const validarCampos = () => {
    const newErros = {};
    if (!tipoExameSelecionado) newErros.tipoExame = "Tipo de exame é obrigatório!";
    if (!pacienteSelecionado) newErros.paciente = "Paciente é obrigatório!";
    if (!periodo) newErros.periodo = "Período é obrigatório!";
    if (!dataSolicitacao) newErros.dataSolicitacao = "Data da solicitação é obrigatória!";
    if (!dataRetorno) newErros.dataRetorno = "Data de retorno é obrigatória!";
    if (!justificativa) newErros.justificativa = "Justificativa é obrigatória!";
    if (new Date(dataRetorno) < new Date(dataSolicitacao)) {
      newErros.dataRetorno = "A data de retorno não pode ser anterior à data da solicitação!";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

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

      // Limpa os campos
      setIdTipoExame("");
      setPeriodo("");
      setDataSolicitacao("");
      setDataRetorno("");
      setCpfPaciente("");
    } catch (error) {
      console.error("Erro ao adicionar solicitação de exame:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-500"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-semibold mb-6">Adicionar Solicitação de Exame</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Exame */}
          <div className="form-group">
            <label htmlFor="tipoExame" className="block text-sm font-medium text-gray-700">Tipo de Exame:</label>
            <select
              id="tipoExame"
              value={tipoExameSelecionado}
              onChange={handleTipoExameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o tipo de exame</option>
              {Array.isArray(idTipoExame) &&
                idTipoExame.map((tipo) => (
                  <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                    {tipo.nomeTipoExame}
                  </option>
                ))}
            </select>
            {erros.tipoExame && <small className="text-red-500">{erros.tipoExame}</small>}
          </div>

          {/* Matricula Profissional */}
          <ReceitaForm onMatriculaChange={setMatriculaProfissional} />

          {/* Paciente */}
          <div className="form-group">
            <label htmlFor="paciente" className="block text-sm font-medium text-gray-700">Paciente:</label>
            <select
              id="paciente"
              value={pacienteSelecionado}
              onChange={handlePacienteChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um paciente</option>
              {Array.isArray(cpfPaciente) &&
                cpfPaciente.map((paciente) => (
                  <option key={paciente.cpf} value={paciente.cpf}>
                    {paciente.nome} {paciente.sobrenome}
                  </option>
                ))}
            </select>
            {erros.paciente && <small className="text-red-500">{erros.paciente}</small>}
          </div>

          {/* Período */}
          <div className="form-group">
            <label htmlFor="periodo" className="block text-sm font-medium text-gray-700">Período:</label>
            <select
              id="periodo"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o período</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            {erros.periodo && <small className="text-red-500">{erros.periodo}</small>}
          </div>

          {/* Data da Solicitação */}
          <div className="form-group">
            <label htmlFor="dataSolicitacao" className="block text-sm font-medium text-gray-700">Data da Solicitação:</label>
            <input
              type="date"
              id="dataSolicitacao"
              value={dataSolicitacao}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              required
            />
            {erros.dataSolicitacao && <small className="text-red-500">{erros.dataSolicitacao}</small>}
          </div>

          {/* Data de Retorno */}
          <div className="form-group">
            <label htmlFor="dataRetorno" className="block text-sm font-medium text-gray-700">Data de Retorno:</label>
            <input
              type="date"
              id="dataRetorno"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {erros.dataRetorno && <small className="text-red-500">{erros.dataRetorno}</small>}
          </div>

          {/* Justificativa */}
          <div className="form-group">
            <label htmlFor="justificativa" className="block text-sm font-medium text-gray-700">Justificativa:</label>
            <textarea
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {erros.justificativa && <small className="text-red-500">{erros.justificativa}</small>}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md focus:outline-none hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600"
            >
              Adicionar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitacaoExames;
