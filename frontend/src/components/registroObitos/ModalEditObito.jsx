import React, { useState, useEffect } from "react";
import moment from "moment";
import { FaStethoscope, FaFileMedical, FaCalendarAlt, FaInfoCircle, FaMapMarkerAlt, FaClipboardList, FaSave, FaTimes, FaUserMd } from "react-icons/fa"; // Added FaUserMd

// Função para formatar CPF com pontuação
const formatarCpfComPontuacao = (cpf) => {
  if (!cpf) return "";
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return cpf;
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9)}`;
};

const ModalEditObito = ({
  isOpen,
  onClose,
  onSubmit,
  obito,
  pacientes, // Lista de todos os pacientes para encontrar o nome
  profissionais, // Lista de todos os profissionais
  isSaving,
}) => {
  const [formData, setFormData] = useState({
    cpfPaciente: "", // Será preenchido pelo 'obito' e não será alterável
    matriculaProfissional: "", // Será preenchido pelo 'obito' e não será alterável
    dataObito: "",
    causaObito: "",
    localObito: "",
    numeroAtestadoObito: "",
    observacoes: "",
    status: "Ativo",
  });
  const [displayPacienteInfo, setDisplayPacienteInfo] = useState("");
  const [displayProfissionalInfo, setDisplayProfissionalInfo] = useState(""); // Novo estado para info do profissional
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (obito) {
      const cpfOriginalFormatado = formatarCpfComPontuacao(obito.cpfPaciente);
      const originalMatriculaProfissional = obito.matriculaProfissional ? parseInt(obito.matriculaProfissional, 10).toString() : "";

      setFormData({
        cpfPaciente: cpfOriginalFormatado,
        matriculaProfissional: originalMatriculaProfissional, // Armazena a matrícula original
        dataObito: obito.dataObito
          ? moment(obito.dataObito).format("YYYY-MM-DDTHH:mm")
          : "",
        causaObito: obito.causaObito || "",
        localObito: obito.localObito || "",
        numeroAtestadoObito: obito.numeroAtestadoObito || "",
        observacoes: obito.observacoes || "",
        status: obito.status || "Ativo",
      });

      // Encontra e define a informação do paciente para exibição
      const pacienteInfo = pacientes.find(p => formatarCpfComPontuacao(p.cpf) === cpfOriginalFormatado);
      if (pacienteInfo) {
        setDisplayPacienteInfo(`${pacienteInfo.nome} ${pacienteInfo.sobrenome || ""} (${cpfOriginalFormatado})`);
      } else {
        setDisplayPacienteInfo(`CPF: ${cpfOriginalFormatado} (Informações do paciente não encontradas)`);
      }

      // Encontra e define a informação do profissional para exibição
      if (originalMatriculaProfissional && profissionais) {
        const profissionalInfo = profissionais.find(p => parseInt(p.matricula, 10).toString() === originalMatriculaProfissional);
        if (profissionalInfo) {
          setDisplayProfissionalInfo(`${profissionalInfo.nome} ${profissionalInfo.sobrenome || ""} (${originalMatriculaProfissional})`);
        } else {
          setDisplayProfissionalInfo(`Matrícula: ${originalMatriculaProfissional} (Profissional não encontrado na lista)`);
        }
      } else {
        setDisplayProfissionalInfo("Profissional não informado ou lista indisponível");
      }

      setErrors({});
    }
  }, [obito, pacientes, profissionais]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    // Não há validação para cpfPaciente e matriculaProfissional aqui, pois são fixos.
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

    // Envia formData diretamente. cpfPaciente e matriculaProfissional já estão corretos.
    const submitData = {
        ...formData,
        // matriculaProfissional já está no formato correto em formData
        dataObito: moment(formData.dataObito).isValid()
            ? moment(formData.dataObito).format("YYYY-MM-DD HH:mm") // Formato esperado pelo backend
            : formData.dataObito,
    };
    console.log("Dados enviados para edição:", submitData);
    onSubmit(obito.idRegistroObito, submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative transform transition-all">
        <div className="flex items-center gap-3 mb-6">
          <FaStethoscope className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Editar Registro de Óbito</h2>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
          disabled={isSaving}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Paciente (Não alterável)
              </label>
              <input
                type="text"
                value={displayPacienteInfo}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserMd className="h-4 w-4 text-blue-500" /> {/* Ícone alterado/adicionado */}
                Profissional Responsável (Não alterável)
              </label>
              <input
                type="text"
                value={displayProfissionalInfo}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data do Óbito <span className="text-red-500">*</span>
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
              {errors.dataObito && <p className="text-red-500 text-xs mt-1 pl-1">{errors.dataObito}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Causa do Óbito <span className="text-red-500">*</span>
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
              {errors.causaObito && <p className="text-red-500 text-xs mt-1 pl-1">{errors.causaObito}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                Local do Óbito <span className="text-red-500">*</span>
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
              {errors.localObito && <p className="text-red-500 text-xs mt-1 pl-1">{errors.localObito}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                Nº Atestado de Óbito <span className="text-red-500">*</span>
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
              {errors.numeroAtestadoObito && <p className="text-red-500 text-xs mt-1 pl-1">{errors.numeroAtestadoObito}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status <span className="text-red-500">*</span>
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

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm disabled:opacity-50" disabled={isSaving} aria-label="Cancelar edição">
              <FaTimes className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button 
              type="submit" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50" 
              disabled={isSaving} // O botão Salvar não depende mais de profissionais.length
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