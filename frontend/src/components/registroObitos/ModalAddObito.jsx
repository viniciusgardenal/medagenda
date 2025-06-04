import React, { useState } from "react";

const ModalAddObito = ({ isOpen, onClose, onSubmit, pacientes, profissionais, isSaving }) => {
  const [formData, setFormData] = useState({
    cpfPaciente: "",
    matriculaProfissional: "",
    dataObito: "",
    causaObito: "",
    localObito: "",
    numeroAtestadoObito: "",
    observacoes: "",
    status: "Ativo", // Status padrão
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validação básica no frontend pode ser adicionada aqui se necessário,
    // mas o backend já possui validações robustas.
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          Adicionar Registro de Óbito
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Paciente (CPF) <span className="text-red-500">*</span>
              </label>
              <select
                name="cpfPaciente"
                value={formData.cpfPaciente}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um paciente</option>
                {Array.isArray(pacientes) && pacientes.length > 0 ? (
                  pacientes.map((paciente) => (
                    <option key={paciente.cpf} value={paciente.cpf}>
                      {paciente.nome} {paciente.sobrenome || ""} ({paciente.cpf})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Nenhum paciente disponível (Carregue a lista de pacientes)
                  </option>
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Profissional (Matrícula) <span className="text-red-500">*</span>
              </label>
              <select
                name="matriculaProfissional"
                value={formData.matriculaProfissional}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um profissional</option>
                {Array.isArray(profissionais) && profissionais.length > 0 ? (
                  profissionais.map((profissional) => (
                    <option key={profissional.matricula} value={profissional.matricula}>
                      {profissional.nome} {profissional.sobrenome || ""} ({profissional.matricula})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Nenhum profissional disponível (Carregue a lista de profissionais)
                  </option>
                )}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Data do Óbito <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="dataObito"
                value={formData.dataObito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Causa do Óbito <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="causaObito"
                value={formData.causaObito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Local do Óbito <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="localObito"
                value={formData.localObito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Número do Atestado de Óbito <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numeroAtestadoObito"
                value={formData.numeroAtestadoObito}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3" // Ajustado para 3 linhas, pode ser o que preferir
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg text-sm"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm"
              disabled={isSaving || pacientes.length === 0 || profissionais.length === 0} // Desabilita se não houver pacientes/profissionais
            >
              {isSaving ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddObito;