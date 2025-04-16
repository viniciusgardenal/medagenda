import React, { useState, useEffect } from 'react';

const ModalDetalhesPacientes = ({ isOpen, onClose, pacientes }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pacientes) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [pacientes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full border border-gray-200 shadow-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold text-blue-600">Detalhes do Paciente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center space-x-2 text-gray-500 italic">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p>Carregando dados...</p>
          </div>
        ) : (
          pacientes && (
            <div className="bg-gray-50 p-4 rounded-md space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">CPF:</strong> {pacientes.cpf}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Sexo:</strong> {pacientes.sexo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Nome:</strong> {pacientes.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">E-mail:</strong> {pacientes.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Sobrenome:</strong> {pacientes.sobrenome}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Endereço:</strong> {pacientes.endereco}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Data de Nascimento:</strong> {pacientes.dataNascimento}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold">Telefone:</strong> {pacientes.telefone}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesPacientes;