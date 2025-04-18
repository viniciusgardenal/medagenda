import React, { useState, useEffect } from "react";
import { getConsultasPorData, realizarCheckIn } from "../../config/apiServices";
import ModalAddCheckIn from "./ModalAddCheckIn";
import ModalEditCheckIn from "./ModalEditCheckIn";
import ModalViewCheckIn from "./ModalViewCheckIn";
import Pagination from "../util/Pagination";

// Componente para cada linha da tabela
const TableRow = ({
  consulta,
  onAdd,
  onEdit,
  onView,
  getPrioridadeLegenda,
  formatarDataHoraBR,
}) => {
  // console.log(consulta);

  const checkInRealizado =
    consulta.checkin && consulta.checkin.status === "registrado";
  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.paciente.nome} {consulta.paciente.sobrenome}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.medico.nome} {consulta.medico.crm}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {getPrioridadeLegenda(
          consulta.checkin
            ? consulta.checkin.prioridade
            : consulta.prioridade || 0
        )}
      </td>
      <td className="px-4 py-3">
        {checkInRealizado ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Chegada Confirmada
          </span>
        ) : (
          <button
            onClick={() => onAdd(consulta)}
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
            title="Registrar Chegada"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
            Registrar Chegada
          </button>
        )}
      </td>
      <td className="px-4 py-3 flex gap-3">
        {checkInRealizado && (
          <>
            <button
              onClick={() => onEdit(consulta.checkin)}
              className="text-green-500 hover:text-green-700"
              title="Editar Check-In"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onView(consulta.checkin)}
              className="text-blue-500 hover:text-blue-700"
              title="Visualizar Check-In"
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
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

const CheckInPacientes = () => {
  const [consultas, setConsultas] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [checkInSelecionado, setCheckInSelecionado] = useState(null);
  const [dadosCheckIn, setDadosCheckIn] = useState({
    pressaoArterial: "",
    temperatura: "",
    peso: "",
    altura: "",
    observacoes: "",
    prioridade: 0,
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

  const getPrioridadeLegenda = (prioridade) => {
    switch (prioridade) {
      case 0:
        return "Normal";
      case 1:
        return "Média";
      case 2:
        return "Alta";
      default:
        return "Normal";
    }
  };

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
          `${item.profissionais.nome} ${item.profissionais.sobrenome}`.toLowerCase(),
        horario: (item) => item.horaConsulta,
        prioridade: (item) =>
          item.checkin ? item.checkin.prioridade : item.prioridade || 0,
        status: (item) =>
          item.checkin && item.checkin.status === "registrado"
            ? "chegada confirmada"
            : "registrar chegada",
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
        const consultasResponse = await getConsultasPorData(filtros.filtroData);
        // console.log(consultasResponse.data);

        const consultasDoDia = consultasResponse.data.filter((consulta) => {
          const agora = new Date();
          const dataConsulta = new Date(
            `${consulta.dataConsulta}T${consulta.horaConsulta}`
          );
          return consulta.status === "agendada" && dataConsulta > agora;
        });
        setConsultas(consultasDoDia);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar as consultas. Tente novamente mais tarde.");
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
      `${consulta.profissionais.nome} ${consulta.profissionais.sobrenome}`
        .toLowerCase()
        .includes(termoBusca) ||
      formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)
        .toLowerCase()
        .includes(termoBusca) ||
      getPrioridadeLegenda(
        consulta.checkin
          ? consulta.checkin.prioridade
          : consulta.prioridade || 0
      )
        .toLowerCase()
        .includes(termoBusca) ||
      (consulta.checkin && consulta.checkin.status === "registrado"
        ? "chegada confirmada"
        : "registrar chegada"
      ).includes(termoBusca)
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

  const handleSalvarCheckIn = async () => {
    setError(null);
    try {
      const checkInData = {
        ...dadosCheckIn,
        consultaId: consultaSelecionada.id,
        profissionalId: 3,
        horaChegada: new Date(),
        status: "registrado",
      };
      await realizarCheckIn(checkInData);
      const updatedConsultas = consultas.map((c) =>
        c.id === consultaSelecionada.id ? { ...c, checkin: checkInData } : c
      );
      setConsultas(updatedConsultas);
      setModalAddOpen(false);
      setDadosCheckIn({
        pressaoArterial: "",
        temperatura: "",
        peso: "",
        altura: "",
        observacoes: "",
        prioridade: 0,
      });
      setConsultaSelecionada(null);
    } catch (error) {
      console.error("Erro ao salvar check-in:", error);
      setError("Erro ao salvar o check-in. Tente novamente.");
    }
  };

  const openAddModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setDadosCheckIn({
      pressaoArterial: "",
      temperatura: "",
      peso: "",
      altura: "",
      observacoes: "",
      prioridade: consulta.prioridade || 0,
    });
    setModalAddOpen(true);
  };

  const openEditModal = (checkIn) => {
    const consulta = consultas.find((c) => c.id === checkIn.consultaId);
    setConsultaSelecionada(consulta);
    setCheckInSelecionado(checkIn);
    setDadosCheckIn({
      pressaoArterial: checkIn.pressaoArterial || "",
      temperatura: checkIn.temperatura || "",
      peso: checkIn.peso || "",
      altura: checkIn.altura || "",
      observacoes: checkIn.observacoes || "",
      prioridade: checkIn.prioridade || 0,
    });
    setModalEditOpen(true);
  };

  const openViewModal = (checkIn) => {
    setCheckInSelecionado(checkIn);
    setModalViewOpen(true);
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalEditOpen(false);
    setModalViewOpen(false);
    setConsultaSelecionada(null);
    setCheckInSelecionado(null);
    setDadosCheckIn({
      pressaoArterial: "",
      temperatura: "",
      peso: "",
      altura: "",
      observacoes: "",
      prioridade: 0,
    });
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
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Check-In de Pacientes
          </h2>
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
                    "Horário",
                    "Prioridade",
                    "Status",
                    "Ações",
                  ].map((header, index) => (
                    <th
                      key={header}
                      onClick={() =>
                        ["nome", "medico", "horario", "prioridade", "status"][
                          index
                        ] &&
                        handleSort(
                          ["nome", "medico", "horario", "prioridade", "status"][
                            index
                          ]
                        )
                      }
                      className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                        index === 0 ? "rounded-tl-lg" : ""
                      } ${index === 5 ? "rounded-tr-lg" : ""} ${
                        [
                          "nome",
                          "medico",
                          "horario",
                          "prioridade",
                          "status",
                        ].includes(sortField) &&
                        sortField ===
                          ["nome", "medico", "horario", "prioridade", "status"][
                            index
                          ]
                          ? "bg-blue-700"
                          : ""
                      }`}
                    >
                      {header}
                      {sortField ===
                        ["nome", "medico", "horario", "prioridade", "status"][
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
                      Nenhuma consulta disponível para check-in neste momento.
                    </td>
                  </tr>
                ) : (
                  currentConsultas.map((consulta) => (
                    <TableRow
                      key={consulta.id}
                      consulta={consulta}
                      onAdd={openAddModal}
                      onEdit={openEditModal}
                      onView={openViewModal}
                      getPrioridadeLegenda={getPrioridadeLegenda}
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

        {modalAddOpen && consultaSelecionada && (
          <ModalAddCheckIn
            isOpen={modalAddOpen}
            onClose={closeModal}
            consulta={consultaSelecionada}
            dadosCheckIn={dadosCheckIn}
            setDadosCheckIn={setDadosCheckIn}
            onSave={handleSalvarCheckIn}
          />
        )}

        {modalEditOpen && checkInSelecionado && (
          <ModalEditCheckIn
            isOpen={modalEditOpen}
            onClose={closeModal}
            checkIn={checkInSelecionado}
            dadosCheckIn={dadosCheckIn}
            setDadosCheckIn={setDadosCheckIn}
            onSave={handleSalvarCheckIn}
          />
        )}

        {modalViewOpen && checkInSelecionado && (
          <ModalViewCheckIn
            isOpen={modalViewOpen}
            onClose={closeModal}
            checkIn={checkInSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default CheckInPacientes;
