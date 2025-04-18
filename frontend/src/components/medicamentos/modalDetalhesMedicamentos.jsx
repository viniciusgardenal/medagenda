import React from "react";
import { X } from "lucide-react";

const ModalDetalhesMedicamentos = ({ isOpen, onClose, medicamentos }) => {
  if (!isOpen || !medicamentos) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Título */}
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Detalhes do Medicamento
        </h2>

        <div className="space-y-4">
          {/* Nome do Medicamento e Fabricante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Medicamento
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {medicamentos.nomeMedicamento || "Não informado"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fabricante
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {medicamentos.nomeFabricante || "Não informado"}
              </p>
            </div>
          </div>

          {/* Controlado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Controlado
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
              {medicamentos.controlado === "Sim" ||
              medicamentos.controlado === "Medicamento Controlado"
                ? "Sim"
                : medicamentos.controlado === "Não" ||
                  medicamentos.controlado === "Medicamento Não Controlado"
                ? "Não"
                : medicamentos.controlado || "Não informado"}
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm min-h-[80px] whitespace-pre-wrap">
              {medicamentos.descricao || "Não informado"}
            </p>
          </div>

          {/* Instrução de Uso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instrução de Uso
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm min-h-[80px] whitespace-pre-wrap">
              {medicamentos.instrucaoUso || "Não informado"}
            </p>
          </div>

          {/* Interações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interações Medicamentosas
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm min-h-[80px] whitespace-pre-wrap">
              {medicamentos.interacao || "Não informado"}
            </p>
          </div>
        </div>

        {/* Botão Fechar */}
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
