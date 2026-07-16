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
import { Eye, Download } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />

        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Emitir Receitas</h2>
            <p className="text-sm text-slate-500 mt-0.5">Prescrições e receituários médicos</p>
          </div>
          <button
            onClick={() => setIsReceitaModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
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
              className="block text-sm font-medium text-slate-700 mb-1.5"
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
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
              placeholder="Digite o nome do paciente..."
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="filtroMedicamento"
              className="block text-sm font-medium text-slate-700 mb-1.5"
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
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
              placeholder="Digite o nome do medicamento..."
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">
              Carregando receitas...
            </p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200">
                    Medicamentos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentReceitas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-slate-400 text-sm"
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
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {new Date(receita.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                        {receita.paciente?.nome} {receita.paciente?.sobrenome}
                      </td>
                      <td
                        className="px-4 py-3.5 text-sm text-slate-600 max-w-xs truncate"
                        title={receita.medicamentos
                          .map((m) => m.nomeMedicamento)
                          .join(", ")}
                      >
                        {receita.medicamentos
                          .map((m) => m.nomeMedicamento)
                          .join(", ")}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReceita(receita)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Visualizar Detalhes"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadReceita(receita.batchId)
                            }
                            className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Baixar Receita em PDF"
                          >
                            <Download size={15} />
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
