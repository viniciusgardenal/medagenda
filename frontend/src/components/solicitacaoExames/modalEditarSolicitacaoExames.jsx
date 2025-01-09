import React, { useState, useEffect } from "react";
import "./modalSolicitacaoExamesStyle.css";
import "../util/geral.css";
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
  const [cpfPaciente, setPacienteCpf] = useState(solicitacaoExames?.Paciente || "");
  const [createdAt, setCreatedAt] = useState(
    solicitacaoExames?.createdAt
      ? moment(solicitacaoExames.createdAt, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [dataRetorno, setDataRetorno] = useState(
    solicitacaoExames?.dataRetorno
      ? moment(solicitacaoExames.dataRetorno, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );

  const [status, setStatus] = useState(solicitacaoExames?.status || "Ativo");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [tiposExameSelecionado, setTExameSelecionado] = useState([]);

  const validarCampos = () => {
    const newErros = {};

    if (!tExame) newErros.tipoExame = "Tipo de exame é obrigatório!";
    if (!periodo) newErros.periodo = "Período é obrigatório!";
    if (!dataRetorno) newErros.dataRetorno = "Data de retorno é obrigatória!";
    if (new Date(dataRetorno) < new Date(createdAt)) {
      newErros.dataRetorno = "A data de retorno não pode ser anterior à data da solicitação!";
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
      createdAt,
      dataRetorno,
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

  useEffect(() => {
    const fetchTiposExames = async () => {
      try {
        const response = await getTiposExames(); // Substitua pela rota real
        const tipos = await response.data;
        setTExameSelecionado(tipos); // Atualiza a lista de tipos disponíveis
      } catch (error) {
        console.error("Erro ao buscar tipos de exame:", error);
      }
    };

    fetchTiposExames();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        {showSuccessAlert && (
          <SuccessAlert
            message="Solicitação de Exame atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <h2>Editar Solicitação de Exame</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Tipo de Exame:</label>
            <select value={tExame} onChange={(e) => setTExame(e.target.value)} required>
              <option value="">Selecione o tipo de exame</option>
              {tiposExameSelecionado.map((tipo) => (
                <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                  {tipo.nomeTipoExame}
                </option>
              ))}
            </select>
            {erros.tipoExame && <small className="erro">{erros.tipoExame}</small>}
          </div>

          <div>
            <label>Período:</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
            >
              <option value="">Selecione o período</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            {erros.periodo && <small className="erro">{erros.periodo}</small>}
          </div>

          <div>
            <label>Médico (Apenas visível):</label>
            <input
              type="text"
              value={matriculaProfissional.nome}
              readOnly
              disabled
            />
          </div>

          <div>
            <label>Paciente (Apenas visível):</label>
            <input
              type="text"
              value={cpfPaciente.nome}
              readOnly
              disabled
            />
          </div>

          <div>
            <label>Solicitação (Apenas visível):</label>
            <input
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)} // Atualiza o estado corretamente
              disabled
            />
          </div>

          <div>
            <label>Retorno:</label>
            <input
              type="date"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)} // Atualiza o estado corretamente
              required
            />
            {erros.dataRetorno && <small style={{color: "red"}} className="erro">{erros.dataRetorno}</small>}
          </div>

          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarSolicitacaoExames;
