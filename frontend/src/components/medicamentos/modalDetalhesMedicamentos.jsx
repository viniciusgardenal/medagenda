import React, { useState, useEffect } from 'react';

const ModalDetalhesMedicamentos = ({ isOpen, onClose, medicamentos }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (medicamentos) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [medicamentos]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-blue-700">Detalhes do Medicamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm italic">
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
            <p>Carregando...</p>
          </div>
        ) : (
          medicamentos && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-2 text-gray-800">
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">ID:</p>
                <p className="text-base ml-1">{medicamentos.idMedicamento}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Controlado:</p>
                <p className="text-base ml-1">{medicamentos.controlado}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Nome:</p>
                <p className="text-base ml-1">{medicamentos.nomeMedicamento}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Fabricante:</p>
                <p className="text-base ml-1">{medicamentos.nomeFabricante}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Descrição:</p>
                <p className="text-base ml-1">{medicamentos.descricao}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Instrução de Uso:</p>
                <p className="text-base ml-1">{medicamentos.instrucaoUso}</p>
              </div>
              <div className="flex items-center py-1 border-b border-gray-200">
                <p className="text-sm font-semibold">Interações:</p>
                <p className="text-base ml-1">{medicamentos.interacao}</p>
              </div>
            </div>
          )
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesMedicamentos;