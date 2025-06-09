import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  criarAtestado,
  lerAtestados,
  downloadAtestadoPdf,
  getPacientes,
} from "../../config/apiServices";
import ModalAddAtestado from "./modalAddAtestado";
import ModalDetalhesAtestado from "./modalDetalhesAtestado";
import TableHeader from "../util/TableHeader";
import Pagination from "../util/Pagination";
import { FaPlus } from "react-icons/fa";
import moment from "moment";

const GerarAtestados = () => {
  // --- Estados ---
  const [atestados, setAtestados] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAtestado, setSelectedAtestado] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sortField, setSortField] = useState("dataEmissao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filtros, setFiltros] = useState({ paciente: "", profissional: "", tipo: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [dadosAtestado, setDadosAtestado] = useState({
    cpfPaciente: "",
    matriculaProfissional: "",
    tipoAtestado: "Médico",
    motivo: "",
    observacoes: "",
  });

  const loadDados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const [atestadosRes, pacientesRes] = await Promise.all([
        lerAtestados(),
        getPacientes(),
      ]);
      const validAtestados = (Array.isArray(atestadosRes?.data) ? atestadosRes.data : []).filter(
        (a) => a && a.paciente && a.profissional
      );
      setAtestados(validAtestados);
      setPacientes(Array.isArray(pacientesRes.data) ? pacientesRes.data : []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const dadosParaEnviar = { ...dadosAtestado };
      const response = await criarAtestado(dadosParaEnviar);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `atestado_${dadosAtestado.cpfPaciente}.pdf`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch?.length === 2) fileName = fileNameMatch[1];
      }
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Atestado gerado com sucesso!");
      setIsAddModalOpen(false);
      await loadDados();
    } catch (error) {
      console.error("Erro ao gerar atestado:", error);
      const errorMessage = error.response?.data?.error || "Erro ao gerar atestado.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async (atestado) => {
    setError(null);
    try {
      const response = await downloadAtestadoPdf(atestado.idAtestado);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `atestado_${atestado.idAtestado}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar atestado:", error);
      setError("Erro ao baixar o PDF do atestado.");
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const openDetailsModal = (atestado) => {
    setSelectedAtestado(atestado);
    setIsDetailsModalOpen(true);
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
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

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const atestadosProcessados = useMemo(() => {
    let result = [...atestados];

    // 1. Filtragem
    result = result.filter(
      (a) =>
        `${a.paciente?.nome} ${a.paciente?.sobrenome}`.toLowerCase().includes(filtros.paciente.toLowerCase()) &&
        (a.profissional?.nome || "").toLowerCase().includes(filtros.profissional.toLowerCase()) &&
        (a.tipoAtestado || "").toLowerCase().includes(filtros.tipo.toLowerCase())
    );

    // 2. Ordenação
    result.sort((a, b) => {
      let valueA, valueB;
      if (sortField === "paciente") {
        valueA = `${a.paciente?.nome ?? ""} ${a.paciente?.sobrenome ?? ""}`.trim();
        valueB = `${b.paciente?.nome ?? ""} ${b.paciente?.sobrenome ?? ""}`.trim();
      } else if (sortField === "profissional") {
        valueA = a.profissional?.nome ?? "";
        valueB = b.profissional?.nome ?? "";
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }

      const direction = sortDirection === "asc" ? 1 : -1;

      // Tratar valores nulos ou vazios
      if (valueA == null || valueA === "") return 1 * direction;
      if (valueB == null || valueB === "") return -1 * direction;

      // Lógica específica para datas
      if (sortField === "dataEmissao") {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return (dateA.getTime() - dateB.getTime()) * direction;
      }

      // Lógica padrão para texto
      return String(valueA).toLowerCase().localeCompare(String(valueB).toLowerCase()) * direction;
    });

    return result;
  }, [atestados, sortField, sortDirection, filtros]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAtestados = atestadosProcessados.slice(indexOfFirstItem, indexOfLastItem);

  const tableHeaders = [
    { label: "Data", field: "dataEmissao" },
    { label: "Paciente", field: "paciente" },
    { label: "Profissional", field: "profissional" },
    { label: "Tipo", field: "tipoAtestado" },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600">Gerenciar Atestados</h2>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus /> Novo Atestado
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label htmlFor="filtroPaciente" className="block text-sm font-semibold text-gray-700 mb-1">
              Paciente
            </label>
            <input
              id="filtroPaciente"
              type="text"
              name="paciente"
              value={filtros.paciente}
              onChange={handleFiltroChange}
              placeholder="Filtrar por paciente..."
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroProfissional" className="block text-sm font-semibold text-gray-700 mb-1">
              Profissional
            </label>
            <input
              id="filtroProfissional"
              type="text"
              name="profissional"
              value={filtros.profissional}
              onChange={handleFiltroChange}
              placeholder="Filtrar por profissional..."
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroTipo" className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de Atestado
            </label>
            <input
              id="filtroTipo"
              type="text"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFiltroChange}
              placeholder="Filtrar por tipo..."
              className="w-full px-3 py-2 text-sm border rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr className="bg-blue-600">
                {tableHeaders.map((header) => (
                  <TableHeader
                    key={header.field}
                    {...header}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                ))}
                <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={tableHeaders.length + 1} className="p-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : currentAtestados.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length + 1} className="p-4 text-center text-gray-500">
                    Nenhum atestado encontrado.
                  </td>
                </tr>
              ) : (
                currentAtestados.map((atestado) => (
                  <tr key={atestado.idAtestado} className="hover:bg-blue-50">
                    <td className="px-6 py-4 text-sm">{moment(atestado.dataEmissao).format("DD/MM/YYYY")}</td>
                    <td className="px-6 py-4 text-sm font-medium">{`${atestado.paciente.nome} ${atestado.paciente.sobrenome}`}</td>
                    <td className="px-6 py-4 text-sm">{atestado.profissional.nome}</td>
                    <td className="px-6 py-4 text-sm">{atestado.tipoAtestado}</td>
                    <td className="px-6 py-4 text-sm flex justify-center gap-4">
                      <button
                        onClick={() => openDetailsModal(atestado)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Visualizar Detalhes"
                      >
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
                      </button>
                      <button
                        onClick={() => handleDownload(atestado)}
                        className="text-green-600 hover:text-green-800"
                        title="Baixar PDF"
                      >
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
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {atestadosProcessados.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              totalItems={atestadosProcessados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        <ModalAddAtestado
          isOpen={isAddModalOpen}
          onClose={closeAllModals}
          onSave={handleSave}
          isSaving={isSaving}
          pacientes={pacientes}
          dadosAtestado={dadosAtestado}
          setDadosAtestado={setDadosAtestado}
        />
        <ModalDetalhesAtestado
          isOpen={isDetailsModalOpen}
          onClose={closeAllModals}
          atestado={selectedAtestado}
        />
      </section>
    </div>
  );
};

export default GerarAtestados;