import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaMedicamentos = ({ medicamentos, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome do Medicamento</th>
          <th className="px-4 py-3 font-medium">Fabricante</th>
          <th className="px-4 py-3 font-medium">Controlado</th>
          <th className="px-4 py-3 font-medium">Descrição</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {medicamentos.map((medicamento) => (
          <tr key={medicamento.idMedicamento} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">{medicamento.nomeMedicamento}</td>
            <td className="px-4 py-3">{medicamento.nomeFabricante}</td>
            <td className="px-4 py-3">{medicamento.controlado}</td>
            <td className="px-4 py-3">{medicamento.descricao}</td>
            <td className="px-4 py-3 flex space-x-2">
              <button
                onClick={() => onDetalhes(medicamento.idMedicamento)}
                title="Visualizar"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEditar(medicamento.idMedicamento)}
                title="Editar"
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluir(medicamento.idMedicamento)}
                title="Excluir"
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelaMedicamentos;