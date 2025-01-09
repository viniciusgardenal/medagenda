import React, { useState } from "react";
import "./modalProfissional.css";
import "../util/geral.css";
import { criarProfissional } from "../../config/apiServices";
import ValidadorGenerico from "../util/validadorGenerico";
import { RegrasProfissional } from "./regrasValidacao";
import { aplicarMascaraCRM, aplicarMascaraTelefone } from "../util/mascaras";

const ModalProfissional = ({ isOpen, onClose, onSave }) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [tipoProfissional, setTipoProfissional] = useState("");
  const [crm, setCrm] = useState("");
  const [setor, setSetor] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [sendEmail, setSendEmail] = useState("1"); // Estado para envio de e-mail
  const [erros, setErros] = useState({});

  const handleTipoProfissionalChange = (event) => {
    setTipoProfissional(event.target.value);
    setCrm("");
    setSetor("");
    setDepartamento("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dados = {
      nome,
      telefone,
      email,
      dataNascimento,
      dataAdmissao,
      tipoProfissional,
      sendEmail,
      ...(tipoProfissional === "Medico" && { crm }),
      ...(tipoProfissional === "Atendente" && { setor }),
      ...(tipoProfissional === "Diretor" && { departamento }),
    };

    const errosValidacao = ValidadorGenerico(dados, RegrasProfissional);
    if (errosValidacao) {
      setErros(errosValidacao);
      return;
    }

    try {
      await criarProfissional(dados);
      onSave();
      onClose();

      // Limpando os campos após o salvamento
      setNome("");
      setTelefone("");
      setEmail("");
      setDataNascimento("");
      setDataAdmissao("");
      setTipoProfissional("");
      setCrm("");
      setSetor("");
      setDepartamento("");
      setSendEmail("1");
      setErros({});
    } catch (error) {
      console.error("Erro ao adicionar profissional:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Profissional</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erros.nome && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.nome}
              </span>
            )}
          </div>

          <div>
            <label>Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) =>
                setTelefone(aplicarMascaraTelefone(e.target.value))
              }
            />
            {erros.telefone && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.telefone}
              </span>
            )}
          </div>
          <div>
            <label>Tipo de Profissional:</label>
            <select
              value={tipoProfissional}
              onChange={handleTipoProfissionalChange}
            >
              <option value="">Selecione</option>
              <option value="Atendente">Atendente</option>
              <option value="Diretor">Diretor</option>
              <option value="Medico">Médico</option>
            </select>
            {erros.tipoProfissional && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.tipoProfissional}
              </span>
            )}
          </div>

          {/* <div>
            <label>Role (Permissao):</label>
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">Selecione</option>
              <option value="1">Diretor</option>
              <option value="2">Atendente</option>
              <option value="3">Médico</option>
            </select>
            {erros.roleId && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.roleId}
              </span>
            )}
          </div> */}

          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erros.email && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.email}
              </span>
            )}
          </div>

          <div>
            <label>Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              } // Calcula a data máxima para 18 anos atrás
            />
            {erros.dataNascimento && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.dataNascimento}
              </span>
            )}
          </div>

          <div>
            <label>Data de Admissão:</label>
            <input
              type="date"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
            />
            {erros.dataAdmissao && (
              <span
                className="erro"
                style={{ fontSize: "small", color: "red" }}
              >
                {erros.dataAdmissao}
              </span>
            )}
          </div>

          {tipoProfissional === "Medico" && (
            <div>
              <label>CRM:</label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(aplicarMascaraCRM(e.target.value))}
              />
              {erros.crm && (
                <span
                  className="erro"
                  style={{ fontSize: "small", color: "red" }}
                >
                  {erros.crm}
                </span>
              )}
            </div>
          )}

          {tipoProfissional === "Atendente" && (
            <div>
              <label>Setor:</label>
              <select value={setor} onChange={(e) => setSetor(e.target.value)}>
                <option value="">Selecione o Setor</option>
                <option value="Recepção">Recepção</option>
                <option value="Administração">Administração</option>
              </select>
              {erros.setor && (
                <span
                  className="erro"
                  style={{ fontSize: "small", color: "red" }}
                >
                  {erros.setor}
                </span>
              )}
            </div>
          )}

          {tipoProfissional === "Diretor" && (
            <div>
              <label>Departamento:</label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Selecione o Departamento</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
              </select>
              {erros.departamento && (
                <span
                  className="erro"
                  style={{ fontSize: "small", color: "red" }}
                >
                  {erros.departamento}
                </span>
              )}
            </div>
          )}
          <div className="btn">
            <div>
              <label>
                Enviar E-mail
                <input
                  type="radio"
                  name="sendEmail"
                  value="1"
                  checked={sendEmail === "1"}
                  onChange={(e) => setSendEmail(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Não Enviar E-mail
                <input
                  type="radio"
                  name="sendEmail"
                  value="0"
                  checked={sendEmail === "0"}
                  onChange={(e) => setSendEmail(e.target.value)}
                />
              </label>
            </div>
          </div>
          <button type="submit">Adicionar Profissional</button>
        </form>
      </div>
    </div>
  );
};

export default ModalProfissional;
