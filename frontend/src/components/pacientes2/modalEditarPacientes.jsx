import React, { useState } from "react";
import "./modalPacientesStyle.css"; 
import "../util/geral.css";// Importando o arquivo CSS
import { updatePacientes } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import moment from "moment";
import { aplicarMascaraTelefone } from "../util/mascaras";

const ModalEditarPaciente = ({ isOpen, onClose, pacientes, onUpdate }) => {
  const [nome, setNome] = useState(pacientes?.nome || "");
  const [sobrenome, setSobrenome] = useState(pacientes?.sobrenome || "");
  const [sexo, setSexo] = useState(pacientes?.sexo || "");

  const [dataNascimento, setDataNascimento] = useState(
    pacientes?.dataNascimento
      ? moment(pacientes.dataNascimento, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [email, setEmail] = useState(pacientes?.email || "");
  const [endereco, setEndereco] = useState(pacientes?.endereco || "");
  const [telefone, setTelefone] = useState(pacientes?.telefone || "");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // 'cpf' é apenas exibido, não precisa de 'setCpf'
  const cpf = pacientes?.cpf || "";

  // Validação dos campos
  const validarCampos = () => {
    const newErros = {};

    if (!nome) newErros.nome = "O nome é obrigatório!";
    if (!sobrenome) newErros.sobrenome = "O sobrenome é obrigatório!";
    if (!sexo) newErros.sexo = "O sexo é obrigatório!";
    if (!dataNascimento)
      newErros.dataNascimento = "A data de nascimento é obrigatória!";
    if (!email) newErros.email = "O e-mail é obrigatório!";
    if (!endereco) newErros.endereco = "O endereço é obrigatório!";
    if (!telefone) newErros.telefone = "O telefone é obrigatório!";

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dadosAtualizados = {
      nome,
      sobrenome,
      sexo,
      dataNascimento,
      email,
      endereco,
      telefone,
    };

    try {
      // Atualiza o paciente com os dados fornecidos
      await updatePacientes(pacientes.cpf, dadosAtualizados);
      setShowSuccessAlert(true); // Mostra o alerta de sucesso

      onUpdate(); // Atualiza a lista após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Editar Paciente</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erros.nome && <small style={{color:"red" }} className="error">{erros.nome}</small>}
          </div>
          <div>
            <label>Sobrenome:</label>
            <input
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
            {erros.sobrenome && (
              <small style={{color:"red" }} className="error">{erros.sobrenome}</small>
            )}
          </div>
          <div>
            <label>CPF (Apenas visível):</label>
            <input
              type="text"
              value={cpf}
              readonly="readonly"
              disabled='disabled'
            />
          </div>
          <div>
            <label>Sexo:</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            {erros.sexo && <small style={{color:"red" }} className="error">{erros.sexo}</small>}
          </div>
          <div>
            <label>Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
            {erros.dataNascimento && (
              <small style={{color:"red" }} className="error">{erros.dataNascimento}</small>
            )}
          </div>
          <div>
            <label>E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erros.email && <small style={{color:"red" }} className="error">{erros.email}</small>}
          </div>
          <div>
            <label>Endereço:</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            {erros.endereco && (
              <small style={{color:"red" }} className="error">{erros.endereco}</small>
            )}
          </div>
          <div>
            <label>Telefone:</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) =>
                setTelefone(aplicarMascaraTelefone(e.target.value))
              }
            />
            {erros.telefone && (
              <small style={{color:"red" }} className="error">{erros.telefone}</small>
            )}
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>

      {showSuccessAlert && (
        <SuccessAlert
          message="Paciente Atualizado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default ModalEditarPaciente;
