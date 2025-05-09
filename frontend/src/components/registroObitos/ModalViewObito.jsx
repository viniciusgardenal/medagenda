import React from "react";
import { FaStethoscope, FaCalendarAlt, FaFileMedical, FaMapMarkerAlt, FaClipboardList, FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";

const ModalViewObito = ({
  isOpen,
  onClose,
  obito,
  pacientes,
  profissionais,
  onEdit,
  onDelete,
}) => {
  // Verifica se a modal deve ser aberta
  if (!isOpen || !obito) return null;

  // Função para normalizar CPF (remover pontuação)
  const normalizarCpf = (cpf) => {
    if (!cpf) return "";
    return typeof cpf === "string" ? cpf.replace(/\D/g, "") : "";
  };

  // Função para normalizar matrícula (converter para string)
  const normalizarMatricula = (matricula) => {
    if (!matricula) return "";
    return typeof matricula === "number" ? matricula.toString() : matricula.toString().trim();
  };

  // Depuração: Logar dados recebidos
  console.log("Obito recebido:", obito);
  console.log("Pacientes disponíveis:", pacientes);
  console.log("Profissionais disponíveis:", profissionais);

  // Busca paciente e profissional
  const paciente = pacientes?.find((p) => {
    const cpfPacienteNormalizado = normalizarCpf(obito.cpfPaciente);
    const cpfListaNormalizado = normalizarCpf(p.cpf);
    const match = cpfPacienteNormalizado === cpfListaNormalizado;
    if (!match) {
      console.log(
        `CPF não corresponde: obito.cpfPaciente=${obito.cpfPaciente} (normalizado: ${cpfPacienteNormalizado}), paciente.cpf=${p.cpf} (normalizado: ${cpfListaNormalizado})`
      );
    }
    return match;
  });

  const profissional = profissionais?.find((p) => {
    const matriculaObitoNormalizada = normalizarMatricula(obito.matriculaProfissional);
    const matriculaListaNormalizada = normalizarMatricula(p.matricula);
    const match = matriculaObitoNormalizada === matriculaListaNormalizada;
    if (!match) {
      console.log(
        `Matrícula não corresponde: obito.matriculaProfissional=${obito.matriculaProfissional} (normalizado: ${matriculaObitoNormalizada}), profissional.matricula=${p.matricula} (normalizado: ${matriculaListaNormalizada})`
      );
    }
    return match;
  });

  console.log("Paciente encontrado:", paciente);
  console.log("Profissional encontrado:", profissional);

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative transform transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <FaStethoscope className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Detalhes do Registro de Óbito</h3>
        </div>

        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
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

        {/* Conteúdo */}
        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* Paciente */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Paciente
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {paciente
                  ? `${paciente.nome} ${paciente.sobrenome || ""} (CPF: ${obito.cpfPaciente})`
                  : `Não encontrado (CPF: ${obito.cpfPaciente || "Inválido"})`}
              </dd>
            </div>

            {/* Profissional */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Profissional Responsável
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {profissional
                  ? `${profissional.nome} ${profissional.sobrenome || ""} (Matrícula: ${obito.matriculaProfissional})`
                  : `Não encontrado (Matrícula: ${obito.matriculaProfissional || "Inválida"})`}
              </dd>
            </div>

            {/* Data do Óbito */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data do Óbito
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{formatDate(obito.dataObito)}</dd>
            </div>

            {/* Causa do Óbito */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Causa do Óbito
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{obito.causaObito || "Não definida"}</dd>
            </div>

            {/* Local do Óbito */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                Local do Óbito
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{obito.localObito || "Não definido"}</dd>
            </div>

            {/* Nº Atestado de Óbito */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                Nº Atestado de Óbito
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{obito.numeroAtestadoObito || "Não definido"}</dd>
            </div>

            {/* Observações */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Observações
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{obito.observacoes || "Não definidas"}</dd>
            </div>

            {/* Status */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{obito.status || "Não definido"}</dd>
            </div>
          </dl>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Editar registro"
          >
            <FaEdit className="h-4 w-4 mr-2" />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            aria-label="Excluir registro"
          >
            <FaTrash className="h-4 w-4 mr-2" />
            Excluir
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewObito;