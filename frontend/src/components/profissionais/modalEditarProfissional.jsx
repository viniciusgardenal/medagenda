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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {showSuccessAlert && (
          <SuccessAlert
            message="Profissional Atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Editar Profissional</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nome && <span className="text-red-500 text-xs mt-1">{erros.nome}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={handleTelefoneChange}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.telefone && <span className="text-red-500 text-xs mt-1">{erros.telefone}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.email && <span className="text-red-500 text-xs mt-1">{erros.email}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              placeholder="Digite para trocar senha"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Nascimento:</label>
            <input
              type="date"
              value={formatDate(dataNascimento)}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataNascimento && <span className="text-red-500 text-xs mt-1">{erros.dataNascimento}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Admissão:</label>
            <input
              type="date"
              value={formatDate(dataAdmissao)}
              onChange={(e) => setDataAdmissao(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataAdmissao && <span className="text-red-500 text-xs mt-1">{erros.dataAdmissao}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Profissional:</label>
            <select
              value={tipoProfissional}
              onChange={handleTipoProfissionalChange}
              required
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Atendente">Atendente</option>
              <option value="Diretor">Diretor</option>
              <option value="Medico">Médico</option>
            </select>
            {erros.tipoProfissional && <span className="text-red-500 text-xs mt-1">{erros.tipoProfissional}</span>}
          </div>
          {tipoProfissional === 'Medico' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">CRM:</label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(aplicarMascaraCRM(e.target.value))}
                required
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
          {tipoProfissional === 'Atendente' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Setor:</label>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione o Setor</option>
                <option value="Recepção">Recepção</option>
                <option value="Administração">Administração</option>
              </select>
            </div>
          )}
          {tipoProfissional === 'Diretor' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Departamento:</label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione o Departamento</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarProfissional;
