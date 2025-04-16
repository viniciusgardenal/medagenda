import React, { useState } from 'react';
import { updatePacientes } from '../../config/apiServices';
import SuccessAlert from '../util/successAlert';
import moment from 'moment';
import { aplicarMascaraTelefone } from '../util/mascaras';

const ModalEditarPaciente = ({ isOpen, onClose, pacientes, onUpdate }) => {
  const [nome, setNome] = useState(pacientes?.nome || '');
  const [sobrenome, setSobrenome] = useState(pacientes?.sobrenome || '');
  const [sexo, setSexo] = useState(pacientes?.sexo || '');
  const [dataNascimento, setDataNascimento] = useState(
    pacientes?.dataNascimento
      ? moment(pacientes.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')
      : ''
  );
  const [email, setEmail] = useState(pacientes?.email || '');
  const [endereco, setEndereco] = useState(pacientes?.endereco || '');
  const [telefone, setTelefone] = useState(pacientes?.telefone || '');
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const cpf = pacientes?.cpf || '';

  const validarCampos = () => {
    const newErros = {};
    if (!nome) newErros.nome = 'O nome é obrigatório!';
    if (!sobrenome) newErros.sobrenome = 'O sobrenome é obrigatório!';
    if (!sexo) newErros.sexo = 'O sexo é obrigatório!';
    if (!dataNascimento) newErros.dataNascimento = 'A data de nascimento é obrigatória!';
    if (!email) newErros.email = 'O e-mail é obrigatório!';
    if (!endereco) newErros.endereco = 'O endereço é obrigatório!';
    if (!telefone) newErros.telefone = 'O telefone é obrigatório!';
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      nome,
      sobrenome,
      sexo,
      dataNascimento,
      email,
      endereco,
      telefone,
    };

    try {
      await updatePacientes(pacientes.cpf, dadosAtualizados);
      setShowSuccessAlert(true);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        {showSuccessAlert && (
          <SuccessAlert
            message="Paciente Atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Editar Paciente</h2>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">CPF (Apenas visível):</label>
            <input
              type="text"
              value={cpf}
              readOnly
              disabled
              className="w-full px-3 py-2 text-sm border rounded-md bg-gray-100"
            />
          </div>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sobrenome:</label>
            <input
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.sobrenome && <span className="text-red-500 text-xs mt-1">{erros.sobrenome}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sexo:</label>
            <select
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
            {erros.sexo && <span className="text-red-500 text-xs mt-1">{erros.sexo}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data de Nascimento:</label>
            <input
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.dataNascimento && <span className="text-red-500 text-xs mt-1">{erros.dataNascimento}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.email && <span className="text-red-500 text-xs mt-1">{erros.email}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Endereço:</label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.endereco && <span className="text-red-500 text-xs mt-1">{erros.endereco}</span>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone:</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.telefone && <span className="text-red-500 text-xs mt-1">{erros.telefone}</span>}
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

export default ModalEditarPaciente;