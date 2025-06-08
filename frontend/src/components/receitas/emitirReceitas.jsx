import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getPacientes,
  getMedicamentos,
  lerReceitas,
  criarReceita,
  downloadReceita,
} from "../../config/apiServices";
import ReceitaModal from "./ReceitaModal";
import ViewReceitas from "./ViewReceitas";
import Pagination from "../util/Pagination";
import TableHeader from "./TableHeader";
import { FaPlus, FaBookMedical, FaFilter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ícones SVG para as ações
const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const EmitirReceitas = () => {
  // Estados de dados e UI
  const [pacientes, setPacientes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState(null);

  // Estados para Filtro, Ordenação e Paginação
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroMedicamento, setFiltroMedicamento] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pacientesRes, medicamentosRes, receitasRes] = await Promise.all([
        getPacientes(),
        getMedicamentos(),
        lerReceitas(),
      ]);
      setPacientes(pacientesRes.data);
      setMedicamentos(medicamentosRes.data);
      setReceitas(receitasRes.data);
    } catch (error) {
      toast.error("Falha ao carregar dados essenciais.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddReceita = async (novaReceitaData) => {
    try {
      await criarReceita(novaReceitaData);
      toast.success("Receita emitida com sucesso!");
      await fetchData();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Erro ao salvar a receita.");
      return false;
    }
  };

  const handleDownloadReceita = async (batchId) => {
    try {
      const response = await downloadReceita(batchId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receita_${batchId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Não foi possível baixar a receita em PDF.");
    }
  };
  const handleViewReceita = (receita) => {
    setSelectedReceita(receita);
    setIsViewModalOpen(true);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Processamento dos dados: Filtro -> Ordenação -> Paginação
  const processedReceitas = useMemo(() => {
    let items = [...receitas];

    // 1. Filtragem
    if (filtroPaciente) {
      items = items.filter((receita) =>
        `${receita.paciente?.nome} ${receita.paciente?.sobrenome}`
          .toLowerCase()
          .includes(filtroPaciente.toLowerCase())
      );
    }

    if (filtroMedicamento) {
      items = items.filter((receita) =>
        receita.medicamentos.some((medicamento) =>
          medicamento.nomeMedicamento
            .toLowerCase()
            .includes(filtroMedicamento.toLowerCase())
        )
      );
    }

    // 2. Ordenação
    items.sort((a, b) => {
      let valA, valB;
      if (sortField === "paciente") {
        valA = `${a.paciente?.nome ?? ""} ${a.paciente?.sobrenome ?? ""}`
          .trim()
          .toLowerCase();
        valB = `${b.paciente?.nome ?? ""} ${b.paciente?.sobrenome ?? ""}`
          .trim()
          .toLowerCase();
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return items;
  }, [receitas, filtroPaciente, filtroMedicamento, sortField, sortDirection]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReceitas = processedReceitas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />

        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            <FaBookMedical />
            Emissão de Receitas
          </h2>
          <button
            onClick={() => setIsReceitaModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Nova Receita
          </button>
        </div>

        {/* Blocos de estatísticas com o estilo COMPACTO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-800">
              Total de Receitas
            </h3>
            <p className="text-lg font-bold text-blue-600 bg-white px-2.5 py-0.5 rounded-full">
              {receitas.length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-between">
            <h3 className="text-sm font-semibold text-green-800">Pacientes</h3>
            <p className="text-lg font-bold text-green-600 bg-white px-2.5 py-0.5 rounded-full">
              {pacientes.length}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center justify-between">
            <h3 className="text-sm font-semibold text-yellow-800">
              Medicamentos
            </h3>
            <p className="text-lg font-bold text-yellow-600 bg-white px-2.5 py-0.5 rounded-full">
              {medicamentos.length}
            </p>
          </div>
        </div>

        {/* Seção de Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex-1">
            <label
              htmlFor="filtroPaciente"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              <FaFilter className="inline-block mr-2 h-3 w-3" />
              Filtrar por Paciente
            </label>
            <input
              id="filtroPaciente"
              type="text"
              value={filtroPaciente}
              onChange={(e) => {
                setFiltroPaciente(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Digite o nome do paciente..."
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="filtroMedicamento"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              <FaFilter className="inline-block mr-2 h-3 w-3" />
              Filtrar por Medicamento
            </label>
            <input
              id="filtroMedicamento"
              type="text"
              value={filtroMedicamento}
              onChange={(e) => {
                setFiltroMedicamento(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Digite o nome do medicamento..."
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">
              Carregando receitas...
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <TableHeader
                    label="Data"
                    field="createdAt"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHeader
                    label="Paciente"
                    field="paciente"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Medicamentos
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentReceitas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      {receitas.length > 0
                        ? "Nenhum resultado para o filtro aplicado."
                        : "Nenhuma receita emitida."}
                    </td>
                  </tr>
                ) : (
                  currentReceitas.map((receita) => (
                    <tr
                      key={receita.batchId}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(receita.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {receita.paciente?.nome} {receita.paciente?.sobrenome}
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate"
                        title={receita.medicamentos
                          .map((m) => m.nomeMedicamento)
                          .join(", ")}
                      >
                        {receita.medicamentos
                          .map((m) => m.nomeMedicamento)
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleViewReceita(receita)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Visualizar Detalhes"
                          >
                            <ViewIcon />
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadReceita(receita.batchId)
                            }
                            className="text-green-600 hover:text-green-800"
                            title="Baixar Receita em PDF"
                          >
                            <DownloadIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {processedReceitas.length > itemsPerPage && (
          <Pagination
            totalItems={processedReceitas.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {isReceitaModalOpen && (
          <ReceitaModal
            isOpen={isReceitaModalOpen}
            onClose={() => setIsReceitaModalOpen(false)}
            pacientes={pacientes}
            medicamentos={medicamentos}
            onAddReceita={handleAddReceita}
          />
        )}
        {isViewModalOpen && (
          <ViewReceitas
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            receita={selectedReceita}
          />
        )}
      </section>
    </div>
  );
};

export default EmitirReceitas;
