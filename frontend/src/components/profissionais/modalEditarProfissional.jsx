import React, { useState } from "react";
import "./modalProfissional.css";
import "../util/geral.css";
import { updateProfissional } from "../../config/apiServices";
import { aplicarMascaraCRM, aplicarMascaraTelefone } from "../util/mascaras";
import moment from "moment";
import SuccessAlert from "../util/successAlert";

const ModalEditarProfissional = ({
  isOpen,
  onClose,
  profissional,
  onUpdate,
}) => {
  // //console.log(
  //   `Dt nascimento ${profissional.dataNascimento}, Dt Admissão ${profissional.dataAdmissao}`
  // );

  const [nome, setNome] = useState(profissional?.nome || "");
  const [telefone, setTelefone] = useState(
    aplicarMascaraTelefone(profissional?.telefone || "")
  );
  const [email, setEmail] = useState(profissional?.email || "");
  const [password, setPassword] = useState("");
  //console.log(profissional.dataNascimento);

  const [dataNascimento, setDataNascimento] = useState(
    profissional?.dataNascimento
      ? moment(profissional.dataNascimento, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [dataAdmissao, setDataAdmissao] = useState(
    profissional?.dataAdmissao
      ? moment(profissional.dataAdmissao, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [tipoProfissional, setTipoProfissional] = useState(
    profissional?.tipoProfissional || ""
  );
  const [crm, setCrm] = useState(profissional?.crm || "");
  const [setor, setSetor] = useState(profissional?.setor || "");
  const [departamento, setDepartamento] = useState(
    profissional?.departamento || ""
  );
  const [erros, setErros] = useState({});

  // Função para formatar a data no formato "YYYY-MM-DD"
  const formatDate = (date) => {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  };

  // //console.log(
  //   `Tipo de dataNascimento: ${typeof dataNascimento}, Valor: ${dataNascimento}`
  // );
  // //console.log(
  //   `Tipo de dataAdmissao: ${typeof dataAdmissao}, Valor: ${dataAdmissao}`
  // );

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validação dos dados
  const validarCampos = () => {
    const newErros = {};
    const telefoneSemMascara = telefone.replace(/\D/g, "");

    if (!telefoneSemMascara || telefoneSemMascara.length < 10) {
      newErros.telefone = "Telefone inválido!";
    }

    if (!nome) newErros.nome = "Nome é obrigatório!";
    if (!email) newErros.email = "Email é obrigatório!";
    if (!dataNascimento)
      newErros.dataNascimento = "Data de Nascimento é obrigatória!";
    if (!dataAdmissao)
      newErros.dataAdmissao = "Data de Admissão é obrigatória!";
    if (!tipoProfissional)
      newErros.tipoProfissional = "Tipo de Profissional é obrigatório!";

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleTipoProfissionalChange = (event) => {
    setTipoProfissional(event.target.value);
    setCrm("");
    setSetor("");
    setDepartamento("");
  };

  const handleTelefoneChange = (event) => {
    const valorFormatado = aplicarMascaraTelefone(event.target.value);
    setTelefone(valorFormatado);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dadosAtualizados = {
      nome,
      telefone,
      email,
      password,
      dataNascimento,
      dataAdmissao,
      tipoProfissional,
      ...(tipoProfissional === "Medico" && { crm }),
      ...(tipoProfissional === "Atendente" && { setor }),
      ...(tipoProfissional === "Diretor" && { departamento }),
    };

    try {
      await updateProfissional(profissional.matricula, dadosAtualizados);
      {
        showSuccessAlert && (
          <SuccessAlert
            message="Profissional Atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        );
      }
      onUpdate(); // Atualiza a lista após a edição
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar profissional:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Editar Profissional</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            {erros.nome && <span className="erro">{erros.nome}</span>}
          </div>

          <div>
            <label>Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={handleTelefoneChange}
              required
            />
            {erros.telefone && <span className="erro">{erros.telefone}</span>}
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {erros.email && <span className="erro">{erros.email}</span>}
          </div>

          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              placeholder="Digite para trocar senha"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {erros.email && <span className="erro">{erros.email}</span>}
          </div>

          <div>
            <label>Data de Nascimento:</label>
            <input
              type="date"
              value={formatDate(dataNascimento)} // Use `dataNascimento` aqui
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
            {erros.dataNascimento && (
              <span className="erro">{erros.dataNascimento}</span>
            )}
          </div>

          <div>
            <label>Data de Admissão:</label>
            <input
              type="date"
              value={formatDate(dataAdmissao)} // Use `dataAdmissao` aqui
              onChange={(e) => setDataAdmissao(e.target.value)}
              required
            />
            {erros.dataAdmissao && (
              <span className="erro">{erros.dataAdmissao}</span>
            )}
          </div>

          <div>
            <label>Tipo de Profissional:</label>
            <select
              value={tipoProfissional}
              onChange={handleTipoProfissionalChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Atendente">Atendente</option>
              <option value="Diretor">Diretor</option>
              <option value="Medico">Médico</option>
            </select>
            {erros.tipoProfissional && (
              <span className="erro">{erros.tipoProfissional}</span>
            )}
          </div>

          {tipoProfissional === "Medico" && (
            <div>
              <label>CRM:</label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(aplicarMascaraCRM(e.target.value))}
                required
              />
            </div>
          )}

          {tipoProfissional === "Atendente" && (
            <div>
              <label>Setor:</label>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                required
              >
                <option value="">Selecione o Setor</option>
                <option value="Recepção">Recepção</option>
                <option value="Administração">Administração</option>
              </select>
            </div>
          )}

          {tipoProfissional === "Diretor" && (
            <div>
              <label>Departamento:</label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
              >
                <option value="">Selecione o Departamento</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>
          )}

          {/* <div>
            <label>Permissão:</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              required
            >
              <option value="">Selecione</option>
              <option value="0">Consultar</option>
              <option value="1">Criar</option>
              <option value="2">Alterar</option>
            </select>
          </div> */}

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProfissional;
