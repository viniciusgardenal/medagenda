import React, { useState, useEffect } from "react";
import {
  criarAtestado,
  getPacientes,
  getProfissionais,
  lerAtestados,
  downloadAtestado,
} from "../../config/apiServices";
import ModalAddAtestado from "./modalAddAtestado";
import ModalViewAtestados from "./modalViewAtestado";
import { FaPlus, FaEye, FaSyncAlt } from "react-icons/fa";

const GerarAtestados = () => {
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [atestados, setAtestados] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dadosAtestado, setDadosAtestado] = useState({
    cpfPaciente: "",
    matriculaProfissional: "",
    tipoAtestado: "",
    motivo: "",
    observacoes: "",
    status: "Ativo",
  });

  const loadDados = async () => {
    setIsLoading(true);
    try {
      const pacientesResponse = await getPacientes();
      if (Array.isArray(pacientesResponse.data)) {
        setPacientes(pacientesResponse.data);
      } else {
        console.error("Os dados de pacientes não são um array", pacientesResponse.data);
      }

      const profissionaisResponse = await getProfissionais();
      if (Array.isArray(profissionaisResponse.data)) {
        setProfissionais(profissionaisResponse.data);
      } else {
        console.error("Os dados de profissionais não são um array", profissionaisResponse.data);
      }

      try {
        const atestadosResponse = await lerAtestados();
        if (Array.isArray(atestadosResponse.data)) {
          setAtestados(atestadosResponse.data);
        } else {
          console.error("Os dados de atestados não são um array", atestadosResponse.data);
          setAtestados([]);
        }
      } catch (error) {
        console.error("Erro ao carregar atestados:", error);
        setAtestados([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDados();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dadosParaEnviar = {
        ...dadosAtestado,
        matriculaProfissional: [{ matricula: dadosAtestado.matriculaProfissional }],
      };

      const response = await criarAtestado(dadosParaEnviar);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `atestado_${dadosAtestado.cpfPaciente}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        const atestadosResponse = await lerAtestados();
        if (Array.isArray(atestadosResponse.data)) {
          setAtestados(atestadosResponse.data);
        }
      } catch (error) {
        console.error("Erro ao atualizar a lista de atestados:", error);
      }

      setDadosAtestado({
        cpfPaciente: "",
        matriculaProfissional: "",
        tipoAtestado: "",
        motivo: "",
        observacoes: "",
        status: "Ativo",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Erro ao gerar atestado", error);
      alert("Erro ao gerar atestado. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (atestado) => {
    try {
      const response = await downloadAtestado(atestado.idAtestado);
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `atestado_${atestado.idAtestado}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar atestado", error);
      alert("Erro ao baixar atestado. Tente novamente.");
    }
  };

  const handleRefresh = () => {
    loadDados();
  };

  const ultimosAtestados = atestados.slice(0, 5); // Mostra apenas os 5 primeiros atestados

  return (
    <section className="max-w-6xl mx-auto mt-10 px-6 py-8 bg-gray-50 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">
          Gerar Atestados Médicos
        </h2>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <FaSyncAlt className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Atualizando..." : "Atualizar Dados"}
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total de Atestados
          </h3>
          <p className="text-2xl font-bold text-blue-600">{atestados.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Pacientes Cadastrados
          </h3>
          <p className="text-2xl font-bold text-blue-600">{pacientes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Profissionais Disponíveis
          </h3>
          <p className="text-2xl font-bold text-blue-600">{profissionais.length}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="h-5 w-5" />
          Novo Atestado
        </button>
        <button
          onClick={() => setIsViewModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-colors"
        >
          <FaEye className="h-5 w-5" />
          Visualizar Todos os Atestados
        </button>
      </div>

      {/* Últimos Atestados */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Últimos Atestados Criados
        </h3>
        {ultimosAtestados.length === 0 ? (
          <p className="text-base text-gray-500 text-center py-4">
            Nenhum atestado criado recentemente.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Data de Emissão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Profissional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimosAtestados.map((atestado) => (
                  <tr key={atestado.idAtestado}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(atestado.dataEmissao).toLocaleString('pt-PT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atestado.Paciente ? `${atestado.Paciente.nome} ${atestado.Paciente.sobrenome || ""}` : "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atestado.Profissional ? atestado.Profissional.nome : "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atestado.tipoAtestado || "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atestado.status || "Não definido"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModalAddAtestado
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        dadosAtestado={dadosAtestado}
        setDadosAtestado={setDadosAtestado}
        onSave={handleSave}
        isSaving={isSaving}
        pacientes={pacientes}
        profissionais={profissionais}
      />

      <ModalViewAtestados
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        atestados={atestados}
        onDownload={handleDownload}
      />
    </section>
  );
};

export default GerarAtestados;