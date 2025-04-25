import React, { useState, useEffect } from "react";
import {
  getPacientes,
  getProfissionais,
  getTipoConsulta,
  agendarConsulta,
  getConsultasPorData,
} from "../../config/apiServices";
import ModalAddConsulta from "./ModalAddConsulta";
import ModalViewConsulta from "./ModalViewConsulta";
import Pagination from "../util/Pagination";

// Componente para cada linha da tabela
const TableRow = ({ consulta, onView, onCancel, formatarDataHoraBR }) => {
  const isAgendada = consulta.status === "agendada";
  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.paciente.nome} {consulta.paciente.sobrenome}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.medico.nome} {consulta.medico.crm}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.tipoConsulta.nomeTipoConsulta}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{consulta.motivo}</td>
      <td className="px-4 py-3 flex gap-3">
        <button
          onClick={() => onView(consulta)}
          className="text-blue-500 hover:text-blue-700"
          title="Visualizar Consulta"
        >
          <svg
            xmlns="[invalid url, do not cite]"
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
              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        {isAgendada && (
          <button
            onClick={() => onCancel(consulta)}
            className="text-red-500 hover:text-red-700"
            title="Cancelar Consulta"
          >
            <svg
              xmlns="[invalid url, do not cite]"
              className="h-5 w-5"
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
        )}
      </td>
    </tr>
  );
};

const AgendamentoConsulta = () => {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [dadosConsulta, setDadosConsulta] = useState({
    pacienteId: "",
    medicoId: "",
    idTipoConsulta: "",
    dataConsulta: "",
    horaConsulta: "",
    motivo: "",
    responsavelAgendamento: "",
  });
  const [filtros, setFiltros] = useState({
    filtroNome: "",
    filtroData: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";
    try {
      const [ano, mes, dia] = data.split("-");
      const dataBR = `${dia}/${mes}/${ano}`;
      const horaBR = hora.split(":").slice(0, 2).join(":");
      return `${dataBR} - ${horaBR}`;
    } catch (error) {
      return `${data} - ${hora}`;
    }
  };

  const sortConsultas = (consultas) => {
    return [...consultas].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        medico: (item) =>
          `${item.medico.nome} ${item.medico.sobrenome}`.toLowerCase(),
        tipo: (item) => item.tipoConsulta.nome.toLowerCase(),
        horario: (item) => item.horaConsulta,
        motivo: (item) => item.motivo.toLowerCase(),
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA > valueB ? direction : -direction;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          consultasResponse,
          pacientesResponse,
          medicosResponse,
          tiposConsultaResponse,
        ] = await Promise.all([
          getConsultasPorData(filtros.filtroData),
          getPacientes(),
          getProfissionais(),
          getTipoConsulta(),
        ]);

        setConsultas(
          consultasResponse.data.filter((c) => c.status === "agendada")
        );
        setPacientes(pacientesResponse.data);
        setMedicos(medicosResponse.data);
        setTiposConsulta(tiposConsultaResponse.data);

        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filtros.filtroData]);

  const consultasFiltradas = consultas.filter((consulta) => {
    const { filtroNome } = filtros;
    if (!filtroNome) return true;
    const termoBusca = filtroNome.toLowerCase();
    return (
      consulta.paciente.nome.toLowerCase().includes(termoBusca) ||
      `${consulta.medico.nome} ${consulta.medico.sobrenome}`
        .toLowerCase()
        .includes(termoBusca) ||
      consulta.tipoConsulta.nome.toLowerCase().includes(termoBusca) ||
      formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)
        .toLowerCase()
        .includes(termoBusca) ||
      consulta.motivo.toLowerCase().includes(termoBusca)
    );
  });

  const consultasOrdenadasFiltradas = sortConsultas(consultasFiltradas);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultas = consultasOrdenadasFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSalvarConsulta = async () => {
    setError(null);
    try {
      const consultaData = {
        ...dadosConsulta,
        status: "agendada",
      };
      const response = await agendarConsulta(consultaData);
      setConsultas([...consultas, response.data]);
      setModalAddOpen(false);
      setDadosConsulta({
        pacienteId: "",
        medicoId: "",
        idTipoConsulta: "",
        dataConsulta: "",
        horaConsulta: "",
        motivo: "",
        responsavelAgendamento: "",
      });
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      setError("Erro ao salvar a consulta. Tente novamente.");
    }
  };

  const openAddModal = () => {
    setDadosConsulta({
      pacienteId: "",
      medicoId: "",
      idTipoConsulta: "",
      dataConsulta: "",
      horaConsulta: "",
      motivo: "",
      responsavelAgendamento: "",
    });
    setModalAddOpen(true);
  };

  const openViewModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setModalViewOpen(true);
  };

  const handleCancelConsulta = async (consulta) => {
    setError(null);
    try {
      // Simula chamada à API para cancelar consulta
      const updatedConsulta = { ...consulta, status: "cancelada" };
      setConsultas(
        consultas.map((c) => (c.id === consulta.id ? updatedConsulta : c))
      );
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      setError("Erro ao cancelar consulta. Tente novamente.");
    }
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalViewOpen(false);
    setConsultaSelecionada(null);
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

  return (
    <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600">
            Agendamento de Consultas
          </h2>
          <button
            onClick={openAddModal}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <svg
              xmlns="[invalid url, do not cite]"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova Consulta
          </button>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome
            </label>
            <input
              type="text"
              placeholder="Digite o nome do paciente ou médico..."
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filtros.filtroNome}
              onChange={(e) =>
                setFiltros({ ...filtros, filtroNome: e.target.value })
              }
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Data da Consulta
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filtros.filtroData}
              onChange={(e) =>
                setFiltros({ ...filtros, filtroData: e.target.value })
              }
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Carregando consultas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {[
                    "Paciente",
                    "Médico",
                    "Tipo de Consulta",
                    "Data - Hora",
                    "Motivo",
                    "Ações",
                  ].map((header, index) => (
                    <th
                      key={header}
                      onClick={() =>
                        ["nome", "medico", "tipo", "horario", "motivo"][
                          index
                        ] &&
                        handleSort(
                          ["nome", "medico", "tipo", "horario", "motivo"][index]
                        )
                      }
                      className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                        index === 0 ? "rounded-tl-lg" : ""
                      } ${index === 5 ? "rounded-tr-lg" : ""} ${
                        [
                          "nome",
                          "medico",
                          "tipo",
                          "horario",
                          "motivo",
                        ].includes(sortField) &&
                        sortField ===
                          ["nome", "medico", "tipo", "horario", "motivo"][index]
                          ? "bg-blue-700"
                          : ""
                      }`}
                    >
                      {header}
                      {sortField ===
                        ["nome", "medico", "tipo", "horario", "motivo"][
                          index
                        ] && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentConsultas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Nenhuma consulta agendada para esta data.
                    </td>
                  </tr>
                ) : (
                  currentConsultas.map((consulta) => (
                    <TableRow
                      key={consulta.id}
                      consulta={consulta}
                      onView={openViewModal}
                      onCancel={handleCancelConsulta}
                      formatarDataHoraBR={formatarDataHoraBR}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {consultasOrdenadasFiltradas.length > 0 && (
          <Pagination
            totalItems={consultasOrdenadasFiltradas.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        )}

        {modalAddOpen && (
          <ModalAddConsulta
            isOpen={modalAddOpen}
            onClose={closeModal}
            dadosConsulta={dadosConsulta}
            setDadosConsulta={setDadosConsulta}
            onSave={handleSalvarConsulta}
            pacientes={pacientes}
            medicos={medicos}
            tiposConsulta={tiposConsulta}
          />
        )}

        {modalViewOpen && consultaSelecionada && (
          <ModalViewConsulta
            isOpen={modalViewOpen}
            onClose={closeModal}
            consulta={consultaSelecionada}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}
      </div>
    </div>
  );
};

export default AgendamentoConsulta;
