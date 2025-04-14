import React, { useState, useEffect } from "react";
import { getPacientes, getMedicamentos } from "../../config/apiServices";
import ReceitasTable from "./ReceitasTable";
import ReceitaModal from "./ReceitaModal";
import ViewReceitas from "./ViewReceitas";

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
        setIdMedicamentos(medicamento.data);
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

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">
        Emitir Receita
      </h2>

      <div className="mb-4">
        <button
          onClick={() => setIsReceitaModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nova Receita
        </button>

      </div>

      <ReceitasTable receitas={receitas} onVisualizar={handleVisualizar} />

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
    </div>
  );
};

export default EmitirReceitas;