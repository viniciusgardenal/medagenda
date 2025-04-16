import React, { useState } from 'react';
import { updateMedicamentos } from '../../config/apiServices';
import SuccessAlert from '../util/successAlert';

const ModalEditarMedicamento = ({ isOpen, onClose, medicamentos, onUpdate }) => {
  const [nomeMedicamento, setNomeMedicamento] = useState(medicamentos?.nomeMedicamento || '');
  const [controlado, setControlado] = useState(medicamentos?.controlado || '');
  const [nomeFabricante, setNomeFabricante] = useState(medicamentos?.nomeFabricante || '');
  const [descricao, setDescricao] = useState(medicamentos?.descricao || '');
  const [instrucaoUso, setInstrucaoUso] = useState(medicamentos?.instrucaoUso || '');
  const [interacao, setInteracao] = useState(medicamentos?.interacao || '');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const validarCampos = () => {
    const newErros = {};
    if (!nomeMedicamento) newErros.nomeMedicamento = 'O nome do medicamento é obrigatório!';
    if (!controlado) newErros.controlado = 'O status de controlado é obrigatório!';
    if (!nomeFabricante) newErros.nomeFabricante = 'O nome do fabricante é obrigatório!';
    if (!descricao) newErros.descricao = 'A descrição é obrigatória!';
    if (!instrucaoUso) newErros.instrucaoUso = 'A instrução de uso é obrigatória!';
    if (!interacao) newErros.interacao = 'As interações são obrigatórias!';
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      nomeMedicamento,
      controlado,
      nomeFabricante,
      descricao,
      instrucaoUso,
      interacao,
    };

    try {
      await updateMedicamentos(medicamentos.idMedicamento, dadosAtualizados);
      setShowSuccessAlert(true);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {showSuccessAlert && (
          <SuccessAlert
            message="Medicamento atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Editar Medicamento</h2>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Medicamento:</label>
            <input
              type="text"
              value={nomeMedicamento}
              onChange={(e) => setNomeMedicamento(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nomeMedicamento && <span className="text-red-500 text-xs mt-1">{erros.nomeMedicamento}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Controlado:</label>
            <select
              value={controlado}
              onChange={(e) => setControlado(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Medicamento Controlado">Medicamento Controlado</option>
              <option value="Medicamento Não Controlado">Medicamento Não Controlado</option>
            </select>
            {erros.controlado && <span className="text-red-500 text-xs mt-1">{erros.controlado}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome do Fabricante:</label>
            <input
              type="text"
              value={nomeFabricante}
              onChange={(e) => setNomeFabricante(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nomeFabricante && <span className="text-red-500 text-xs mt-1">{erros.nomeFabricante}</span>}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instrução de Uso:</label>
            <textarea
              value={instrucaoUso}
              onChange={(e) => setInstrucaoUso(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.instrucaoUso && <span className="text-red-500 text-xs mt-1">{erros.instrucaoUso}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Interações Medicamentosas:</label>
            <textarea
              value={interacao}
              onChange={(e) => setInteracao(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.interacao && <span className="text-red-500 text-xs mt-1">{erros.interacao}</span>}
          </div>
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

export default ModalEditarMedicamento;