import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import {
  getPacientes,
  getProfissionais,
  getTipoConsulta,
  agendarConsulta,
  getConsultasPorData,
  cancelarConsulta,
} from "../../config/apiServices";
import ModalAddConsulta from "./ModalAddConsulta";
import ModalViewConsulta from "./ModalViewConsulta";
import ModalCancelConsulta from "./ModalCancelConsulta";
import Pagination from "../util/Pagination";

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
        {isAgendada && (
          <button
            onClick={() => onCancel(consulta)}
            className="text-red-500 hover:text-red-700"
            title="Cancelar Consulta"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </td>
    </tr>
  );
};

const FilterSection = ({ filtros, setFiltros }) => (
  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Paciente, Médico, Tipo de Consulta, Data - Hora, Motivo"
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={filtros.filtroNome}
        onChange={(e) => setFiltros({ ...filtros, filtroNome: e.target.value })}
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
        onChange={(e) => setFiltros({ ...filtros, filtroData: e.target.value })}
      />
    </div>
  </div>
);

const HeaderSection = ({ openAddModal, isLoading, toggleStatus, status }) => (
  <div className="border-b pb-4 flex justify-between items-center">
    <h2 className="text-3xl font-bold text-blue-600">
      Agendamento de Consultas
    </h2>
    <div className="flex gap-3">
      <button
        onClick={toggleStatus}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition bg-gray-600 hover:bg-gray-700"
      >
        {status === "agendada" ? "Ver Canceladas" : "Ver Agendadas"}
      </button>
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
        Nova Consulta
      </button>
    </div>
  </div>
);

const ConsultaTable = ({
  consultas,
  isLoading,
  formatarDataHoraBR,
  openViewModal,
  handleCancelConsulta,
  sortField,
  sortDirection,
  handleSort,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const sortConsultas = (consultas) => {
    return [...consultas].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        medico: (item) =>
          `${item.medico.nome} ${item.medico.sobrenome}`.toLowerCase(),
        tipo: (item) => item.tipoConsulta.nomeTipoConsulta.toLowerCase(),
        horario: (item) => item.horaConsulta,
        motivo: (item) => item.motivo.toLowerCase(),
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA > valueB ? direction : -direction;
    });
  };

  const consultasOrdenadas = sortConsultas(consultas);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultas = consultasOrdenadas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
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
                      ["nome", "medico", "tipo", "horario", "motivo"][index] &&
                      handleSort(
                        ["nome", "medico", "tipo", "horario", "motivo"][index]
                      )
                    }
                    className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${index === 5 ? "rounded-tr-lg" : ""} ${
                      ["nome", "medico", "tipo", "horario", "motivo"].includes(
                        sortField
                      ) &&
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
                    Nenhuma consulta encontrada.
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
      {consultasOrdenadas.length > 0 && (
        <Pagination
          totalItems={consultasOrdenadas.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          maxPageButtons={5}
        />
      )}
    </>
  );
};

const AgendamentoConsulta = () => {
  const { user } = useAuthContext();
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [dadosConsulta, setDadosConsulta] = useState({
    cpfPaciente: "",
    medicoId: "",
    idTipoConsulta: "",
    dataConsulta: "",
    horaConsulta: "",
    motivo: "",
    responsavelAgendamento: "",
    prioridade: "",
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
  const [status, setStatus] = useState("agendada");

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
          getConsultasPorData(filtros.filtroData, status),
          getPacientes(),
          getProfissionais(),
          getTipoConsulta(),
        ]);

        setConsultas(consultasResponse.data);
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
  }, [filtros.filtroData, status]);

  const consultasFiltradas = consultas.filter((consulta) => {
    const { filtroNome } = filtros;
    if (!filtroNome) return true;
    const termoBusca = filtroNome.toLowerCase();
    return (
      consulta.paciente.nome.toLowerCase().includes(termoBusca) ||
      `${consulta.medico.nome} ${consulta.medico.sobrenome}`
        .toLowerCase()
        .includes(termoBusca) ||
      consulta.tipoConsulta.nomeTipoConsulta
        .toLowerCase()
        .includes(termoBusca) ||
      formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)
        .toLowerCase()
        .includes(termoBusca) ||
      consulta.motivo.toLowerCase().includes(termoBusca)
    );
  });

  const handleSalvarConsulta = async () => {
    setError(null);
    try {
      const consultaData = {
        ...dadosConsulta,
        status: "agendada",
      };
      const response = await agendarConsulta(consultaData);
      if (status === "agendada") {
        setConsultas([...consultas, response.data]);
      }
      setModalAddOpen(false);
      setDadosConsulta({
        cpfPaciente: "",
        medicoId: "",
        idTipoConsulta: "",
        dataConsulta: "",
        horaConsulta: "",
        motivo: "",
        responsavelAgendamento: user?.nome,
        prioridade: 1,
      });
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      setError("Erro ao salvar a consulta. Tente novamente.");
    }
  };

  const openAddModal = () => {
    setDadosConsulta({
      cpfPaciente: "",
      medicoId: "",
      idTipoConsulta: "",
      dataConsulta: "",
      horaConsulta: "",
      motivo: "",
      responsavelAgendamento: user?.nome,
      prioridade: 1,
    });
    setModalAddOpen(true);
  };

  const openViewModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setModalViewOpen(true);
  };

  const openCancelModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setModalCancelOpen(true);
  };

  const handleCancelConsulta = async (motivoCancelamento) => {
    setError(null);
    try {
      const response = await cancelarConsulta(
        consultaSelecionada.id,
        motivoCancelamento
      );
      const updatedConsulta = response.data;
      setConsultas(
        consultas.map((c) =>
          c.id === consultaSelecionada.id ? updatedConsulta : c
        )
      );
      closeModal();
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      setError(
        error.response?.data?.error ||
          "Erro ao cancelar consulta. Tente novamente."
      );
    }
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalViewOpen(false);
    setModalCancelOpen(false);
    setConsultaSelecionada(null);
    setError(null);
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

  const toggleStatus = () => {
    setStatus(status === "agendada" ? "cancelada" : "agendada");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6 relative z-10">
        <HeaderSection
          openAddModal={openAddModal}
          isLoading={isLoading}
          toggleStatus={toggleStatus}
          status={status}
        />

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <FilterSection filtros={filtros} setFiltros={setFiltros} />

        <ConsultaTable
          consultas={consultasFiltradas}
          isLoading={isLoading}
          formatarDataHoraBR={formatarDataHoraBR}
          openViewModal={openViewModal}
          handleCancelConsulta={openCancelModal}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />

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
            error={error}
            setError={setError}
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

        {modalCancelOpen && consultaSelecionada && (
          <ModalCancelConsulta
            isOpen={modalCancelOpen}
            onClose={closeModal}
            consulta={consultaSelecionada}
            onConfirm={handleCancelConsulta}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}
      </div>
    </div>
  );
};

export default AgendamentoConsulta;
