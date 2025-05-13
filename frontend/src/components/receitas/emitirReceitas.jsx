import React, { useState, useEffect } from "react";
import { getPacientes, getMedicamentos } from "../../config/apiServices";
import ReceitasTable from "./ReceitasTable";
import ReceitaModal from "./ReceitaModal";
import ViewReceitas from "./ViewReceitas";
import { FaPlus, FaEye } from "react-icons/fa";

const EmitirReceitas = () => {
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [idMedicamentos, setIdMedicamentos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState(null);

  useEffect(() => {
    const loadDados = async () => {
      try {
        const paciente = await getPacientes();
        if (Array.isArray(paciente.data)) {
          setCpfPaciente(paciente.data);
        }

        const medicamento = await getMedicamentos();
        if (Array.isArray(medicamento.data)) {
          setIdMedicamentos(medicamento.data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };

    loadDados();
  }, []);

  const handleAddReceita = (novaReceita) => {
    setReceitas([...receitas, novaReceita]);
  };

  const handleVisualizar = (receita) => {
    setSelectedReceita(receita);
    setIsViewModalOpen(true);
  };

  const ultimasReceitas = receitas.slice(0, 5);

  return (
    <section className="max-w-6xl mx-auto mt-10 px-6 py-8 bg-gray-50 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">
          Emitir Receitas Médicas
        </h2>
        <button
          onClick={() => setIsReceitaModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="h-5 w-5" />
          Nova Receita
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total de Receitas
          </h3>
          <p className="text-2xl font-bold text-blue-600">{receitas.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Pacientes Cadastrados
          </h3>
          <p className="text-2xl font-bold text-blue-600">{cpfPaciente.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Medicamentos Disponíveis
          </h3>
          <p className="text-2xl font-bold text-blue-600">{idMedicamentos.length}</p>
        </div>
      </div>

      {/* Últimas Receitas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Últimas Receitas Emitidas
          </h3>
          {receitas.length > 0 && (
            <button
              onClick={() => setIsViewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              <FaEye className="h-4 w-4" />
              Visualizar Todas
            </button>
          )}
        </div>

        {ultimasReceitas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma receita emitida recentemente.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Medicamentos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimasReceitas.map((receita, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(receita.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receita.paciente?.nome || "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {receita.medicamentos?.map((med) => med.nome).join(", ") || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modais */}
      <ReceitaModal
        isOpen={isReceitaModalOpen}
        onClose={() => setIsReceitaModalOpen(false)}
        pacientes={cpfPaciente}
        medicamentos={idMedicamentos}
        onAddReceita={handleAddReceita}
      />

      <ViewReceitas
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        receita={selectedReceita}
      />
    </section>
  );
};

export default EmitirReceitas;
