import React, { useState } from 'react';
import { criarTipoExame } from '../../config/apiServices';
import ValidadorGenerico from '../util/validadorGenerico';
import { RegrasTipoExame } from './regrasValidacao';
import SuccessAlert from '../util/successAlert';

const ModalExame = ({ isOpen, onClose, onSave }) => {
  const [nomeTipoExame, setNomeTipoExame] = useState('');
  const [categoria, setCategoria] = useState('');
  const [materialColetado, setMaterialColetado] = useState('');
  const [tempoJejum, setTempoJejum] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      await criarTipoExame(dados);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      onSave();
      onClose();
      setNomeTipoExame('');
      setCategoria('');
      setMaterialColetado('');
      setTempoJejum('');
      setObservacao('');
      setErros({});
    } catch (error) {
      console.error('Erro ao adicionar tipo de exame:', error);
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
            message="Tipo de exame criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Adicionar Tipo de Exame</h2>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Tipo de Exame:</label>
            <input
              type="text"
              value={nomeTipoExame}
              onChange={(e) => setNomeTipoExame(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Hemograma Completo"
            />
            {erros.nomeTipoExame && <span className="text-red-500 text-xs mt-1">{erros.nomeTipoExame}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Material Coletado:</label>
            <input
              type="text"
              value={materialColetado}
              onChange={(e) => setMaterialColetado(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: Sangue, Urina"
            />
            {erros.materialColetado && <span className="text-red-500 text-xs mt-1">{erros.materialColetado}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tempo em Jejum (Horas):</label>
            <input
              type="number"
              value={tempoJejum}
              onChange={(e) => setTempoJejum(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ex: 8"
            />
            {erros.tempoJejum && <span className="text-red-500 text-xs mt-1">{erros.tempoJejum}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione a Categoria</option>
              <option value="Laboratorial">Laboratorial</option>
              <option value="Imagem">Imagem</option>
            </select>
            {erros.categoria && <span className="text-red-500 text-xs mt-1">{erros.categoria}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Observação:</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Insira informações adicionais, se necessário"
            />
            {erros.observacao && <span className="text-red-500 text-xs mt-1">{erros.observacao}</span>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isLoading ? 'Criando...' : 'Adicionar Exame'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalExame;