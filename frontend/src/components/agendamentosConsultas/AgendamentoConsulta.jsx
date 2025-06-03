import { useState } from "react";
import { useAuthContext } from "../../context/authContext";
import { useConsultas } from "../../hooks/useConsultas";
import HeaderSection from "./HeaderSection";
import FilterSection from "./FilterSection";
import ConsultaTable from "./ConsultaTable";
import ModalAddConsulta from "./ModalAddConsulta";
import ModalViewConsulta from "./ModalViewConsulta";
import ModalCancelConsulta from "./ModalCancelConsulta";
import { formatarDataHoraBR } from "../util/formatters";

const AgendamentoConsulta = () => {
  const { user } = useAuthContext();

  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  const initialFilters = {
    filtroNome: "",
    filtroData: new Date().toISOString().split("T")[0],
    filtroStatus: "agendada",
  };

  const {
    consultas,
    pacientes,
    medicos,
    tiposConsulta,
    filtros,
    setFiltros,
    isLoading,
    error,
    setError,
    handleSalvarConsulta,
    handleCancelConsulta,
  } = useConsultas(initialFilters);

  const openAddModal = () => setModalAddOpen(true);
  const openViewModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setModalViewOpen(true);
  };
  const openCancelModal = (consulta) => {
    setConsultaSelecionada(consulta);
    setModalCancelOpen(true);
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
    const novoStatus =
      filtros.filtroStatus === "agendada" ? "cancelada" : "agendada";
    setFiltros({ ...filtros, filtroStatus: novoStatus });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6 relative z-10">
        <HeaderSection
          openAddModal={openAddModal}
          isLoading={isLoading}
          toggleStatus={toggleStatus}
          status={filtros.filtroStatus}
        />

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <FilterSection filtros={filtros} setFiltros={setFiltros} />

        <ConsultaTable
          consultas={consultas}
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
            onSave={handleSalvarConsulta}
            pacientes={pacientes}
            medicos={medicos}
            tiposConsulta={tiposConsulta}
            error={error}
            setError={setError}
            user={user}
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
