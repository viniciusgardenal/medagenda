import React, { useEffect, useRef } from "react";
import {
  FaUserInjured,
  FaIdCard,
  FaVenusMars,
  FaBirthdayCake,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ModalDetalhesPacientes = ({ isOpen, onClose, pacientes }) => {
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
    // Tenta tratar ambos os formatos YYYY-MM-DD e DD/MM/YYYY
    if (dataStr.includes('-')) {
        const [ano, mes, dia] = dataStr.split("-");
        return `${dia}/${mes}/${ano}`;
    }
    return dataStr; // Retorna como está se não for o formato esperado
  };
  
  // Renomeando para clareza
  const paciente = pacientes;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <FaUserInjured className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes do Paciente
          </h3>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>

        {!paciente ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="sm:col-span-2 border-b border-gray-200 pb-4">
                <dt className="text-sm font-semibold text-gray-900">
                  Nome Completo
                </dt>
                <dd className="mt-1 text-lg text-gray-700">
                  {`${paciente.nome || ''} ${paciente.sobrenome || ''}`.trim() || "N/A"}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaIdCard className="h-4 w-4 text-blue-500" /> CPF
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{paciente.cpf || "N/A"}</dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaBirthdayCake className="h-4 w-4 text-blue-500" /> Data de Nascimento
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{formatarDataParaExibicao(paciente.dataNascimento)}</dd>
              </div>

              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaVenusMars className="h-4 w-4 text-blue-500" /> Sexo
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{paciente.sexo || "N/A"}</dd>
              </div>

               <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaPhone className="h-4 w-4 text-blue-500" /> Telefone
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{paciente.telefone || "N/A"}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaEnvelope className="h-4 w-4 text-blue-500" /> E-mail
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{paciente.email || "N/A"}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <FaMapMarkerAlt className="h-4 w-4 text-blue-500" /> Endereço
                </dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{paciente.endereco || "N/A"}</dd>
              </div>
            </dl>
          </div>
        )}
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

export default ModalDetalhesPacientes;