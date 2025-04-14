import React from "react";

const ViewReceitas = ({ isOpen, onClose, receita }) => {
  if (!isOpen || !receita) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Detalhes da Receita</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Paciente</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {receita.pacienteNome} (CPF: {receita.cpfPaciente})
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Profissional</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              Matrícula: {receita.matriculaProfissional || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Medicamentos</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {receita.medicamentos.length > 0
                ? receita.medicamentos.map((med) => med.nomeMedicamento).join(", ")
                : "Nenhum medicamento"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dosagem</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {receita.dosagem || "—"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Instrução de Uso</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {receita.instrucaoUso || "—"}
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReceitas;