import React, { useState } from 'react';
import { atualizarPlanoDeSaude } from '../../config/apiServices';
import SuccessAlert from '../util/successAlert';
import moment from 'moment';

const ModalEditarPlanoDeSaude = ({ isOpen, onClose, plano, onUpdate }) => {
  const [nomePlanoDeSaude, setNomePlanoDeSaude] = useState(plano?.nomePlanoDeSaude || '');
  const [descricao, setDescricao] = useState(plano?.descricao || '');
  const [tipoPlanoDeSaude, setTipoPlanoDeSaude] = useState(plano?.tipoPlanoDeSaude || '');
  const [dataInicio, setDataInicio] = useState(
    plano?.dataInicio ? moment(plano.dataInicio, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''
  );
  const [dataFim, setDataFim] = useState(
    plano?.dataFim ? moment(plano.dataFim, 'DD/MM/YYYY').format('YYYY-MM-DD') : ''
  );
  const [status, setStatus] = useState(plano?.status || 'Ativo');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validarCampos = () => {
    const newErros = {};
    if (!nomePlanoDeSaude) newErros.nomePlanoDeSaude = 'O nome do plano de saúde é obrigatório!';
    if (!tipoPlanoDeSaude) newErros.tipoPlanoDeSaude = 'O tipo do plano de saúde é obrigatório!';
    if (!dataInicio) newErros.dataInicio = 'A data de início é obrigatória!';
    if (dataFim && new Date(dataFim) < new Date(dataInicio)) {
      newErros.dataFim = 'A data de fim não pode ser anterior à data de início.';
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      nomePlanoDeSaude,
      descricao,
      tipoPlanoDeSaude,
      dataInicio,
      dataFim,
      status,
    };

    try {
      setIsLoading(true);
      await atualizarPlanoDeSaude(plano.idPlanoDeSaude, dadosAtualizados);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar plano de saúde:', error);
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
            message="Plano de saúde atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Editar Plano de Saúde</h2>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Plano de Saúde:</label>
            <input
              type="text"
              value={nomePlanoDeSaude}
              onChange={(e) => setNomePlanoDeSaude(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nomePlanoDeSaude && <span className="text-red-500 text-xs mt-1">{erros.nomePlanoDeSaude}</span>}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo do Plano de Saúde:</label>
            <input
              type="text"
              value={tipoPlanoDeSaude}
              onChange={(e) => setTipoPlanoDeSaude(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.tipoPlanoDeSaude && <span className="text-red-500 text-xs mt-1">{erros.tipoPlanoDeSaude}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataInicio && <span className="text-red-500 text-xs mt-1">{erros.dataInicio}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              min={dataInicio}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataFim && <span className="text-red-500 text-xs mt-1">{erros.dataFim}</span>}
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
              <option value="Cancelado">Cancelado</option>
            </select>
            {erros.status && <span className="text-red-500 text-xs mt-1">{erros.status}</span>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPlanoDeSaude;