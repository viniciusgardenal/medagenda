import React, { useEffect, useRef } from 'react';
import {
  FaUserMd,
  FaIdBadge,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBirthdayCake,
  FaCalendarCheck,
  FaStethoscope,
} from "react-icons/fa";
import { aplicarMascaraCRM } from '../util/mascaras';

const ModalDetalhesProfissional = ({ isOpen, onClose, profissional }) => {
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
    if (dataStr.includes('-')) {
        const [ano, mes, dia] = dataStr.split("-");
        return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  if (!isOpen || !profissional) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FaUserMd className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Detalhes do Profissional</h3>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">&times;</button>
        
        <div className="space-y-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* --- Bloco de Identificação --- */}
              <div className="sm:col-span-2 border-b border-gray-200 pb-4">
                <dt className="text-sm font-semibold text-gray-900">Nome Completo</dt>
                <dd className="mt-1 text-lg text-gray-700">{`${profissional.nome || ''} ${profissional.sobrenome || ''}`.trim() || "N/A"}</dd>
              </div>

              {/* --- Bloco de Dados Profissionais --- */}
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaIdBadge className="h-4 w-4 text-blue-500" />Matrícula</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.matricula || "N/A"}</dd>
              </div>
              
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaBuilding className="h-4 w-4 text-blue-500" />Tipo de Profissional</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.tipoProfissional || "N/A"}</dd>
              </div>
              
              {/* Campo Condicional do Cargo */}
              {profissional.tipoProfissional === 'Medico' && (
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaStethoscope className="h-4 w-4 text-blue-500" />CRM</dt>
                  <dd className="mt-1 text-sm text-gray-700 pl-6">{aplicarMascaraCRM(profissional.crm) || "N/A"}</dd>
                </div>
              )}
               {profissional.tipoProfissional === 'Atendente' && (
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaBuilding className="h-4 w-4 text-blue-500" />Setor</dt>
                  <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.setor || "N/A"}</dd>
                </div>
              )}
              {profissional.tipoProfissional === 'Diretor' && (
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaBuilding className="h-4 w-4 text-blue-500" />Departamento</dt>
                  <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.departamento || "N/A"}</dd>
                </div>
              )}

               {/* --- Bloco de Datas --- */}
               <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaCalendarCheck className="h-4 w-4 text-green-500" />Data de Admissão</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{formatarDataParaExibicao(profissional.dataAdmissao)}</dd>
              </div>

               <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaBirthdayCake className="h-4 w-4 text-blue-500" />Data de Nascimento</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{formatarDataParaExibicao(profissional.dataNascimento)}</dd>
              </div>

              {/* --- Bloco de Contato --- */}
              <div className="sm:col-span-2">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaEnvelope className="h-4 w-4 text-blue-500" />E-mail</dt>
                  <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.email || "N/A"}</dd>
              </div>

               <div className="sm:col-span-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaPhone className="h-4 w-4 text-blue-500" />Telefone</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{profissional.telefone || "N/A"}</dd>
              </div>
            </dl>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesProfissional;