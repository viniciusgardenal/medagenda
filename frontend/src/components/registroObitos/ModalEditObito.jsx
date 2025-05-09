import React, { useState, useEffect } from "react";
import moment from "moment";
import { FaStethoscope, FaFileMedical, FaCalendarAlt, FaInfoCircle, FaMapMarkerAlt, FaClipboardList, FaSave, FaTimes } from "react-icons/fa";

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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative transform transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <FaStethoscope className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Registro de Óbito</h2>
        </div>

        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
          disabled={isSaving}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* Paciente */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Paciente
              </label>
              <select
                name="cpfPaciente"
                value={formData.cpfPaciente}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.cpfPaciente ? "border-red-500" : "border-gray-300"
                }`}
                disabled={pacientes.length === 0 || isSaving}
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
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.cpfPaciente}</p>
              )}
            </div>

            {/* Profissional */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Profissional Responsável
              </label>
              <select
                name="matriculaProfissional"
                value={formData.matriculaProfissional}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.matriculaProfissional ? "border-red-500" : "border-gray-300"
                }`}
                disabled={profissionais.length === 0 || isSaving}
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
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.matriculaProfissional}</p>
              )}
            </div>

            {/* Data do Óbito */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data do Óbito
              </label>
              <input
                type="datetime-local"
                name="dataObito"
                value={formData.dataObito}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.dataObito ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.dataObito && (
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.dataObito}</p>
              )}
            </div>

            {/* Causa do Óbito */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Causa do Óbito
              </label>
              <input
                type="text"
                name="causaObito"
                value={formData.causaObito}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.causaObito ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.causaObito && (
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.causaObito}</p>
              )}
            </div>

            {/* Local do Óbito */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                Local do Óbito
              </label>
              <input
                type="text"
                name="localObito"
                value={formData.localObito}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.localObito ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.localObito && (
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.localObito}</p>
              )}
            </div>

            {/* Número do Atestado de Óbito */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                Nº Atestado de Óbito
              </label>
              <input
                type="text"
                name="numeroAtestadoObito"
                value={formData.numeroAtestadoObito}
                onChange={handleChange}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.numeroAtestadoObito ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSaving}
              />
              {errors.numeroAtestadoObito && (
                <p className="text-red-500 text-xs mt-1 pl-6">{errors.numeroAtestadoObito}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={isSaving}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            {/* Observações */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors h-24"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm disabled:opacity-50"
              disabled={isSaving}
              aria-label="Cancelar edição"
            >
              <FaTimes className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              disabled={isSaving || pacientes.length === 0}
              aria-label="Salvar alterações"
            >
              <FaSave className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditObito;