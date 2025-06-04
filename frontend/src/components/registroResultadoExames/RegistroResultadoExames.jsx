import React, { useState, useEffect } from "react";
import {
  getRegistrosInativosResultadoExames,
  atualizarRegistroResultadoExame,
} from "../../config/apiServices";
import ModalEditObservacao from "./ModalEditObservacao";
import ModalAddObservacao from "./modalAddObservacao";
import ModalViewObservacao from "./ModalViewObservacao";
import FiltroRegistroResultadoExames from "./filtroRegistroResultadoExames";
import Pagination from "../util/Pagination";
// FaEdit e FaEye serão substituídos por SVGs. FaSyncAlt parece não utilizado.
import { FaPlus, FaCheckCircle, /*FaEdit, FaEye, FaSyncAlt,*/ FaFileMedical } from "react-icons/fa";

// Componente SVG para o ícone de Visualizar
const ViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Componente SVG para o ícone de Editar
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

// Componente para cada linha da tabela
const TableRow = ({ registro, onAdd, onEdit, onView }) => {
  const resultadoDefinido =
    registro.observacoes && registro.observacoes.trim() !== "";

  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{registro.idRegistro}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {registro.solicitacaoExame?.tipoExame.nomeTipoExame || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {new Date(registro.solicitacaoExame.dataSolicitacao).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {registro.profissional.nome || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {registro.paciente.nome || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {resultadoDefinido ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white shadow-sm">
            <FaCheckCircle className="h-4 w-4" />
            Registrado
          </span>
        ) : (
          <button
            onClick={() => onAdd(registro)}
            className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition"
          >
            <FaPlus className="h-4 w-4" />
            Definir
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
        <button
          onClick={() => onEdit(registro)}
          className="text-yellow-500 hover:text-yellow-700 transition-colors"
          title="Editar Resultado"
          aria-label="Editar resultado do exame"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onView(registro)}
          className="text-blue-600 hover:text-blue-700 transition-colors"
          title="Visualizar Resultado"
          aria-label="Visualizar resultado do exame"
        >
          <ViewIcon />
        </button>
      </td>
    </tr>
  );
};

const RegistroResultadoExames = () => {
  const [registros, setRegistros] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [observacaoEditada, setObservacaoEditada] = useState("");
  const [filtros, setFiltros] = useState({ filtroId: "", filtroNome: "", filtroNomeExame: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("idRegistro");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRegistrosInativosResultadoExames();
      setRegistros(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      setError("Erro ao carregar os registros. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortRegistros = (registrosToSort) => {
    return [...registrosToSort].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        idRegistro: (item) => item.idRegistro,
        nomeExame: (item) => (item.solicitacaoExame?.tipoExame.nomeTipoExame || "").toLowerCase(),
        dataSolicitacao: (item) => new Date(item.solicitacaoExame.dataSolicitacao),
        profissional: (item) => (item.profissional.nome || "").toLowerCase(),
        paciente: (item) => (item.paciente.nome || "").toLowerCase(),
        status: (item) => (item.observacoes && item.observacoes.trim() !== "" ? "registrado" : "definir"),
      };

      valueA = fieldMap[sortField] ? fieldMap[sortField](a) : (sortField === "idRegistro" ? 0 : (sortField === "dataSolicitacao" ? new Date(0) : ""));
      valueB = fieldMap[sortField] ? fieldMap[sortField](b) : (sortField === "idRegistro" ? 0 : (sortField === "dataSolicitacao" ? new Date(0) : ""));
      
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortField === "dataSolicitacao") {
        return (valueA.getTime() - valueB.getTime()) * direction;
      }
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }
      return String(valueA).localeCompare(String(valueB)) * direction;
    });
  };

  const handleFiltroChange = (novosFiltros) => {
    setFiltros(novosFiltros);
    setCurrentPage(1);
  };

  const registrosFiltrados = registros.filter((registro) => {
    const { filtroId, filtroNome, filtroNomeExame } = filtros;

    const idMatch = filtroId
      ? String(registro.idRegistro).toLowerCase().includes(filtroId.toLowerCase()) ||
        String(registro.solicitacaoExame.idSolicitacaoExame).toLowerCase().includes(filtroId.toLowerCase())
      : true;

    const nomeMatch = filtroNome
      ? (registro.profissional.nome || "").toLowerCase().includes(filtroNome.toLowerCase()) ||
        (registro.paciente.nome || "").toLowerCase().includes(filtroNome.toLowerCase()) ||
        (registro.observacoes && registro.observacoes.toLowerCase().includes(filtroNome.toLowerCase()))
      : true;

    const nomeExameMatch = filtroNomeExame
      ? (registro.solicitacaoExame?.tipoExame.nomeTipoExame || "").toLowerCase().includes(filtroNomeExame.toLowerCase())
      : true;

    return idMatch && nomeMatch && nomeExameMatch;
  });

  const registrosOrdenadosFiltrados = sortRegistros(registrosFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRegistros = registrosOrdenadosFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const handleUpdateObservacao = async (idRegistro) => {
    setError(null);
    try {
      await atualizarRegistroResultadoExame(idRegistro, {
        observacoes: observacaoEditada,
      });
      // Re-fetch data to get the updated list including the one just changed
      // Note: getRegistrosInativosResultadoExames might not return it if it became "ativo" implicitly by having observacoes.
      // For simplicity, we call fetchData() which re-fetches all.
      fetchData(); 
      setModalAddOpen(false);
      setModalEditOpen(false);
      setObservacaoEditada("");
      setRegistroSelecionado(null);
    } catch (error) {
      console.error("Erro ao atualizar observação:", error);
      setError("Erro ao atualizar o resultado. Tente novamente.");
    }
  };

  const openAddModal = (registro) => {
    setRegistroSelecionado(registro);
    setObservacaoEditada(registro.observacoes || "");
    setModalAddOpen(true);
  };

  const openEditModal = (registro) => {
    setRegistroSelecionado(registro);
    setObservacaoEditada(registro.observacoes || "");
    setModalEditOpen(true);
  };

  const openViewModal = (registro) => {
    setRegistroSelecionado(registro);
    setModalViewOpen(true);
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalEditOpen(false);
    setModalViewOpen(false);
    setRegistroSelecionado(null);
    setObservacaoEditada("");
  };

  const examesPendentes = registros.filter(
    (registro) => !registro.observacoes || registro.observacoes.trim() === ""
  ).length;

  const examesRegistrados = registros.length - examesPendentes;

  const tableHeaders = ["ID Registro", "Nome do Exame", "Data da Solicitação", "Profissional", "Paciente", "Status Resultado", "Ações"];
  const sortableFields = ["idRegistro", "nomeExame", "dataSolicitacao", "profissional", "paciente", "status" /* Status para ordenação */];


  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Cabeçalho */}
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            <FaFileMedical className="h-7 w-7" />
            Resultados de Exames
          </h2>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
            {error}
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Total de Registros
            </h3>
            <p className="text-2xl font-bold text-blue-600">{registros.length}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Exames Pendentes
            </h3>
            <p className="text-2xl font-bold text-orange-500">{examesPendentes}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg shadow">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Exames Registrados
            </h3>
            <p className="text-2xl font-bold text-green-600">{examesRegistrados}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg shadow">
          <FiltroRegistroResultadoExames onFiltroChange={handleFiltroChange} />
        </div>

        {/* Tabela de Registros */}
        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm">Carregando registros...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={header}
                      onClick={() => sortableFields[index] && handleSort(sortableFields[index])}
                      className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider ${sortableFields[index] ? 'cursor-pointer' : ''}`}
                    >
                      {header}
                      {sortableFields[index] && sortField === sortableFields[index] && (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRegistros.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      {registrosFiltrados.length === 0 && (filtros.filtroId || filtros.filtroNome || filtros.filtroNomeExame)
                        ? "Nenhum registro encontrado após filtragem."
                        : "Nenhum registro encontrado."
                      }
                    </td>
                  </tr>
                ) : (
                  currentRegistros.map((registro) => (
                    <TableRow
                      key={registro.idRegistro}
                      registro={registro}
                      onAdd={openAddModal}
                      onEdit={openEditModal}
                      onView={openViewModal}
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginação */}
        {registrosOrdenadosFiltrados.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              totalItems={registrosOrdenadosFiltrados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        {/* Modals */}
        {modalAddOpen && registroSelecionado && (
          <ModalAddObservacao
            isOpen={modalAddOpen}
            onClose={closeModal}
            registro={registroSelecionado}
            observacaoEditada={observacaoEditada}
            setObservacaoEditada={setObservacaoEditada}
            onSave={handleUpdateObservacao} // Usar a mesma função de update, já que adicionar é definir 'observacoes'
          />
        )}

        {modalEditOpen && registroSelecionado && (
          <ModalEditObservacao
            isOpen={modalEditOpen}
            onClose={closeModal}
            registro={registroSelecionado}
            observacaoEditada={observacaoEditada}
            setObservacaoEditada={setObservacaoEditada}
            onSave={handleUpdateObservacao}
          />
        )}

        {modalViewOpen && registroSelecionado && (
          <ModalViewObservacao
            isOpen={modalViewOpen}
            onClose={closeModal}
            registro={registroSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default RegistroResultadoExames;