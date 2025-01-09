import React, { useState } from "react";
import { RegrasPaciente } from "./regrasValidacao";
import "./modalPacientesStyle.css";
import "../util/geral.css";
import { criarPacientes, getPacientesId } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import { aplicarMascaraCPF, aplicarMascaraTelefone } from "../util/mascaras";

const ModalAdicionarPaciente = ({ isOpen, onClose, onSave, pacientes }) => {
  const [cpf, setCPF] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validação dos campos
  const validarCampos = () => {
    const newErros = {};

    // Valida cada campo usando as regras definidas em RegrasMedicamento
    Object.keys(RegrasPaciente).forEach((campo) => {
      RegrasPaciente[campo].forEach((regra) => {
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

    const novoPaciente = {
      cpf,
      nome,
      sobrenome,
      sexo,
      dataNascimento,
      email,
      endereco,
      telefone,
    };

    try {
      const response = await getPacientesId(cpf);

      if (!response) {
        await criarPacientes(novoPaciente);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);

        onSave();
        onClose();

        setCPF("");
        setNome("");
        setSobrenome("");
        setSexo("");
        setDataNascimento("");
        setEmail("");
        setEndereco("");
        setTelefone("");
        setErros({});
      } else {
        alert("CPF já cadastrado!");
      }
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
      alert("Erro ao cadastrar paciente. Tente novamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Paciente</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erros.nome && (
              <small style={{ color: "red" }} className="error">
                {erros.nome}
              </small>
            )}
          </div>

          <div>
            <label htmlFor="sobrenome">Sobrenome</label>
            <input
              type="text"
              id="sobrenome"
              name="sobrenome"
              placeholder="Sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
            {erros.sobrenome && (
              <small style={{ color: "red" }} className="error">
                {erros.sobrenome}
              </small>
            )}
          </div>

          <div>
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              maxLength="14"
              placeholder="123.456.789-01"
              value={cpf}
              onChange={(e) => setCPF(aplicarMascaraCPF(e.target.value))}
            />
            {erros.cpf && (
              <small style={{ color: "red" }} className="error">
                {erros.cpf}
              </small>
            )}
          </div>

          <div>
            <label>Sexo:</label>
            <select
              name="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            {erros.sexo && (
              <small style={{ color: "red" }} className="error">
                {erros.sexo}
              </small>
            )}
          </div>
          <div>
            <label>Data de Nascimento</label>
            <input
              type="date"
              name="dataNascimento"
              placeholder="Data de Nascimento"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
            {erros.dataNascimento && (
              <small style={{ color: "red" }} className="error">
                {erros.dataNascimento}
              </small>
            )}
          </div>

          <div>
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="exemplo@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erros.email && (
              <small style={{ color: "red" }} className="error">
                {erros.email}
              </small>
            )}
          </div>

          <div>
            <label>Endereço</label>
            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            {erros.endereco && (
              <small style={{ color: "red" }} className="error">
                {erros.endereco}
              </small>
            )}
          </div>

          <div>
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              maxLength={15}
              placeholder="(00) 12345-6789"
              value={telefone}
              onChange={(e) =>
                setTelefone(aplicarMascaraTelefone(e.target.value))
              }
            />
            {erros.telefone && (
              <small style={{ color: "red" }} className="error">
                {erros.telefone}
              </small>
            )}
          </div>
          <button type="submit">Adicionar Paciente</button>
        </form>
        {showSuccessAlert && (
          <SuccessAlert
            message="Paciente criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ModalAdicionarPaciente;
