import React, { useState } from "react";

const StepPaciente = ({
  setValue,
  pacientes,
  onCadastrarPaciente,
  resetSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  const handleSearch = () => {
    // console.log("oiiiiiiii:", setDadosConsulta);

    const termoBusca = searchTerm.toLowerCase();
    const paciente = pacientes.find(
      (p) =>
        p.cpf.toLowerCase().includes(termoBusca) ||
        `${p.nome} ${p.sobrenome}`.toLowerCase().includes(termoBusca)
    );
    if (paciente) {
      // console.log("Paciente encontrado:", paciente);

      setSelectedPaciente(paciente);
      // Use setValue para atualizar o campo do formulário
      setValue("cpfPaciente", paciente.cpf, { shouldValidate: true });
    } else {
      setSelectedPaciente(null);
      // Use setValue para limpar o campo do formulário
      setValue("cpfPaciente", "", { shouldValidate: true });
      alert("Paciente não encontrado.");
    }
  };

  // Expose reset function via prop
  React.useImperativeHandle(resetSearch, () => ({
    reset: () => {
      setSearchTerm("");
      setSelectedPaciente(null);
    },
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">Buscar Paciente</h4>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Digite o CPF ou nome do paciente..."
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
      {selectedPaciente && (
        <p className="text-sm text-gray-600">
          Paciente selecionado: {selectedPaciente.nome}{" "}
          {selectedPaciente.sobrenome} ({selectedPaciente.cpf})
        </p>
      )}
      <button
        onClick={onCadastrarPaciente}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
      >
        Paciente não encontrado? Cadastrar novo
      </button>
    </div>
  );
};

// Wrap with forwardRef to allow parent to call reset
export default React.forwardRef((props, ref) => (
  <StepPaciente {...props} resetSearch={ref} />
));
