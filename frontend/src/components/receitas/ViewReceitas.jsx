import React from "react";
import { FaTimes, FaStethoscope } from 'react-icons/fa';

const ViewReceitas = ({ isOpen, onClose, receita }) => {
  if (!isOpen || !receita) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Diminuído o padding geral de p-8 para p-6 */}
      <div className="relative bg-white w-full max-w-lg p-6 rounded-lg shadow-xl" id="receita-para-pdf">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <FaTimes size={20} />
        </button>
        
        {/* Diminuído o espaçamento inferior de mb-6 para mb-4 */}
        <header className="text-center border-b pb-3 mb-4">
          <FaStethoscope className="mx-auto text-3xl text-blue-600 mb-2" />
          <h1 className="text-lg font-bold text-gray-800">RECEITUÁRIO MÉDICO</h1>
        </header>

        {/* Diminuído o espaçamento inferior de mb-6 para mb-4 */}
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-1">Paciente</h2>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="font-semibold text-gray-800 text-sm">{receita.paciente?.nome} {receita.paciente?.sobrenome}</p>
            <p className="text-xs text-gray-600">CPF: {receita.paciente?.cpf}</p>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Prescrição</h2>
          {/* -- ÁREA DE SCROLL --
            - max-h-48: Define uma altura máxima de 12rem (192px).
            - overflow-y-auto: Adiciona uma barra de rolagem vertical se o conteúdo passar da altura máxima.
            - pr-2: Adiciona um pequeno espaçamento à direita para a barra de rolagem não cobrir o texto.
          */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border rounded-md p-3 bg-gray-50">
            {receita.medicamentos.length > 0 ? (
                receita.medicamentos.map((med, index) => (
                    <div key={index} className="border-t pt-2 first:border-t-0 first:pt-0">
                        <p className="font-bold text-gray-800 text-sm">{index + 1}. {med.nomeMedicamento}</p>
                        <div className="pl-4 text-xs text-gray-600">
                            <p><strong>Dosagem:</strong> {med.dosagem}</p>
                            <p><strong>Instruções:</strong> {med.instrucaoUso}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">Nenhum medicamento prescrito.</p>
            )}
          </div>
        </section>

        {/* Diminuído o espaçamento superior de mt-12 para mt-6 */}
        <footer className="mt-6 pt-4 border-t text-center">
            <div className="w-56 h-8 mx-auto mb-1">
               {/* Espaço para Assinatura */}
            </div>
            <p className="text-xs">_________________________________________</p>
            <p className="font-semibold text-gray-800 text-sm">{receita.profissional?.nome}</p>
            <p className="text-xs text-gray-600">CRM: {receita.profissional?.crm}</p>
            <p className="text-xs text-gray-500 mt-2">Data da Emissão: {new Date(receita.createdAt).toLocaleDateString('pt-BR')}</p>
        </footer>

      </div>
    </div>
  );
};

export default ViewReceitas;