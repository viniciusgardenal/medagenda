import React, { useState } from "react";

const StepMedico = ({ setValue, medicos, resetSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedico, setSelectedMedico] = useState(null);

  const handleSearch = () => {
    const termoBusca = searchTerm.toLowerCase();
    // console.log("Medicos:", medicos);

    const medico = medicos.find(
      (m) =>
        m.crm.toLowerCase().includes(termoBusca) ||
        `${m.nome}`.toLowerCase().includes(termoBusca)
    );
    if (medico) {
      setSelectedMedico(medico);
      setValue("medicoId", medico.matricula, { shouldValidate: true });
    } else {
      setSelectedMedico(null);
      setValue("medicoId", "", { shouldValidate: true });
      alert("Médico não encontrado.");
    }
  };

  // Expose reset function via prop
  React.useImperativeHandle(resetSearch, () => ({
    reset: () => {
      setSearchTerm("");
      setSelectedMedico(null);
    },
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">Buscar Médico</h4>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite o nome ou CRM do médico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>
      {selectedMedico && (
        <p className="text-sm text-gray-600">
          Médico selecionado: {selectedMedico.nome} ({selectedMedico.crm})
        </p>
      )}
    </div>
  );
};

// Wrap with forwardRef to allow parent to call reset
export default React.forwardRef((props, ref) => (
  <StepMedico {...props} resetSearch={ref} />
));
