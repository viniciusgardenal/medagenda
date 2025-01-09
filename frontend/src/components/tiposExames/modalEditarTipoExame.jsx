import React, { useState, useEffect } from "react";
import "./modalProfissional.css";
import "../util/geral.css";
import { updateTipoExame } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";

const ModalEditarProfissional = ({ isOpen, onClose, tipoExame, onUpdate }) => {
  const [nomeTipoExame, setNomeTipoExame] = useState(
    tipoExame?.nomeTipoExame || ""
  );
  const [categoria, setCategoria] = useState(tipoExame?.categoria || "");
  const [codigo, setCodigo] = useState(tipoExame?.codigo || "");
  const [materialColetado, setMaterialColetado] = useState(
    tipoExame?.materialColetado || ""
  );
  const [tempoJejum, setTempoJejum] = useState(tipoExame?.tempoJejum || "");
  const [observacao, setObservacao] = useState(tipoExame?.observacao || "");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // //console.log(`Tipo Exame ${nomeTipoExame} ${categoria}`);

  // Validação dos dados
  const validarCampos = () => {
    const newErros = {};

    if (!nomeTipoExame) newErros.nomeTipoExame = "Nome do Exame é obrigatório!";
    if (!categoria) newErros.categoria = "Categoria é obrigatória!";

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dadosAtualizados = {
      nomeTipoExame,
      categoria,
      materialColetado, // Adicionar campo material coletado
      tempoJejum, // Adicionar campo tempo em jejum
      observacao, // Adicionar campo observação
    };

    try {
      await updateTipoExame(tipoExame.idTipoExame, dadosAtualizados);
      {
        showSuccessAlert && (
          <SuccessAlert
            message="Exame Atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        );
      }
      onUpdate(); // Atualiza a lista após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar exame:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Editar Tipos de Exames</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
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

          {/* Novo campo: Tempo em Jejum */}
          <div>
            <label>Tempo em Jejum:</label>
            <input
              type="text"
              value={tempoJejum}
              onChange={(e) => setTempoJejum(e.target.value)}
            />
            {erros.tempoJejum && (
              <span className="error">{erros.tempoJejum}</span>
            )}
          </div>

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
              <span className="error">{erros.categoria}</span>
            )}
          </div>

          {/* Novo campo: Observação */}
          <div>
            <label>Observação:</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            {erros.observacao && (
              <span className="error">{erros.observacao}</span>
            )}
          </div>


            <button type="submit">Salvar Alterações</button>
    

          
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProfissional;
