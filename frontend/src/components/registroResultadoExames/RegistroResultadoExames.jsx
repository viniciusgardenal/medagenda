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
import { FaPlus, FaCheckCircle, FaFileMedical } from "react-icons/fa";
import { Eye, Pencil, Check, Plus } from "lucide-react";
import TableHeader from "../util/TableHeader";

const TableRow = ({ registro, onAdd, onEdit, onView }) => {
  const resultadoDefinido =
    registro.observacoes && registro.observacoes.trim() !== "";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700">{registro.idRegistro}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {registro.solicitacaoExame?.tipoExame.nomeTipoExame || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {new Date(registro.solicitacaoExame.dataSolicitacao).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {registro.profissional.nome || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {registro.paciente.nome || "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {resultadoDefinido ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Check size={12} />
            Registrado
          </span>
        ) : (
          <button
            onClick={() => onAdd(registro)}
            className="inline-flex items-center gap-1 rounded-md bg-amber-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 transition-colors"
          >
            <Plus size={12} />
            Definir
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(registro)}
            className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            title="Editar Resultado"
            aria-label="Editar resultado do exame"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onView(registro)}
            className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            title="Visualizar Resultado"
            aria-label="Visualizar resultado do exame"
          >
            <Eye size={15} />
          </button>
        </div>
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
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        {/* Cabeçalho */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Resultados de Exames</h2>
            <p className="text-sm text-slate-500 mt-0.5">Lançamento e controle de resultados</p>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" role="alert">
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
        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm">Carregando registros...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <TableHeader label="ID Registro" field="idRegistro" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Nome do Exame" field="nomeExame" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Data da Solicitação" field="dataSolicitacao" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Profissional" field="profissional" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Paciente" field="paciente" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Status Resultado" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
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