import React, { useState, useEffect } from "react";
import "./modalTiposExames.css";
import "../util/geral.css";
import { criarTipoExame } from "../../config/apiServices";
import ValidadorGenerico from "../util/validadorGenerico";
import { RegrasTipoExame } from "./regrasValidacao";

const ModalExame = ({ isOpen, onClose, onSave }) => {
  const [nomeTipoExame, setNomeTipoExame] = useState("");
  const [categoria, setCategoria] = useState("");
  const [materialColetado, setMaterialColetado] = useState("");
  const [tempoJejum, setTempoJejum] = useState("");
  const [observacao, setObservacao] = useState("");
  const [erros, setErros] = useState({});


  const handleSubmit = async (event) => {
    event.preventDefault();
    const dados = {
      nomeTipoExame,
      categoria,
      materialColetado,
      tempoJejum,
      observacao,
    };

    const errosValidacao = ValidadorGenerico(dados, RegrasTipoExame);

    if (errosValidacao) {
      setErros(errosValidacao);
      return;
    }

    try {
      await criarTipoExame(dados);
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar tipo de exame:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Tipos de Exames</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          {/* Nome do Tipo de Exame */}
          <div>
            <label>Nome do Tipo de Exame:</label>
            <input
              type="text"
              placeholder="Ex: Hemograma Completo"
              value={nomeTipoExame}
              onChange={(e) => setNomeTipoExame(e.target.value)}
            />
            {erros.nomeTipoExame && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.nomeTipoExame}
              </span>
            )}
          </div>

          {/* Material Coletado */}
          <div>
            <label>Material Coletado:</label>
            <input
              type="text"
              placeholder="Ex: Sangue, Urina"
              value={materialColetado}
              onChange={(e) => setMaterialColetado(e.target.value)}
            />
            {erros.materialColetado && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.materialColetado}
              </span>
            )}
          </div>

          {/* Tempo em Jejum */}
          <div>
            <label>Tempo em Jejum (Horas):</label>
            <input
              type="number"
              placeholder="Ex: 8"
              value={tempoJejum}
              onChange={(e) => setTempoJejum(e.target.value)}
            />
            {erros.tempoJejum && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.tempoJejum}
              </span>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label>Categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Selecione a Categoria</option>
              <option value="Laboratorial">Laboratorial</option>
              <option value="Imagem">Imagem</option>
            </select>
            {erros.categoria && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.categoria}
              </span>
            )}
          </div>

          {/* Observação */}
          <div>
            <label>Observação:</label>
            <textarea
              placeholder="Insira informações adicionais, se necessário"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            {erros.observacao && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.observacao}
              </span>
            )}
          </div>

            <button type="submit">Adicionar Exame</button>
          
        </form>
      </div>
    </div>
  );
};

export default ModalExame;
