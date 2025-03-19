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
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-auto max-h-screen">
    {/* Cabeçalho */}
    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-green-100">
      <h2 className="text-lg font-semibold text-green-800">
        Adicionar Solicitação de Exame
      </h2>
      <button
        onClick={onClose}
        className="text-green-500 hover:text-green-700 focus:outline-none"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    {/* Conteúdo */}
    <div className="p-6 overflow-auto" style={{ maxHeight: "80vh" }}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
                    {/* Quadrante 3: Pessoas Envolvidas */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-green-100 h-min">
            <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
              Pessoas Envolvidas
            </h3>

            <div className="space-y-3">
              {/* Matricula Profissional */}
              <div className="form-group">
                <label className="text-sm font-medium text-green-600 block mb-1">
                  Médico:
                </label>
                <div className="bg-white p-2 rounded border border-green-100">
                  <ReceitaForm onMatriculaChange={setMatriculaProfissional} />
                </div>
              </div>

              {/* Paciente */}
              <div className="form-group">
                <label htmlFor="paciente" className="text-sm font-medium text-green-600 block mb-1">
                  Paciente:
                </label>
                <select
                  id="paciente"
                  value={pacienteSelecionado}
                  onChange={handlePacienteChange}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
            </div>
          </div>
          {/* Quadrante 1: Informações Básicas */}
          <div className="bg-gray-50 p-4 rounded-lg border border-green-100 h-full">
            <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
              Informações Básicas
            </h3>

            <div className="space-y-3">
              {/* Tipo de Exame */}
              <div className="form-group">
                <label htmlFor="tipoExame" className="text-sm font-medium text-green-600 block mb-1">
                  Tipo de Exame:
                </label>
                <select
                  id="tipoExame"
                  value={tipoExameSelecionado}
                  onChange={handleTipoExameChange}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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

              {/* Período */}
              <div className="form-group">
                <label htmlFor="periodo" className="text-sm font-medium text-green-600 block mb-1">
                  Período:
                </label>
                <select
                  id="periodo"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  required
                >
                  <option value="">Selecione o período</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
                {erros.periodo && <small className="text-red-500">{erros.periodo}</small>}
              </div>
            </div>
          </div>
          

          {/* Quadrante 2: Datas */}
          <div className="bg-gray-50 p-4 rounded-lg border border-green-100 h-full">
            <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
              Datas
            </h3>

            <div className="space-y-3">
              {/* Data da Solicitação */}
              <div className="form-group">
                <label htmlFor="dataSolicitacao" className="text-sm font-medium text-green-600 block mb-1">
                  Data da Solicitação:
                </label>
                <input
                  type="date"
                  id="dataSolicitacao"
                  value={dataSolicitacao}
                  readOnly
                  className="w-full px-3 py-2 border border-green-200 rounded-md bg-gray-100 cursor-not-allowed"
                  required
                />
                {erros.dataSolicitacao && <small className="text-red-500">{erros.dataSolicitacao}</small>}
              </div>

              {/* Data de Retorno */}
              <div className="form-group">
                <label htmlFor="dataRetorno" className="text-sm font-medium text-green-600 block mb-1">
                  Data de Retorno:
                </label>
                <input
                  type="date"
                  id="dataRetorno"
                  value={dataRetorno}
                  onChange={(e) => setDataRetorno(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  required
                />
                {erros.dataRetorno && <small className="text-red-500">{erros.dataRetorno}</small>}
              </div>
            </div>
          </div>

          {/* Quadrante 4: Justificativa */}
          <div className="bg-gray-50 p-4 rounded-lg border border-green-100 h-min ">
            <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2 ">
              Justificativa
            </h3>

            <div className="space-y-1 ">
              <div className="form-group">
                <textarea
                  id="justificativa"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white resize-none"
                  placeholder="Informe a justificativa para o exame"
                  rows="6"
                  required
                />
                {erros.justificativa && <small className="text-red-500">{erros.justificativa}</small>}
              </div>
            </div>
          </div>
        </div>

        {/* Botões (largura total) */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-green-300 text-green-700 rounded-md focus:outline-none hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Adicionar Solicitação
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
};

export default ModalSolicitacaoExames;
