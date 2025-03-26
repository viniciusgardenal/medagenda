import React from "react";
import { X, Download } from "lucide-react";
import html2canvas from "html2canvas";

const handleDownload = () => {
  const content = document.querySelector(".detalhes");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm  bg-opacity-60 transition-opacity duration-300">
      <div className="bg-white w-full max-w-[80vh] max-h-[80vh] overflow-y-auto rounded-2xl shadow-lg
p-6 transform transition-all duration-300 scale-100">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6  top-0 bg-white z-10 pt-2 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes da Solicitação de Exame</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-150 modal-close-button"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo em Lista */}
        {solicitacaoExames ? (
          <div className="detalhes space-y-4">
            {/* Linha de Informações */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Informações Gerais</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">ID da Solicitação:</span>
                  <span>{solicitacaoExames.idSolicitacaoExame}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Tipo de Exame:</span>
                  <span>{solicitacaoExames.tiposExame.nomeTipoExame}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Período:</span>
                  <span>{solicitacaoExames.periodo}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`${
                      solicitacaoExames.status === "Ativo" ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {solicitacaoExames.status}
                  </span>
                </li>
              </ul>
            </div>

            {/* Linha de Pessoas */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Envolvidos</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Paciente:</span>
                  <span>
                    {solicitacaoExames.Paciente.nome} {solicitacaoExames.Paciente.sobrenome}
                  </span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Médico:</span>
                  <span>
                    {solicitacaoExames.Profissional.nome} ({solicitacaoExames.Profissional.crm})
                  </span>
                </li>
              </ul>
            </div>

            {/* Linha de Datas */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Datas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Data da Solicitação:</span>
                  <span>{solicitacaoExames.dataSolicitacao}</span>
                </li>
                <li className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Data de Retorno:</span>
                  <span>{solicitacaoExames.dataRetorno}</span>
                </li>
              </ul>
            </div>

            {/* Linha de Justificativa */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Justificativa</h3>
              <p className="text-sm text-gray-700 break-words">{solicitacaoExames.justificativa}</p>
            </div>

            {/* Botão Download */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150 flex items-center font-medium shadow-sm"
              >
                <Download className="mr-2" size={18} />
                Baixar Solicitação
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Carregando...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;