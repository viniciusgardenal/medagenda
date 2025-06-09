import React, { useEffect, useRef } from "react";
import {
  FaFileMedical,
  FaInfoCircle,
  FaCalendarAlt,
  FaAlignLeft,
} from "react-icons/fa";

const ModalDetalhesPlanoDeSaude = ({ isOpen, onClose, planoDeSaude }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const formatarDataParaExibicao = (dataStr) => {
    if (!dataStr) return "N/A";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  if (!isOpen || !planoDeSaude) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaFileMedical className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes do Plano de Saúde
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
                Nome da Operadora
              </dt>
              <dd className="mt-1 text-lg text-gray-700">
                {planoDeSaude.nomeOperadora || "N/A"}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaAlignLeft className="h-4 w-4 text-blue-500" />
                Descrição
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.descricao || "Nenhuma descrição fornecida."}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data de Início
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {formatarDataParaExibicao(planoDeSaude.dataInicio)}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-red-500" />
                Data de Fim
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {formatarDataParaExibicao(planoDeSaude.dataFim)}
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Código
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.codigoPlano || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Tipo do Plano
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {planoDeSaude.tipoPlano || "N/A"}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    planoDeSaude.status === "Ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {planoDeSaude.status || "N/A"}
                </span>
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

export default ModalDetalhesPlanoDeSaude;