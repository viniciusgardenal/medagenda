import React, { useState, useEffect } from "react";
import { getConsultasPorData, realizarCheckIn } from "../../config/apiServices";
import ModalAddCheckIn from "./ModalAddCheckIn";
import ModalEditCheckIn from "./ModalEditCheckIn";
import ModalViewCheckIn from "./ModalViewCheckIn";
import Pagination from "../util/Pagination";
import TableHeader from "./TableHeader";

// Componente para cada linha da tabela
const TableRow = ({
  consulta,
  onAdd,
  onEdit,
  onView,
  getPrioridadeLegenda,
  formatarDataHoraBR,
}) => {
  const checkInRealizado =
    consulta.checkin && consulta.checkin.status === "registrado";
  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.paciente.nome}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.profissionais.nome} {consulta.profissionais.sobrenome}
      </td>
      <td className="py-3 px-2 text-gray-700 text-sm">
        {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
      </td>
      <td className="py-3 px-2 text-gray-700 text-sm">
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

  // Estado para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
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
        return "Normal"; // Valor padrão caso seja undefined ou inválido
    }
  };

  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";

    try {
      // Converte a data para formato brasileiro (DD/MM/YYYY)
      const [ano, mes, dia] = data.split("-");
      const dataBR = `${dia}/${mes}/${ano}`;

      // Formata a hora (remove os segundos se existirem)
      const horaBR = hora.split(":").slice(0, 2).join(":");

      return `${dataBR} - ${horaBR}`;
    } catch (error) {
      return `${data} - ${hora}`;
    }
  };

  // Função para ordenar as consultas
  const sortConsultas = (consultas) => {
    return [...consultas].sort((a, b) => {
      let valueA, valueB;

      // Mapeia os campos para seus valores correspondentes
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        medico: (item) =>
          `${item.profissionais.nome} ${item.profissionais.sobrenome}`.toLowerCase(),
        horario: (item) => item.horaConsulta,
        prioridade: (item) =>
          item.checkin ? item.checkin.prioridade : item.prioridade || 0,
      };

      // Obtém os valores usando a função de mapeamento
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);

      // Determina a direção da ordenação
      const direction = sortDirection === "asc" ? 1 : -1;

      // Compara os valores
      return valueA > valueB ? direction : -direction;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const consultasResponse = await getConsultasPorData(filtros.filtroData);
        const consultasDoDia = consultasResponse.data.filter((consulta) => {
          const agora = new Date();
          const dataConsulta = new Date(
            `${consulta.dataConsulta}T${consulta.horaConsulta}`
          );
          return consulta.status === "agendada" && dataConsulta > agora;
        });
        setConsultas(consultasDoDia);
        setCurrentPage(1); // Reset para primeira página quando mudarem os dados
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar as consultas. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filtros.filtroData]);

  const handleFiltroChange = (novosFiltros) => {
    setFiltros(novosFiltros);
  };

  const consultasFiltradas = consultas.filter((consulta) => {
    const { filtroNome } = filtros;

    if (!filtroNome) return true;

    const termoBusca = filtroNome.toLowerCase();

    // Verifica em vários campos
    return (
      // Paciente
      consulta.paciente.nome.toLowerCase().includes(termoBusca) ||
      // Profissional
      `${consulta.profissionais.nome} ${consulta.profissionais.sobrenome}`
        .toLowerCase()
        .includes(termoBusca) ||
      // Data (em formato brasileiro para a busca)
      formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)
        .toLowerCase()
        .includes(termoBusca) ||
      // Prioridade (texto da prioridade, não o número)
      getPrioridadeLegenda(
        consulta.checkin
          ? consulta.checkin.prioridade
          : consulta.prioridade || 0
      )
        .toLowerCase()
        .includes(termoBusca) ||
      // Status de check-in
      (consulta.checkin && consulta.checkin.status === "registrado"
        ? "chegada confirmada"
        : "registrar chegada"
      ).includes(termoBusca)
    );
  });

  // Depois ordenamos
  const consultasOrdenadasFiltradas = sortConsultas(consultasFiltradas);

  // Finalmente paginamos
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultas = consultasOrdenadasFiltradas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Função para mudar de página
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
    // Se clicar no mesmo campo, inverte a direção
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // Reset da página quando mudar ordenação
    setCurrentPage(1);
  };

  return (
    <section className="container mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl text-gray-800 font-bold text-center mb-6">
        Check-In de Pacientes
      </h2>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-3">
          <p className="text-gray-600">Carregando consultas...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th colSpan="6" className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">
                      Busca global:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Digite para buscar em qualquer campo..."
                        className="px-3 py-2 w-full text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filtros.filtroNome}
                        onChange={(e) =>
                          setFiltros({ ...filtros, filtroNome: e.target.value })
                        }
                      />
                      {filtros.filtroNome && (
                        <button
                          onClick={() =>
                            setFiltros({ ...filtros, filtroNome: "" })
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-semibold">Data:</label>
                      <input
                        type="date"
                        className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={filtros.filtroData}
                        onChange={(e) =>
                          setFiltros({ ...filtros, filtroData: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <TableHeader
                  label="Paciente"
                  field="nome"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Médico"
                  field="medico"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Horário"
                  field="horario"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Prioridade"
                  field="prioridade"
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="py-3 px-2 text-[#001233] font-semibold text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-2 text-[#001233] font-semibold text-xs uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {currentConsultas.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-3 px-2 text-center text-gray-500"
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
    </section>
  );
};

export default CheckInPacientes;
