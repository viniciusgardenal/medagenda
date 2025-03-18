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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-auto max-h-screen">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Detalhes da Solicitação de Exame</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-auto " style={{ maxHeight: "60vh" }}>
          {solicitacaoExames ? (
            <div className="modal-det ">
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>ID da Solicitação:</strong> {solicitacaoExames.idSolicitacaoExame}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Tipo de Exame:</strong> {solicitacaoExames.tiposExame.nomeTipoExame}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Médico:</strong> {solicitacaoExames.Profissional.nome} {solicitacaoExames.Profissional.crm}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Paciente:</strong> {solicitacaoExames.Paciente.nome} {solicitacaoExames.Paciente.sobrenome}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Período:</strong> {solicitacaoExames.periodo}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Data de Solicitação:</strong> {solicitacaoExames.dataSolicitacao}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Data de Retorno:</strong> {solicitacaoExames.dataRetorno}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Justificativa:</strong> {solicitacaoExames.justificativa}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-700"><strong>Status:</strong> {solicitacaoExames.status}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Download da Solicitação
                </button>
              </div>
            </div>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;
