import React, { useState } from "react";
import { RegrasMedicamento } from "./regrasValidacao";
import "./modalMedicamentosStyle.css";
import "../util/geral.css";
import { criarMedicamentos } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";

const ModalAdicionarMedicamento = ({ isOpen, onClose, onSave }) => {
  const [nomeMedicamento, setNomeMedicamento] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [controlado, setControlado] = useState("");
  const [nomeFabricante, setNomeFabricante] = useState("");
  const [descricao, setDescricao] = useState("");
  const [instrucaoUso, setInstrucaoUso] = useState("");
  const [interacao, setInteracao] = useState("");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validação dos campos
  const validarCampos = () => {
    const newErros = {};

    // Valida cada campo usando as regras definidas em RegrasMedicamento
    Object.keys(RegrasMedicamento).forEach((campo) => {
      RegrasMedicamento[campo].forEach((regra) => {
        const valorCampo = eval(campo);
        if (!regra.regra(valorCampo)) {
          newErros[campo] = regra.mensagem;
        }
      });
    });

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const novoMedicamento = {
      nomeMedicamento,
      // dosagem,
      controlado,
      nomeFabricante,
      descricao,
      instrucaoUso,
      interacao,
    };

    try {
      setIsLoading(true);
      await criarMedicamentos(novoMedicamento);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      onSave();
      onClose();

      setNomeMedicamento("");
      // setDosagem("");
      setControlado("");
      setNomeFabricante("");
      setDescricao("");
      setInstrucaoUso("");
      setInteracao("");
      setErros({});
    } catch (error) {
      console.error("Erro ao adicionar medicamento:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Medicamento</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome do Medicamento:</label>
            <input
              type="text"
              value={nomeMedicamento}
              onChange={(e) => setNomeMedicamento(e.target.value)}
            />
            {erros.nomeMedicamento && (
              <small style={{ color: "red" }} className="error">
                {erros.nomeMedicamento}
              </small>
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
              <small style={{ color: "red" }} className="error">
                {erros.controlado}
              </small>
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
              <small style={{ color: "red" }} className="error">
                {erros.nomeFabricante}
              </small>
            )}
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {erros.descricao && (
              <small style={{ color: "red" }} className="error">
                {erros.descricao}
              </small>
            )}
          </div>
          <div>
            <label>Instrução de Uso:</label>
            <textarea
              value={instrucaoUso}
              onChange={(e) => setInstrucaoUso(e.target.value)}
            />
            {erros.instrucaoUso && (
              <small style={{ color: "red" }} className="error">
                {erros.instrucaoUso}
              </small>
            )}
          </div>
          <div>
            <label>Interações Medicamentosas:</label>
            <textarea
              value={interacao}
              onChange={(e) => setInteracao(e.target.value)}
            />
            {erros.interacao && (
              <small style={{ color: "red" }} className="error">
                {erros.interacao}
              </small>
            )}
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Medicamento"}
          </button>
        </form>
        {showSuccessAlert && (
          <SuccessAlert
            message="Medicamento criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ModalAdicionarMedicamento;
