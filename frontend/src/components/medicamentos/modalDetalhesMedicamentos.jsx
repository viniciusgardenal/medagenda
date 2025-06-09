import React, { useEffect, useRef } from "react";
import {
  FaPills,
  FaIndustry,
  FaPrescriptionBottle,
  FaAlignLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const ModalDetalhesMedicamentos = ({ isOpen, onClose, medicamentos }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !medicamentos) return null;

  // Simplifica a verificação do campo "controlado"
  const isControlado = 
    ["Sim", "Medicamento Controlado"].includes(medicamentos.controlado);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaPills className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes do Medicamento
          </h3>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fechar modal"
        >
          &times;
        </button>

        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="text-sm font-semibold text-gray-900">
                Nome do Medicamento
              </dt>
              <dd className="mt-1 text-lg text-gray-700">
                {medicamentos.nomeMedicamento || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaIndustry className="h-4 w-4 text-blue-500" /> Fabricante
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {medicamentos.nomeFabricante || "N/A"}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaPrescriptionBottle className="h-4 w-4 text-blue-500" /> Controlado
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                 <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${isControlado ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                  {isControlado ? "Sim" : "Não"}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" /> Descrição
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {medicamentos.descricao || "Nenhuma descrição fornecida."}
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" /> Instruções de Uso
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {medicamentos.instrucaoUso || "Nenhuma instrução fornecida."}
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaExclamationTriangle className="h-4 w-4 text-yellow-500" /> Interações Medicamentosas
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {medicamentos.interacao || "Nenhuma interação informada."}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesMedicamentos;