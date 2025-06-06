import React from 'react';
import { FaTimesCircle, FaUserMd, FaUserInjured } from 'react-icons/fa';
import moment from 'moment';

const ModalDetalhesAtestado = ({ isOpen, onClose, atestado }) => {
  if (!isOpen || !atestado) return null;

  // Garantimos que temos objetos vazios como fallback para evitar erros
  const paciente = atestado.paciente || {};
  const profissional = atestado.profissional || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-2xl relative transform transition-all">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FaTimesCircle className="h-7 w-7" />
        </button>

        <div className="border-b-2 border-gray-200 pb-4 mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Atestado {atestado.tipoAtestado}</h2>
            <p className="text-sm text-gray-500">Emitido em: {moment(atestado.dataEmissao).format("DD/MM/YYYY [às] HH:mm")}</p>
        </div>

        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2"><FaUserInjured /> Paciente</h3>
                <p className="text-gray-800">{paciente.nome} {paciente.sobrenome}</p>
                <p className="text-sm text-gray-600">CPF: {paciente.cpf}</p>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 text-justify">
                <p>
                    Atesto, para os devidos fins, que o(a) paciente acima citado(a) esteve sob meus cuidados profissionais na data de hoje, necessitando de afastamento de suas atividades pelo motivo de <strong className="font-medium text-gray-900">{atestado.motivo || 'consulta médica'}</strong>.
                </p>
                {atestado.observacoes && (
                    <blockquote className="border-l-4 border-blue-300 pl-4 italic">
                        <p><strong>Observações:</strong> {atestado.observacoes}</p>
                    </blockquote>
                )}
            </div>

            <div className="pt-8 text-center">
                <p className="font-mono text-lg">{profissional.nome} {profissional.sobrenome}</p>
                <p className="text-sm text-gray-700 border-t border-gray-300 w-64 mx-auto pt-1">Profissional Responsável</p>
                <p className="text-xs text-gray-500 mt-1">CRM/SP: {profissional.crm || 'Não especificado'} | Matrícula: {profissional.matricula}</p>
                <p className="text-xs text-gray-400 mt-6">Presidente Prudente, {moment().format("DD de MMMM de YYYY")}</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ModalDetalhesAtestado;