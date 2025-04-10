import React, { useState, useEffect } from "react";
import { getTiposExames, updateSolicitacaoExames } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import moment from "moment";

const ModalEditarSolicitacaoExames = ({
  isOpen,
  onClose,
  solicitacaoExames,
  onUpdate,
}) => {
  const [tExame, setTExame] = useState(
    solicitacaoExames?.tiposExame.idTipoExame || ""
  );
  const [periodo, setPeriodo] = useState(solicitacaoExames?.periodo || "");
  const [matriculaProfissional, setMatriculaProfissional] = useState(
    solicitacaoExames?.Profissional || ""
  );
  const [cpfPaciente, setPacienteCpf] = useState(
    solicitacaoExames?.Paciente || ""
  );
  const [dataSolicitacao, setDataSolicitacao] = useState(
    solicitacaoExames?.dataSolicitacao
      ? moment(solicitacaoExames.dataSolicitacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      )
      : ""
  );
  const [dataRetorno, setDataRetorno] = useState(
    solicitacaoExames?.dataRetorno
      ? moment(solicitacaoExames.dataRetorno, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [justificativa, setJustificativa] = useState(
    solicitacaoExames?.justificativa || ""
  );
  const [status, setStatus] = useState(solicitacaoExames?.status || "Solicitado");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tiposExameSelecionado, setTExameSelecionado] = useState([]);

  const validarCampos = () => {
    const newErros = {};
    if (!tExame) newErros.tipoExame = "Obrigatório";
    if (!periodo) newErros.periodo = "Obrigatório";
    if (!dataRetorno) newErros.dataRetorno = "Obrigatório";
    if (new Date(dataRetorno) < new Date(dataSolicitacao)) {
      newErros.dataRetorno = "Data inválida";
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
      await updateSolicitacaoExames(
        solicitacaoExames.idSolicitacaoExame,
        dadosAtualizados
      );
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
          Editar Solicitação
        </h2>
        {showSuccessAlert && (
          <SuccessAlert
            message="Atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Exame
            </label>
            <select
              value={tExame}
              onChange={(e) => setTExame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            >
              <option value="">Selecione</option>
              {tiposExameSelecionado.map((tipo) => (
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
            <input
              type="text"
              value={matriculaProfissional.nome}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Paciente
            </label>
            <input
              type="text"
              value={cpfPaciente.nome}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Solicitação
            </label>
            <input
              type="date"
              value={dataSolicitacao}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed shadow-sm"
            />
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
              onChange={(e) => setJustificativa(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm resize-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
              required
            >
              <option value="Ativo">Solicitado</option>
              <option value="Inativo">Registrado</option>
            </select>
          </div>
          <button
            type="submit"
            className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 mt-4"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSolicitacaoExames;