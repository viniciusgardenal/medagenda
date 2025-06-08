import React, { useState } from "react";
import ReceitaForm from "./receitaForm"; // Componente que busca os dados do profissional logado
import Select from "react-select";
import { FaPlus, FaTrash, FaBookMedical } from "react-icons/fa";

// Estilos customizados para o `react-select` para padronizar com o layout
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // Borda azul no foco
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    borderRadius: "0.5rem", // rounded-lg
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
      ? "#dbeafe"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
    "&:active": {
      backgroundColor: "#1e40af",
    },
  }),
};

const ReceitaModal = ({
  isOpen,
  onClose,
  pacientes,
  medicamentos,
  onAddReceita,
}) => {
  const [cpfPaciente, setCpfPaciente] = useState(null);
  const [itensReceita, setItensReceita] = useState([
    { id: Date.now(), idMedicamento: null, dosagem: "", instrucaoUso: "" },
  ]);
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const pacienteOptions = pacientes.map((p) => ({
    value: p.cpf,
    label: `${p.nome} ${p.sobrenome} (CPF: ${p.cpf})`,
  }));
  const medicamentoOptions = medicamentos.map((m) => ({
    value: m.idMedicamento,
    label: m.nomeMedicamento,
  }));

  const handleAdicionarItem = () => {
    setItensReceita([
      ...itensReceita,
      { id: Date.now(), idMedicamento: null, dosagem: "", instrucaoUso: "" },
    ]);
  };

  const handleRemoverItem = (id) => {
    if (itensReceita.length > 1) {
      setItensReceita(itensReceita.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItensReceita(
      itensReceita.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const medicamentosValidos = itensReceita.filter(
      (item) => item.idMedicamento && item.dosagem && item.instrucaoUso
    );

    if (!cpfPaciente || medicamentosValidos.length === 0) {
      alert(
        "Selecione um paciente e preencha ao menos um medicamento completo."
      );
      return;
    }

    setIsSaving(true);
    const receitaData = {
      cpfPaciente: cpfPaciente.value,
      matriculaProfissional,
      medicamentos: medicamentosValidos.map(({ id, ...med }) => ({
        ...med,
        idMedicamento: med.idMedicamento.value,
      })),
    };

    const success = await onAddReceita(receitaData);
    setIsSaving(false);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl w-full m-4 transform transition-all">
        <header className="flex items-center justify-between pb-4 border-b mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaBookMedical className="text-blue-600" />
            Emitir Nova Receita
          </h3>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[75vh] overflow-y-auto pr-3"
        >
          {/* Seção de Dados do Paciente e Profissional */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <ReceitaForm onMatriculaChange={setMatriculaProfissional} />
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Paciente
              </label>
              <Select
                styles={customSelectStyles}
                options={pacienteOptions}
                value={cpfPaciente}
                onChange={setCpfPaciente}
                placeholder="Selecione o Paciente..."
                required
              />
            </div>
          </div>

          {/* Seção de Prescrição */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Prescrição
            </label>
            {itensReceita.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg border-2 border-gray-100 space-y-4 relative"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm text-blue-700">
                    Medicamento {index + 1}
                  </p>
                  {itensReceita.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoverItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                <Select
                  styles={customSelectStyles}
                  options={medicamentoOptions}
                  value={item.idMedicamento}
                  onChange={(val) =>
                    handleItemChange(item.id, "idMedicamento", val)
                  }
                  placeholder="Selecione o medicamento..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    value={item.dosagem}
                    onChange={(e) =>
                      handleItemChange(item.id, "dosagem", e.target.value)
                    }
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Dosagem e via de administração. Ex: 1 comprimido, via oral, a cada 8 horas."
                    required
                  />
                  <textarea
                    value={item.instrucaoUso}
                    onChange={(e) =>
                      handleItemChange(item.id, "instrucaoUso", e.target.value)
                    }
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Instruções e duração. Ex: Tomar durante 7 dias."
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAdicionarItem}
              className="w-full flex items-center justify-center gap-2 text-sm py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <FaPlus size={12} />
              Adicionar Medicamento
            </button>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSaving ? "Salvando..." : "Salvar Receita"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReceitaModal;
