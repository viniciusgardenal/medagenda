import React, { useState } from 'react';
import { criarTipoConsulta } from '../../config/apiServices';
import ValidadorGenerico from '../util/validadorGenerico';
import { RegrasTipoConsulta } from './regrasValidacao';
import SuccessAlert from '../util/successAlert';

const ModalTipoConsulta = ({ isOpen, onClose, onSave }) => {
  const [nomeTipoConsulta, setNomeTipoConsulta] = useState('');
  const [descricao, setDescricao] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [duracaoEstimada, setDuracaoEstimada] = useState('');
  const [requisitosEspecificos, setRequisitosEspecificos] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [dataCriacao, setDataCriacao] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dados = {
      nomeTipoConsulta,
      descricao,
      especialidade,
      duracaoEstimada,
      requisitosEspecificos,
      prioridade,
      dataCriacao,
      status,
    };

    const errosValidacao = ValidadorGenerico(dados, RegrasTipoConsulta);
    if (errosValidacao) {
      setErros(errosValidacao);
      return;
    }

    try {
      setIsLoading(true);
      await criarTipoConsulta(dados);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      onSave();
      onClose();
      setNomeTipoConsulta('');
      setDescricao('');
      setEspecialidade('');
      setDuracaoEstimada('');
      setRequisitosEspecificos('');
      setPrioridade('');
      setDataCriacao('');
      setStatus('Ativo');
      setErros({});
    } catch (error) {
      console.error('Erro ao adicionar tipo de consulta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {showSuccessAlert && (
          <SuccessAlert
            message="Tipo de consulta criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Adicionar Tipo de Consulta</h2>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Consulta:</label>
            <input
              type="text"
              value={nomeTipoConsulta}
              onChange={(e) => setNomeTipoConsulta(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nomeTipoConsulta && <span className="text-red-500 text-xs mt-1">{erros.nomeTipoConsulta}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.descricao && <span className="text-red-500 text-xs mt-1">{erros.descricao}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Especialidade:</label>
            <input
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.especialidade && <span className="text-red-500 text-xs mt-1">{erros.especialidade}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duração Estimada (min):</label>
            <input
              type="number"
              value={duracaoEstimada}
              onChange={(e) => setDuracaoEstimada(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.duracaoEstimada && <span className="text-red-500 text-xs mt-1">{erros.duracaoEstimada}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Requisitos Específicos:</label>
            <textarea
              value={requisitosEspecificos}
              onChange={(e) => setRequisitosEspecificos(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.requisitosEspecificos && <span className="text-red-500 text-xs mt-1">{erros.requisitosEspecificos}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione a Prioridade</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            {erros.prioridade && <span className="text-red-500 text-xs mt-1">{erros.prioridade}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Criação:</label>
            <input
              type="date"
              value={dataCriacao}
              onChange={(e) => setDataCriacao(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataCriacao && <span className="text-red-500 text-xs mt-1">{erros.dataCriacao}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            {erros.status && <span className="text-red-500 text-xs mt-1">{erros.status}</span>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isLoading ? 'Criando...' : 'Adicionar Consulta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalTipoConsulta;