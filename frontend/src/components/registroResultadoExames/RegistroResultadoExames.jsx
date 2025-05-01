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
import { FaPlus, FaEdit, FaEye, FaCheckCircle, FaSyncAlt, FaFileMedical } from "react-icons/fa";

// Componente para cada linha da tabela
const TableRow = ({ registro, onAdd, onEdit, onView }) => {
  const resultadoDefinido =
    registro.observacoes && registro.observacoes.trim() !== "";

  return (
    <tr className="hover:bg-gray-100 transition-colors">
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{registro.idRegistro}</td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {registro.solicitacaoExame?.tipoExame.nomeTipoExame || "N/A"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {new Date(registro.solicitacaoExame.dataSolicitacao).toLocaleDateString("pt-BR")}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {registro.profissional.nome || "N/A"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {registro.paciente.nome || "N/A"}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {resultadoDefinido ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow">
            <FaCheckCircle className="h-4 w-4" />
            Registrado
          </span>
        ) : (
          <button
            onClick={() => onAdd(registro)}
            className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2 py-1 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
          >
            <FaPlus className="h-4 w-4" />
            Definir
          </button>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap flex gap-2">
        <button
          onClick={() => onEdit(registro)}
          className="text-green-500 hover:text-green-700"
          title="Editar Resultado"
          aria-label="Editar resultado do exame"
        >
          <FaEdit className="h-5 w-5" />
        </button>
        <button
          onClick={() => onView(registro)}
          className="text-blue-500 hover:text-blue-700"
          title="Visualizar Resultado"
          aria-label="Visualizar resultado do exame"
        >
          <FaEye className="h-5 w-5" />
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

  const sortRegistros = (registros) => {
    return [...registros].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        idRegistro: (item) => item.idRegistro,
        nomeExame: (item) => item.solicitacaoExame?.tipoExame.nomeTipoExame.toLowerCase() || "",
        dataSolicitacao: (item) =>
          new Date(item.solicitacaoExame.dataSolicitacao),
        profissional: (item) => item.profissional.nome.toLowerCase() || "",
        paciente: (item) => item.paciente.nome.toLowerCase() || "",
        status: (item) =>
          item.observacoes && item.observacoes.trim() !== ""
            ? "registrado"
            : "definir",
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);
      if (sortField === "dataSolicitacao") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA > valueB ? direction : -direction;
    });
  };

  const handleFiltroChange = (novosFiltros) => {
    setFiltros(novosFiltros);
    setCurrentPage(1); // Resetar a página ao mudar os filtros
  };

  const registrosFiltrados = registros.filter((registro) => {
    const { filtroId, filtroNome, filtroNomeExame } = filtros;

    // Filtro por ID
    const idMatch = filtroId
      ? String(registro.idRegistro)
          .toLowerCase()
          .includes(filtroId.toLowerCase()) ||
        String(registro.solicitacaoExame.idSolicitacaoExame)
          .toLowerCase()
          .includes(filtroId.toLowerCase())
      : true;

    // Filtro por nome (profissional, paciente ou observações)
    const nomeMatch = filtroNome
      ? registro.profissional.nome
          .toLowerCase()
          .includes(filtroNome.toLowerCase()) ||
        registro.paciente.nome
          .toLowerCase()
          .includes(filtroNome.toLowerCase()) ||
        (registro.observacoes &&
          registro.observacoes.toLowerCase().includes(filtroNome.toLowerCase()))
      : true;

    // Filtro por nome do exame
    const nomeExameMatch = filtroNomeExame
      ? registro.solicitacaoExame?.tipoExame.nomeTipoExame
          .toLowerCase()
          .includes(filtroNomeExame.toLowerCase())
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
      const response = await getRegistrosInativosResultadoExames();
      setRegistros(response.data.data || []);
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

  return (
    <section className="max-w-6xl mx-auto mt-6 px-4 py-6 bg-gray-50 rounded-2xl shadow-lg">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaFileMedical className="h-6 w-6" />
          Resultados de Exames
        </h2>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Total de Registros
          </h3>
          <p className="text-xl font-bold text-blue-600">{registros.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Exames Pendentes
          </h3>
          <p className="text-xl font-bold text-blue-600">{examesPendentes}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Exames Registrados
          </h3>
          <p className="text-xl font-bold text-blue-600">{examesRegistrados}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <FiltroRegistroResultadoExames onFiltroChange={handleFiltroChange} />
      </div>

      {/* Tabela de Registros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        {isLoading ? (
          <p className="text-center text-gray-500 py-2">Carregando registros...</p>
        ) : registrosOrdenadosFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-2">
            Nenhum registro encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "ID Registro",
                    "Nome do Exame",
                    "Data da Solicitação",
                    "Profissional",
                    "Paciente",
                  ].map((header, index) => (
                    <th
                      key={header}
                      onClick={() =>
                        handleSort(
                          [
                            "idRegistro",
                            "nomeExame",
                            "dataSolicitacao",
                            "profissional",
                            "paciente",
                          ][index]
                        )
                      }
                      className="px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer"
                    >
                      {header}
                      {sortField ===
                        [
                          "idRegistro",
                          "nomeExame",
                          "dataSolicitacao",
                          "profissional",
                          "paciente",
                        ][index] && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer">
                    Definir Resultado
                  </th>
                  <th className="px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRegistros.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-3 text-center text-gray-500 text-sm"
                    >
                      Nenhum registro encontrado.
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
          </div>
        )}
      </div>

      {/* Paginação */}
      {registrosOrdenadosFiltrados.length > 0 && (
        <div className="mb-6">
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
          onSave={handleUpdateObservacao}
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
  );
};

export default RegistroResultadoExames;