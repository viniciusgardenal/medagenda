import React, { useState } from "react";
import "./modalMedicamentosStyle.css"; // Importando o arquivo CSS
import { updateMedicamentos } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import "../util/geral.css";

const ModalEditarMedicamento = ({
  isOpen,
  onClose,
  medicamentos,
  onUpdate,
}) => {
  const [nomeMedicamento, setNomeMedicamento] = useState(
    medicamentos?.nomeMedicamento || ""
  );
  // const [dosagem, setDosagem] = useState(medicamentos?.dosagem || "");
  const [controlado, setControlado] = useState(
    medicamentos?.controlado || false
  );
  const [nomeFabricante, setNomeFabricante] = useState(
    medicamentos?.nomeFabricante || ""
  );
  const [descricao, setDescricao] = useState(medicamentos?.descricao || "");
  const [instrucaoUso, setInstrucaoUso] = useState(
    medicamentos?.instrucaoUso || ""
  );
  const [interacao, setInteracao] = useState(medicamentos?.interacao || "");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validação dos campos
  const validarCampos = () => {
    const newErros = {};

    if (!nomeMedicamento)
      newErros.nomeMedicamento = "O nome do medicamentos é obrigatório!";
    // if (!dosagem) newErros.dosagem = "A dosagem é obrigatória!";
    if (!nomeFabricante)
      newErros.nomeFabricante = "O nome do fabricante é obrigatório!";
    if (!descricao) newErros.descricao = "A descrição é obrigatória!";
    if (!instrucaoUso)
      newErros.instrucaoUso = "A instrução de uso é obrigatória!";
    if (!interacao) newErros.interacao = "As interações são obrigatórias!";

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dadosAtualizados = {
      nomeMedicamento,
      // dosagem,
      controlado,
      nomeFabricante,
      descricao,
      instrucaoUso,
      interacao,
    };

    try {
      // Atualiza o medicamentos com os dados fornecidos
      await updateMedicamentos(medicamentos.idMedicamento, dadosAtualizados);
      setShowSuccessAlert(true); // Mostra o alerta de sucesso

      onUpdate(); // Atualiza a lista após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar medicamentos:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Editar Medicamento</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome do Medicamento:</label>
            <input
              type="text"
              value={nomeMedicamento}
              onChange={(e) => setNomeMedicamento(e.target.value)}
            />
            {erros.nomeMedicamento && (
              <small style={{color:"red" }} className="error">{erros.nomeMedicamento}</small>
            )}
          </div>
          {/* <div>
            <label>Dosagem:</label>
            <input
              type="text"
              value={dosagem}
              onChange={(e) => setDosagem(e.target.value)}
            />
            {erros.dosagem && <small className="error">{erros.dosagem}</small>}
          </div> */}
          <div>
            <label>Controlado:</label>
            <select
              name="controlado"
              value={controlado}
              onChange={(e) => setControlado(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="Medicamento Controlado">
                Medicamento Controlado
              </option>
              <option value="Medicamento Não Controlado">
                Medicamento Não Controlado
              </option>
            </select>
            {erros.controlado && (
              <small style={{color:"red" }} className="error">{erros.controlado}</small>
            )}
          </div>
          <div>
            <label>Nome do Fabricante:</label>
            <input
              type="text"
              value={nomeFabricante}
              onChange={(e) => setNomeFabricante(e.target.value)}
            />
            {erros.nomeFabricante && (
              <small style={{color:"red" }} className="error">{erros.nomeFabricante}</small>
            )}
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {erros.descricao && (
              <small style={{color:"red" }} className="error">{erros.descricao}</small>
            )}
          </div>
          <div>
            <label>Instrução de Uso:</label>
            <textarea
              value={instrucaoUso}
              onChange={(e) => setInstrucaoUso(e.target.value)}
            />
            {erros.instrucaoUso && (
              <small style={{color:"red" }} className="error">{erros.instrucaoUso}</small>
            )}
          </div>
          <div>
            <label>Interações Medicamentosas:</label>
            <textarea
              value={interacao}
              onChange={(e) => setInteracao(e.target.value)}
            />
            {erros.interacao && (
              <small style={{color:"red" }} className="error">{erros.interacao}</small>
            )}
          </div>
          <div>

          </div>
          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
      {showSuccessAlert && (
        <SuccessAlert
          message="Medicamento Atualizado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default ModalEditarMedicamento;
