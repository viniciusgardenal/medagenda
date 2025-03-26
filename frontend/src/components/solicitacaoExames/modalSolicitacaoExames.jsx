import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { criarSolicitacaoExames, getTiposExames, getPacientes } from "../../config/apiServices";
import ReceitaForm from "../receitas/receitaForm";

const ModalSolicitacaoExames = ({ isOpen, onClose, onSave }) => {
  const [idTipoExame, setIdTipoExame] = useState([]);
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [periodo, setPeriodo] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState(new Date().toISOString().split("T")[0]);
  const [dataRetorno, setDataRetorno] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [erros, setErros] = useState({});
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState("");

  useEffect(() => {
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
    setPacienteSelecionado(event.target.value);
  };

  const handleTipoExameChange = (event) => {
    setTipoExameSelecionado(event.target.value);
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
      setTipoExameSelecionado("");
      setPeriodo("");
      setDataRetorno("");
      setJustificativa("");
      setPacienteSelecionado("");
    } catch (error) {
      console.error("Erro ao adicionar solicitação de exame:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-60 transition-opacity duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2">
          <h2 className="text-xl font-bold text-gray-900">Adicionar Solicitação de Exame</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-150"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulário em Grid 2x2 */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloco 1: Informações do Exame */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4 h-64">
            <h3 className="text-lg font-semibold text-gray-800">Informações do Exame</h3>
            {/* Tipo de Exame */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo de Exame
              </label>
              <select
                value={tipoExameSelecionado}
                onChange={handleTipoExameChange}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="">Selecione o tipo</option>
                {Array.isArray(idTipoExame) &&
                  idTipoExame.map((tipo) => (
                    <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                      {tipo.nomeTipoExame}
                    </option>
                  ))}
              </select>
              {erros.tipoExame && (
                <p className="text-red-600 text-xs mt-1">{erros.tipoExame}</p>
              )}
            </div>
            {/* Período */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Período
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="">Selecione o período</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </select>
              {erros.periodo && (
                <p className="text-red-600 text-xs mt-1">{erros.periodo}</p>
              )}
            </div>
          </div>

          {/* Bloco 2: Paciente e Profissional */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4 h-64">
            <h3 className="text-lg font-semibold text-gray-800">Paciente e Profissional</h3>
            {/* Paciente */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Paciente
              </label>
              <select
                value={pacienteSelecionado}
                onChange={handlePacienteChange}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="">Selecione um paciente</option>
                {Array.isArray(cpfPaciente) &&
                  cpfPaciente.map((paciente) => (
                    <option key={paciente.cpf} value={paciente.cpf}>
                      {paciente.nome} {paciente.sobrenome}
                    </option>
                  ))}
              </select>
              {erros.paciente && (
                <p className="text-red-600 text-xs mt-1">{erros.paciente}</p>
              )}
            </div>
            {/* Profissional */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Profissional
              </label>
              <ReceitaForm onMatriculaChange={setMatriculaProfissional} />
            </div>
          </div>

          {/* Bloco 3: Datas */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4 h-64">
            <h3 className="text-lg font-semibold text-gray-800">Datas</h3>
            {/* Data da Solicitação */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data da Solicitação
              </label>
              <input
                type="date"
                value={dataSolicitacao}
                readOnly
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm"
              />
              {erros.dataSolicitacao && (
                <p className="text-red-600 text-xs mt-1">{erros.dataSolicitacao}</p>
              )}
            </div>
            {/* Data de Retorno */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data de Retorno
              </label>
              <input
                type="date"
                value={dataRetorno}
                onChange={(e) => setDataRetorno(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              />
              {erros.dataRetorno && (
                <p className="text-red-600 text-xs mt-1">{erros.dataRetorno}</p>
              )}
            </div>
          </div>

          {/* Bloco 4: Justificativa */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4 h-64">
            <h3 className="text-lg font-semibold text-gray-800">Justificativa</h3>
            <div className="flex-1">
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-full text-gray-700 placeholder-gray-400 shadow-sm resize-none"
              />
              {erros.justificativa && (
                <p className="text-red-600 text-xs mt-1">{erros.justificativa}</p>
              )}
            </div>
          </div>

          {/* Botão */}
          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150 flex items-center font-medium shadow-sm"
            >
              <Save className="mr-2" size={18} />
              Adicionar Solicitação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitacaoExames;