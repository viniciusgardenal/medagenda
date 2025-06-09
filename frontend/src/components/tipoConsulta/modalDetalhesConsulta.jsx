import React, { useEffect, useRef } from 'react';
import {
  FaNotesMedical,
  FaUserMd,
  FaExclamationCircle,
  FaClock,
  FaAlignLeft,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";

const ModalDetalhesTipoConsulta = ({ isOpen, onClose, tipoConsulta }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Função para formatar datas sem 'moment'
  const formatarDataParaExibicao = (dataStr) => {
    if (!dataStr) return "N/A";
    // Tenta tratar formatos YYYY-MM-DD ou DD/MM/YYYY
    if (dataStr.includes('-')) {
        const parts = dataStr.split('T')[0].split('-'); // Pega apenas a parte da data e divide
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    // Retorna como está se não for um formato reconhecido
    return dataStr;
  };

  if (!isOpen || !tipoConsulta) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaNotesMedical className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes do Tipo de Consulta
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
            {/* --- Bloco Principal --- */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="text-sm font-semibold text-gray-900">
                Nome da Consulta
              </dt>
              <dd className="mt-1 text-lg text-gray-700">
                {tipoConsulta.nomeTipoConsulta || "N/A"}
              </dd>
            </div>

            {/* --- Atributos Gerais --- */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserMd className="h-4 w-4 text-blue-500" /> Especialidade
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoConsulta.especialidade || "N/A"}</dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClock className="h-4 w-4 text-blue-500" /> Duração Estimada
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoConsulta.duracaoEstimada ? `${tipoConsulta.duracaoEstimada} min` : "N/A"}</dd>
            </div>
            
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaExclamationCircle className="h-4 w-4 text-blue-500" /> Prioridade
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoConsulta.prioridade || "N/A"}</dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" /> Status
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${tipoConsulta.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                  {tipoConsulta.status || "N/A"}
                </span>
              </dd>
            </div>

            {/* --- Detalhes Descritivos --- */}
            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" /> Descrição
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {tipoConsulta.descricao || "Nenhuma descrição."}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" /> Requisitos Específicos
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {tipoConsulta.requisitosEspecificos || "Nenhum requisito."}
              </dd>
            </div>
            
            {/* --- Metadados --- */}
            <div className="sm:col-span-2 pt-2 border-t border-gray-200">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" /> Data de Criação
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {formatarDataParaExibicao(tipoConsulta.dataCriacao)}
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

export default ModalDetalhesTipoConsulta;