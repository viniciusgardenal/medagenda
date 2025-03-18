import React from "react";
import "./modalSolicitacaoExamesStyle.css"; // Importando o arquivo CSS
import html2canvas from "html2canvas";

const handleDownload = () => {
  // Selecionando o conteúdo da modal
  const content = document.querySelector(".modal-det");

  // Certificando-se de que não capturamos o botão de fechar ou outros elementos indesejados
  const allElements = content.querySelectorAll("*");
  allElements.forEach((el) => {
    if (
      el.tagName === "BUTTON" ||
      el.classList.contains("modal-close-button")
    ) {
      el.style.display = "none"; // Escondendo o botão de fechar
    }
  });

  // Usando html2canvas para capturar o conteúdo da modal
  html2canvas(content, {
    scrollX: 0, // Não considerar o scroll horizontal
    scrollY: -window.scrollY, // Para garantir que a captura inicie do topo da tela
    x: 0, // Alinhamento horizontal
    y: 0, // Alinhamento vertical
    scale: 2, // Aumentar a resolução para maior qualidade (ajustável conforme necessário)
  }).then((canvas) => {
    // Gerando o link para download da imagem no formato PNG
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "detalhes_solicitacao.png"; // Nome do arquivo para download
    link.click();

    // Após o download, restaura a visibilidade dos elementos ocultados
    allElements.forEach((el) => {
      el.style.display = ""; // Restaura o estilo original
    });
  });
};

const ModalDetalhesSolicitacaoExames = ({
  isOpen,
  onClose,
  solicitacaoExames,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 overflow-auto max-h-screen">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center px-6 py-4 bg-green-50 border-b border-green-100">
          <h2 className="text-lg font-semibold text-green-800">
            Detalhes da Solicitação de Exame
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
        <div className="p-6 overflow-auto" style={{ maxHeight: "70vh" }}>
          {solicitacaoExames ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                    Informações da Solicitação
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        ID da Solicitação:
                      </span>
                      <span className="text-sm text-gray-700">
                        {solicitacaoExames.idSolicitacaoExame}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Tipo de Exame:
                      </span>
                      <span className="text-sm text-gray-700">
                        {solicitacaoExames.tiposExame.nomeTipoExame}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Período:
                      </span>
                      <span className="text-sm text-gray-700">
                        {solicitacaoExames.periodo}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Status:
                      </span>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                        {solicitacaoExames.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                    Datas
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Data de Solicitação:
                      </span>
                      <span className="text-sm text-gray-700">
                        {solicitacaoExames.dataSolicitacao}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-600">
                        Data de Retorno:
                      </span>
                      <span className="text-sm text-gray-700">
                        {solicitacaoExames.dataRetorno}
                      </span>
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
                      <span className="text-sm font-medium text-green-600 block mb-1">
                        Médico:
                      </span>
                      <span className="text-sm text-gray-700 block bg-white p-2 rounded border border-green-100">
                        {solicitacaoExames.Profissional.nome} (CRM:{" "}
                        {solicitacaoExames.Profissional.crm})
                      </span>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-green-600 block mb-1">
                        Paciente:
                      </span>
                      <span className="text-sm text-gray-700 block bg-white p-2 rounded border border-green-100">
                        {solicitacaoExames.Paciente.nome}{" "}
                        {solicitacaoExames.Paciente.sobrenome}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-green-700 font-medium mb-3 border-b border-green-100 pb-2">
                    Justificativa
                  </h3>

                  <div className="space-y-1">
                    <div className="bg-white p-3 rounded border border-green-100 min-h-24">
                      <p className="text-sm text-gray-700">
                        {solicitacaoExames.justificativa}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Download (largura total) */}
              <div className="col-span-1 md:col-span-2 mt-2">
                <button
                  onClick={handleDownload}
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download da Solicitação
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-8 w-8 text-green-500 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-green-600 font-medium">
                  Carregando dados...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;
