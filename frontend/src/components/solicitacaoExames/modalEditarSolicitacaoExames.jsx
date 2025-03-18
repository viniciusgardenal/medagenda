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
      newErros.dataRetorno =
        "A data de retorno não pode ser anterior à data da solicitação!";
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-auto max-h-screen">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-4 bg-green-50 border-b border-green-100">
          <h2 className="text-lg font-semibold text-green-800">
            Editar Solicitação de Exame
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

        {showSuccessAlert && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Solicitação de Exame atualizada com sucesso!
                </p>
              </div>
              <button
                onClick={() => setShowSuccessAlert(false)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                  Informações Básicas
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Tipo de Exame:
                    </label>
                    <select
                      value={tExame}
                      onChange={(e) => setTExame(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      <p className="text-red-500 text-xs mt-1">
                        {erros.tipoExame}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Período:
                    </label>
                    <select
                      value={periodo}
                      onChange={(e) => setPeriodo(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Selecione o período</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                    {erros.periodo && (
                      <p className="text-red-500 text-xs mt-1">
                        {erros.periodo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Status:
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                  Datas
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Data de Solicitação:
                    </label>
                    <input
                      type="date"
                      value={dataSolicitacao}
                      className="w-full px-3 py-2 bg-white border border-green-100 rounded-md text-gray-700"
                      readOnly
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Data de Retorno:
                    </label>
                    <input
                      type="date"
                      value={dataRetorno}
                      onChange={(e) => setDataRetorno(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    {erros.dataRetorno && (
                      <p className="text-red-500 text-xs mt-1">
                        {erros.dataRetorno}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                  Pessoas Envolvidas
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Médico:
                    </label>
                    <input
                      type="text"
                      value={matriculaProfissional.nome}
                      className="w-full px-3 py-2 bg-white border border-green-100 rounded-md text-gray-700"
                      readOnly
                      disabled
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-green-600 block mb-1">
                      Paciente:
                    </label>
                    <input
                      type="text"
                      value={cpfPaciente.nome}
                      className="w-full px-3 py-2 bg-white border border-green-100 rounded-md text-gray-700"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                  Justificativa
                </h3>

                <div>
                  <textarea
                    value={justificativa}
                    onChange={(e) => setJustificativa(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 min-h-24"
                    required
                  ></textarea>
                  {erros.justificativa && (
                    <p className="text-red-500 text-xs mt-1">
                      {erros.justificativa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Salvar (largura total) */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSolicitacaoExames;
