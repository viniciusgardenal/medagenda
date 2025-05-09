import React, { useState, useEffect } from "react";
import moment from "moment";

// Função para formatar CPF com pontuação
const formatarCpfComPontuacao = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return cpf;
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9)}`;
};

const ModalEditObito = ({
  isOpen,
  onClose,
  onSubmit,
  obito,
  pacientes,
  profissionais,
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    cpfPaciente: "",
    matriculaProfissional: "",
    dataObito: "",
    causaObito: "",
    localObito: "",
    numeroAtestadoObito: "",
    observacoes: "",
    status: "Ativo",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (obito) {
      const normalizedCpf = obito.cpfPaciente ? obito.cpfPaciente.replace(/\D/g, "") : "";
      const cpfComPontuacao = formatarCpfComPontuacao(normalizedCpf);
      // Verificar se o CPF do obito existe na lista de pacientes
      const pacienteExiste = pacientes.find(
        (p) => p.cpf === cpfComPontuacao
      );
      console.log("CPF inicial do obito:", normalizedCpf, "Com pontuação:", cpfComPontuacao);
      console.log("Paciente existe na lista?", !!pacienteExiste);
      console.log("Lista de pacientes:", pacientes);

      setFormData({
        cpfPaciente: pacienteExiste ? cpfComPontuacao : (pacientes[0]?.cpf || ""),
        matriculaProfissional: obito.matriculaProfissional || "",
        dataObito: obito.dataObito
          ? moment(obito.dataObito).format("YYYY-MM-DDTHH:mm")
          : "",
        causaObito: obito.causaObito || "",
        localObito: obito.localObito || "",
        numeroAtestadoObito: obito.numeroAtestadoObito || "",
        observacoes: obito.observacoes || "",
        status: obito.status || "Ativo",
      });
      setErrors({});
    }
  }, [obito, pacientes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cpfPaciente) {
      newErrors.cpfPaciente = "CPF do paciente é obrigatório.";
    } else {
      const cpfComPontuacao = formatarCpfComPontuacao(formData.cpfPaciente);
      if (!pacientes.find((p) => p.cpf === cpfComPontuacao)) {
        newErrors.cpfPaciente = "CPF do paciente não encontrado.";
      }
    }
    if (!formData.matriculaProfissional) {
      newErrors.matriculaProfissional = "Matrícula do profissional é obrigatória.";
    } else {
      const normalizedMatricula = parseInt(formData.matriculaProfissional, 10).toString();
      if (!profissionais.find((p) => parseInt(p.matricula, 10).toString() === normalizedMatricula)) {
        newErrors.matriculaProfissional = "Profissional não encontrado.";
      }
    }
    if (!formData.dataObito) newErrors.dataObito = "Data do óbito é obrigatória.";
    if (!formData.causaObito) newErrors.causaObito = "Causa do óbito é obrigatória.";
    if (!formData.localObito) newErrors.localObito = "Local do óbito é obrigatório.";
    if (!formData.numeroAtestadoObito) {
      newErrors.numeroAtestadoObito = "Número do atestado de óbito é obrigatório.";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const normalizedData = {
      ...formData,
      cpfPaciente: formatarCpfComPontuacao(formData.cpfPaciente), // Envia com pontuação
      matriculaProfissional: parseInt(formData.matriculaProfissional, 10).toString(),
      dataObito: moment(formData.dataObito).isValid()
        ? moment(formData.dataObito).format("YYYY-MM-DD HH:mm")
        : formData.dataObito,
    };

    console.log("Dados enviados para edição:", normalizedData);
    onSubmit(obito.idRegistroObito, normalizedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Editar Registro de Óbito</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Paciente</label>
            <select
              name="cpfPaciente"
              value={formData.cpfPaciente}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cpfPaciente ? "border-red-500" : "border-gray-300"
              }`}
              disabled={pacientes.length === 0}
            >
              {pacientes.length === 0 ? (
                <option value="">Nenhum paciente disponível</option>
              ) : (
                <>
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.cpf} value={paciente.cpf}>
                      {`${paciente.nome} ${paciente.sobrenome || ""} (${paciente.cpf})`}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.cpfPaciente && (
              <p className="text-red-500 text-xs mt-1">{errors.cpfPaciente}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profissional</label>
            <select
              name="matriculaProfissional"
              value={formData.matriculaProfissional}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.matriculaProfissional ? "border-red-500" : "border-gray-300"
              }`}
              disabled={profissionais.length === 0}
            >
              {profissionais.length === 0 ? (
                <option value="">Nenhum profissional disponível</option>
              ) : (
                <>
                  <option value="">Selecione um profissional</option>
                  {profissionais.map((profissional) => (
                    <option key={profissional.matricula} value={profissional.matricula}>
                      {`${profissional.nome} ${profissional.sobrenome || ""} (${profissional.matricula})`}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.matriculaProfissional && (
              <p className="text-red-500 text-xs mt-1">{errors.matriculaProfissional}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Data do Óbito</label>
            <input
              type="datetime-local"
              name="dataObito"
              value={formData.dataObito}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.dataObito ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dataObito && (
              <p className="text-red-500 text-xs mt-1">{errors.dataObito}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Causa do Óbito</label>
            <input
              type="text"
              name="causaObito"
              value={formData.causaObito}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.causaObito ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.causaObito && (
              <p className="text-red-500 text-xs mt-1">{errors.causaObito}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Local do Óbito</label>
            <input
              type="text"
              name="localObito"
              value={formData.localObito}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.localObito ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.localObito && (
              <p className="text-red-500 text-xs mt-1">{errors.localObito}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número do Atestado de Óbito
            </label>
            <input
              type="text"
              name="numeroAtestadoObito"
              value={formData.numeroAtestadoObito}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.numeroAtestadoObito ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.numeroAtestadoObito && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroAtestadoObito}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-sm"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              disabled={isSaving || pacientes.length === 0}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditObito;