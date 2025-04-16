import React, { useState } from 'react';
import { criarProfissional } from '../../config/apiServices';
import ValidadorGenerico from '../util/validadorGenerico';
import { RegrasProfissional } from './regrasValidacao';
import { aplicarMascaraCRM, aplicarMascaraTelefone } from '../util/mascaras';

const ModalProfissional = ({ isOpen, onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [tipoProfissional, setTipoProfissional] = useState('');
  const [crm, setCrm] = useState('');
  const [setor, setSetor] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [sendEmail, setSendEmail] = useState('1');
  const [erros, setErros] = useState({});

  const handleTipoProfissionalChange = (event) => {
    setTipoProfissional(event.target.value);
    setCrm('');
    setSetor('');
    setDepartamento('');
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
      ...(tipoProfissional === 'Medico' && { crm }),
      ...(tipoProfissional === 'Atendente' && { setor }),
      ...(tipoProfissional === 'Diretor' && { departamento }),
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
      setNome('');
      setTelefone('');
      setEmail('');
      setDataNascimento('');
      setDataAdmissao('');
      setTipoProfissional('');
      setCrm('');
      setSetor('');
      setDepartamento('');
      setSendEmail('1');
      setErros({});
    } catch (error) {
      console.error('Erro ao adicionar profissional:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Adicionar Profissional</h2>
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
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nome && <span className="text-red-500 text-xs mt-1">{erros.nome}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone:</label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
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
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.email && <span className="text-red-500 text-xs mt-1">{erros.email}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataNascimento && <span className="text-red-500 text-xs mt-1">{erros.dataNascimento}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Admissão:</label>
            <input
              type="date"
              value={dataAdmissao}
              onChange={(e) => setDataAdmissao(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataAdmissao && <span className="text-red-500 text-xs mt-1">{erros.dataAdmissao}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Profissional:</label>
            <select
              value={tipoProfissional}
              onChange={handleTipoProfissionalChange}
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
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {erros.crm && <span className="text-red-500 text-xs mt-1">{erros.crm}</span>}
            </div>
          )}
          {tipoProfissional === 'Atendente' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Setor:</label>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione o Setor</option>
                <option value="Recepção">Recepção</option>
                <option value="Administração">Administração</option>
              </select>
              {erros.setor && <span className="text-red-500 text-xs mt-1">{erros.setor}</span>}
            </div>
          )}
          {tipoProfissional === 'Diretor' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Departamento:</label>
              <select
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Selecione o Departamento</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Financeiro">Financeiro</option>
              </select>
              {erros.departamento && <span className="text-red-500 text-xs mt-1">{erros.departamento}</span>}
            </div>
          )}
          <div className="flex gap-4">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="radio"
                name="sendEmail"
                value="1"
                checked={sendEmail === '1'}
                onChange={(e) => setSendEmail(e.target.value)}
                className="mr-2"
              />
              Enviar E-mail
            </label>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="radio"
                name="sendEmail"
                value="0"
                checked={sendEmail === '0'}
                onChange={(e) => setSendEmail(e.target.value)}
                className="mr-2"
              />
              Não Enviar E-mail
            </label>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Profissional
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalProfissional;