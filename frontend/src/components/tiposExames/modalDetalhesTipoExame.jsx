import React, { useEffect, useRef } from 'react';
import {
  FaVial,
  FaHashtag,
  FaMicroscope,
  FaClock,
  FaTags,
  FaAlignLeft,
} from "react-icons/fa";

const ModalDetalhesTipoExame = ({ isOpen, onClose, tipoExame }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !tipoExame) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaVial className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes do Tipo de Exame
          </h3>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="text-sm font-semibold text-gray-900">
                Nome do Exame
              </dt>
              <dd className="mt-1 text-lg text-gray-700">
                {tipoExame.nomeTipoExame || "N/A"}
              </dd>
            </div>
            
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaHashtag className="h-4 w-4 text-blue-500" /> Código
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoExame.idTipoExame || "N/A"}</dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaTags className="h-4 w-4 text-blue-500" /> Categoria
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoExame.categoria || "N/A"}</dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaMicroscope className="h-4 w-4 text-blue-500" /> Material Coletado
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{tipoExame.materialColetado || "N/A"}</dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClock className="h-4 w-4 text-blue-500" /> Tempo em Jejum
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {tipoExame.tempoJejum ? `${tipoExame.tempoJejum} horas` : "Não necessário"}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" /> Observação
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">
                {tipoExame.observacao || "Nenhuma observação."}
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

export default ModalDetalhesTipoExame;