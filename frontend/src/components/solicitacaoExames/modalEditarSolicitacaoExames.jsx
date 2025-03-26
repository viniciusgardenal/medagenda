import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { getTiposExames, updateSolicitacaoExames } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import moment from "moment";

const ModalEditarSolicitacaoExames = ({ isOpen, onClose, solicitacaoExames, onUpdate }) => {
  const [tExame, setTExame] = useState(solicitacaoExames?.tiposExame.idTipoExame || "");
  const [periodo, setPeriodo] = useState(solicitacaoExames?.periodo || "");
  const [matriculaProfissional, setMatriculaProfissional] = useState(solicitacaoExames?.Profissional || "");
  const [cpfPaciente, setPacienteCpf] = useState(solicitacaoExames?.Paciente || "");
  const [dataSolicitacao, setDataSolicitacao] = useState(
    solicitacaoExames?.dataSolicitacao
      ? moment(solicitacaoExames.dataSolicitacao, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [dataRetorno, setDataRetorno] = useState(
    solicitacaoExames?.dataRetorno
      ? moment(solicitacaoExames.dataRetorno, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [justificativa, setJustificativa] = useState(solicitacaoExames?.justificativa || "");
  const [status, setStatus] = useState(solicitacaoExames?.status || "Ativo");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tiposExameSelecionado, setTExameSelecionado] = useState([]);

  const validarCampos = () => {
    const newErros = {};
    if (!tExame) newErros.tipoExame = "Tipo de exame é obrigatório!";
    if (!periodo) newErros.periodo = "Período é obrigatório!";
    if (!dataRetorno) newErros.dataRetorno = "Data de retorno é obrigatória!";
    if (new Date(dataRetorno) < new Date(dataSolicitacao)) {
      newErros.dataRetorno = "A data de retorno não pode ser anterior à data da solicitação!";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      idTipoExame: tExame,
      periodo,
      matriculaProfissional: matriculaProfissional.matricula,
      cpfPaciente: cpfPaciente.cpf,
      dataSolicitacao,
      dataRetorno,
      justificativa,
      status,
    };

    try {
      await updateSolicitacaoExames(solicitacaoExames.idSolicitacaoExame, dadosAtualizados);
      setShowSuccessAlert(true);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar a solicitação de exame:", error);
    }
  };

  useEffect(() => {
    const fetchTiposExames = async () => {
      try {
        const response = await getTiposExames();
        setTExameSelecionado(response.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de exame:", error);
      }
    };
    fetchTiposExames();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-60 transition-opacity duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2">
          <h2 className="text-xl font-bold text-gray-900">Editar Solicitação de Exame</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-150"
          >
            <X size={24} />
          </button>
        </div>

        {/* Alerta de Sucesso */}
        {showSuccessAlert && (
          <SuccessAlert
            message="Solicitação de Exame atualizada com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}

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
                value={tExame}
                onChange={(e) => setTExame(e.target.value)}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="">Selecione o tipo</option>
                {tiposExameSelecionado.map((tipo) => (
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
              <input
                type="text"
                value={cpfPaciente.nome}
                readOnly
                disabled
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm"
              />
            </div>
            {/* Médico */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Médico
              </label>
              <input
                type="text"
                value={matriculaProfissional.nome}
                readOnly
                disabled
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm"
              />
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
                disabled
                className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm"
              />
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

          {/* Bloco 4: Justificativa e Status */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col space-y-4 h-64">
            <h3 className="text-lg font-semibold text-gray-800">Justificativa e Status</h3>
            {/* Justificativa */}
            <div className="flex-1">
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-full text-gray-700 placeholder-gray-400 shadow-sm resize-none"
              />
            </div>
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {/* Botão */}
          <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150 flex items-center font-medium shadow-sm"
            >
              <Save className="mr-2" size={18} />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSolicitacaoExames;