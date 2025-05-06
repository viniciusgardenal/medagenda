import React from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";

const CadastroPacienteModal = ({
  isOpen,
  onClose,
  novoPaciente,
  setNovoPaciente,
  onCadastrar,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoPaciente({ ...novoPaciente, [name]: value });
  };

  const BUTTON_CLASSES = {
    primary:
      "px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700",
    secondary:
      "px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Cadastrar Novo Paciente
        </h3>
        <div className="space-y-4">
          <InputField
            label="Nome"
            name="nome"
            value={novoPaciente.nome}
            onChange={handleChange}
            required
          />
          <InputField
            label="Sobrenome"
            name="sobrenome"
            value={novoPaciente.sobrenome}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Sexo"
            name="sexo"
            value={novoPaciente.sexo}
            onChange={handleChange}
            options={[
              { value: "M", label: "Masculino" },
              { value: "F", label: "Feminino" },
              { value: "O", label: "Outro" },
            ]}
            placeholder="Selecione"
            required
          />
          <InputField
            label="CPF"
            name="cpf"
            value={novoPaciente.cpf}
            onChange={handleChange}
            required
          />
          <InputField
            label="Data de Nascimento"
            name="dataNascimento"
            value={novoPaciente.dataNascimento}
            onChange={handleChange}
            type="date"
            required
          />
          <InputField
            label="Endereço"
            name="endereco"
            value={novoPaciente.endereco}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            name="email"
            value={novoPaciente.email}
            onChange={handleChange}
            type="email"
          />
          <InputField
            label="Telefone"
            name="telefone"
            value={novoPaciente.telefone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className={BUTTON_CLASSES.secondary}>
            Cancelar
          </button>
          <button onClick={onCadastrar} className={BUTTON_CLASSES.primary}>
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroPacienteModal;