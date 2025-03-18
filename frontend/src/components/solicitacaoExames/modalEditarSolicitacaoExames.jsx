import React, { useState, useEffect } from "react";
import {
  getTiposExames,
  updateSolicitacaoExames,
} from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import moment from "moment";

const ModalEditarSolicitacaoExames = ({
  isOpen,
  onClose,
  solicitacaoExames,
  onUpdate,
}) => {
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

  useEffect(() => {
    const fetchTiposExames = async () => {
      try {
        const response = await getTiposExames();
        const tipos = await response.data;
        setTExameSelecionado(tipos); // Atualiza a lista de tipos disponíveis
      } catch (error) {
        console.error("Erro ao buscar tipos de exame:", error);
      }
    };

    fetchTiposExames();
  }, []);

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
    if (!validarCampos()) return; // Não envia se houver erros

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Solicitação de Exame</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showSuccessAlert && (
          <SuccessAlert
            message="Solicitação de Exame atualizada com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Tipo de Exame:</label>
            <select
              value={tExame}
              onChange={(e) => setTExame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione o tipo de exame</option>
              {tiposExameSelecionado.map((tipo) => (
                <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                  {tipo.nomeTipoExame}
                </option>
              ))}
            </select>
            {erros.tipoExame && (
              <p className="text-red-500 text-xs mt-1">{erros.tipoExame}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Período:</label>
            <select
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
            {erros.periodo && (
              <p className="text-red-500 text-xs mt-1">{erros.periodo}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Médico:</label>
            <input
              type="text"
              value={matriculaProfissional.nome}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Paciente:</label>
            <input
              type="text"
              value={cpfPaciente.nome}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Data de Solicitação:</label>
            <input
              type="date"
              value={dataSolicitacao}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Data de Retorno:</label>
            <input
              type="date"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {erros.dataRetorno && (
              <p className="text-red-500 text-xs mt-1">{erros.dataRetorno}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Justificativa:</label>
            <input
              type="text"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {erros.justificativa && (
              <p className="text-red-500 text-xs mt-1">{erros.justificativa}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSolicitacaoExames;
