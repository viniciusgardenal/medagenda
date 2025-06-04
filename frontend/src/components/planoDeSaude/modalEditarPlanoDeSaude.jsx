import React, { useState, useEffect } from 'react'; // Adicionado useEffect para foco, se necessário
import { atualizarPlanoDeSaude } from '../../config/apiServices';
import SuccessAlert from '../util/successAlert';
import moment from 'moment';

const ModalEditarPlanoDeSaude = ({ isOpen, onClose, plano, onUpdate }) => {
  // Função auxiliar para formatar a data inicial para o input type="date"
  const formatInitialDate = (dateStr) => {
    if (!dateStr) return ''; // Retorna string vazia se não houver data
    // Tenta parsear a data assumindo o formato DD/MM/YYYY
    const mDate = moment(dateStr, 'DD/MM/YYYY');
    // Se for válida, formata para YYYY-MM-DD, senão retorna string vazia
    return mDate.isValid() ? mDate.format('YYYY-MM-DD') : '';
  };

  const [nomePlanoDeSaude, setNomePlanoDeSaude] = useState(plano?.nomePlanoDeSaude || '');
  const [descricao, setDescricao] = useState(plano?.descricao || '');
  const [tipoPlanoDeSaude, setTipoPlanoDeSaude] = useState(plano?.tipoPlanoDeSaude || '');
  const [dataInicio, setDataInicio] = useState(formatInitialDate(plano?.dataInicio));
  const [dataFim, setDataFim] = useState(formatInitialDate(plano?.dataFim));
  const [status, setStatus] = useState(plano?.status || 'Ativo');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para resetar os campos quando o 'plano' mudar (caso a modal seja reutilizada)
  useEffect(() => {
    if (plano) {
      setNomePlanoDeSaude(plano.nomePlanoDeSaude || '');
      setDescricao(plano.descricao || '');
      setTipoPlanoDeSaude(plano.tipoPlanoDeSaude || '');
      setDataInicio(formatInitialDate(plano.dataInicio));
      setDataFim(formatInitialDate(plano.dataFim));
      setStatus(plano.status || 'Ativo');
      setErros({}); // Limpa erros anteriores
    }
  }, [plano]);


  const validarCampos = () => {
    const newErros = {};
    if (!nomePlanoDeSaude) newErros.nomePlanoDeSaude = 'O nome do plano de saúde é obrigatório!';
    if (!tipoPlanoDeSaude) newErros.tipoPlanoDeSaude = 'O tipo do plano de saúde é obrigatório!';
    if (!dataInicio) newErros.dataInicio = 'A data de início é obrigatória!';
    
    // Validação de datas usando moment para maior precisão
    if (dataInicio && dataFim) {
      const mDataInicio = moment(dataInicio, 'YYYY-MM-DD');
      const mDataFim = moment(dataFim, 'YYYY-MM-DD');
      if (mDataFim.isValid() && mDataInicio.isValid() && mDataFim.isBefore(mDataInicio)) {
        newErros.dataFim = 'A data de fim não pode ser anterior à data de início.';
      }
    }
    
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    // Garante que o idPlanoDeSaude existe antes de tentar atualizar
    if (!plano || !plano.idPlanoDeSaude) {
      console.error('ID do plano de saúde não encontrado para atualização.');
      setErros({ ...erros, geral: 'Erro: ID do plano não encontrado.' });
      return;
    }

    const dadosAtualizados = {
      nomePlanoDeSaude,
      descricao,
      tipoPlanoDeSaude,
      // Envia as datas no formato que a API espera (ajustar se necessário, aqui está YYYY-MM-DD)
      // Se a API espera DD/MM/YYYY, converta aqui:
      // dataInicio: dataInicio ? moment(dataInicio, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
      // dataFim: dataFim ? moment(dataFim, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
      dataInicio: dataInicio || null, // Envia null se vazio
      dataFim: dataFim || null,     // Envia null se vazio
      status,
    };

    try {
      setIsLoading(true);
      await atualizarPlanoDeSaude(plano.idPlanoDeSaude, dadosAtualizados);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        onUpdate(); // Chama onUpdate para recarregar a lista e fechar
        onClose();  // Garante que a modal feche mesmo que onUpdate não o faça diretamente
      }, 3000); // Aumentado o tempo para o usuário ver a mensagem de sucesso, se necessário.
    } catch (error) {
      console.error('Erro ao atualizar plano de saúde:', error);
      // Adicionar feedback de erro para o usuário
      setErros({ ...erros, geral: 'Erro ao salvar as alterações. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* Adicionado z-index alto */}
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
              rows="3"
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
              min={dataInicio} // Garante que a data fim não seja anterior à data de início no próprio input
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
              <option value="Cancelado">Cancelado</option> {/* Opção de status do código original */}
            </select>
            {erros.status && <span className="text-red-500 text-xs mt-1">{erros.status}</span>}
          </div>
          {erros.geral && (
            <span className="text-red-500 text-xs mt-1 block text-center">{erros.geral}</span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {/* SVG do ícone de salvar/loading (pode ser ajustado) */}
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20" // Ajustado viewBox para ícone de check/save
                fill="currentColor"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            )}
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPlanoDeSaude;