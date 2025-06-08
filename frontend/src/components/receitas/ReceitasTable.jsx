import React from "react";
import TableHeader from "./TableHeader";

const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

// O componente agora recebe 'sortField', 'sortDirection', e 'onSort'
const ReceitasTable = ({ receitas, onVisualizar, onDownload, sortField, sortDirection, onSort }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            {/* Agora o onSort é conectado à função do componente pai */}
            <TableHeader 
              label="Data"
              field="createdAt"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            <TableHeader 
              label="Paciente"
              field="paciente"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
            />
            
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Medicamentos
            </th>

            <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {!receitas || receitas.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500 text-sm">
                Nenhuma receita encontrada.
              </td>
            </tr>
          ) : (
            receitas.map((receita) => (
              <tr key={receita.batchId} className="hover:bg-blue-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(receita.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {receita.paciente?.nome} {receita.paciente?.sobrenome}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={receita.medicamentos.map(m => m.nomeMedicamento).join(', ')}>
                  {receita.medicamentos.map(m => m.nomeMedicamento).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => onVisualizar(receita)} className="text-blue-600 hover:text-blue-800" title="Visualizar Detalhes">
                      <ViewIcon />
                    </button>
                    <button onClick={() => onDownload(receita.batchId)} className="text-green-600 hover:text-green-800" title="Baixar Receita em PDF">
                      <DownloadIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReceitasTable;