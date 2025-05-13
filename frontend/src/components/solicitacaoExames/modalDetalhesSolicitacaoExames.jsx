import React from "react";
import html2canvas from "html2canvas";

const handleDownload = () => {
  const content = document.querySelector(".modal-detalhes");
  if (!content) return;
  const allElements = content.querySelectorAll("*");
  allElements.forEach((el) => {
    if (el.tagName === "BUTTON" || el.classList.contains("modal-close-button")) {
      el.style.display = "none";
    }
  });
  html2canvas(content, {
    scrollX: 0,
    scrollY: -window.scrollY,
    x: 0,
    y: 0,
    scale: 2,
  }).then((canvas) => {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "detalhes_solicitacao.png";
    link.click();
    allElements.forEach((el) => {
      el.style.display = "";
    });
  });
};

const ModalDetalhesSolicitacaoExames = ({ isOpen, onClose, solicitacaoExames }) => {
  if (!isOpen) return null;

  if (!solicitacaoExames) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative modal-detalhes">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-150 modal-close-button"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-gray-600">Nenhuma solicitação selecionada.</p>
        </div>
      </div>
    );
  }

  // Log para depuração
  console.log("solicitacaoExames:", {
    id: solicitacaoExames.idSolicitacaoExame,
    nomeTipoExame: solicitacaoExames.nomeTipoExame,
    tipoExame: solicitacaoExames.tipoExame,
  });

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative modal-detalhes">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-150 modal-close-button"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-blue-600 mb-6">Detalhes da Solicitação</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.idSolicitacaoExame || "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Exame</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.tipoExame?.nome ||
               solicitacaoExames.tipoExame?.nomeTipoExame ||
               solicitacaoExames.nomeTipoExame ||
               "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Médico</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.profissional
                ? `${solicitacaoExames.profissional.nome || "N/A"} ${solicitacaoExames.profissional.crm || ""}`
                : "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Paciente</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.paciente
                ? `${solicitacaoExames.paciente.nome || "N/A"} ${solicitacaoExames.paciente.sobrenome || ""}`
                : "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Período</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.periodo || "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data de Solicitação</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.dataSolicitacao || "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data de Retorno</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.dataRetorno || "N/A"}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="bg-gray-100 p-2 rounded text-sm shadow-sm">
              {solicitacaoExames.status || "N/A"}
            </div>
          </div>
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Justificativa</label>
            <textarea
              value={solicitacaoExames.justificativa || ""}
              readOnly
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm text-gray-600 cursor-not-allowed shadow-sm resize-none"
            />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150 mt-2"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;