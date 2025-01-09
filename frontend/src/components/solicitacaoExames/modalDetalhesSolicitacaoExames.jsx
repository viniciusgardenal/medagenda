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
  //console.log(solicitacaoExames);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Detalhes da Solicitação de Exame</h2>
        {solicitacaoExames ? (
          <div className="modal-det">
            <p>
              <strong>ID da Solicitação:</strong>{" "}
              {solicitacaoExames.idSolicitacaoExame}{" "}
            </p>

            <p>
              <strong>Tipo de Exame:</strong>{" "}
              {solicitacaoExames.tiposExame.nomeTipoExame}{" "}
            </p>

            <p>
              <strong>Médico:</strong> {solicitacaoExames.Profissional.nome}{" "}
              {solicitacaoExames.Profissional.crm}{" "}
            </p>
            <p>
              <strong>Paciente:</strong> {solicitacaoExames.Paciente.nome}{" "}
              {solicitacaoExames.Paciente.sobrenome}
            </p>
            <p>
              <strong>Período:</strong> {solicitacaoExames.periodo}{" "}
            </p>
            <p>
              <strong>Data de Solicitação:</strong>{" "}
              {solicitacaoExames.createdAt}{" "}
            </p>

            <p>
              <strong>Data de Retorno:</strong> {solicitacaoExames.dataRetorno}{" "}
            </p>
            <p>
              <strong>Status:</strong> {solicitacaoExames.status}{" "}
            </p>

            <button type="submit" onClick={handleDownload}>
              Download da Solicitação
            </button>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;
