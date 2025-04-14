import React from "react";
import { criarReceita } from "../../config/apiServices";

const ReceitasTable = ({ receitas, onVisualizar }) => {
  const handleEmitirPDF = async (receita) => {
    const dados = {
      cpfPaciente: receita.cpfPaciente,
      matriculaProfissional: receita.matriculaProfissional,
      idMedicamento: receita.medicamentos.map((med) => med.idMedicamento),
      dosagem: receita.dosagem,
      instrucaoUso: receita.instrucaoUso,
    };

    try {
      const response = await criarReceita(dados);
      if (response.headers["content-type"] === "application/pdf") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "receita.pdf";
        link.click();
      }
    } catch (error) {
      console.error("Erro ao emitir receita", error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
              Paciente
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Medicamentos
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Dosagem
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Instrução de Uso
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {receitas.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-4 text-center text-gray-500"
              >
                Nenhuma receita registrada
              </td>
            </tr>
          ) : (
            receitas.map((receita, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {receita.pacienteNome} (CPF: {receita.cpfPaciente})
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {receita.medicamentos
                    .map((med) => med.nomeMedicamento)
                    .join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {receita.dosagem || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {receita.instrucaoUso || "—"}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => onVisualizar(receita)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Visualizar"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => handleEmitirPDF(receita)}
                    className="text-green-500 hover:text-green-700"
                    title="Emitir PDF"
                  >
                    <EmitIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EmitIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
);

export default ReceitasTable;