import React, { useState, useEffect } from "react";
import { getConsultasPorData, realizarCheckIn } from "../../config/apiServices";
import ModalAddCheckIn from "./ModalAddCheckIn";
import ModalEditCheckIn from "./ModalEditCheckIn";
import ModalViewCheckIn from "./ModalViewCheckIn";
import FiltroCheckIn from "./FiltroCheckIn";

// Componente para cada linha da tabela
const TableRow = ({ consulta, onAdd, onEdit, onView }) => {
  console.log(consulta);

  const checkInRealizado =
    consulta.checkin && consulta.checkin.status === "registrado";

  // Função para mapear prioridade para legenda
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

  return (
    <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors text-left">
      <td className="py-3 px-2 text-gray-700 text-sm">
        {consulta.paciente.nome}
      </td>
      <td className="py-3 px-2 text-gray-700 text-sm">
        {consulta.profissionais.nome} {consulta.profissionais.sobrenome}
      </td>
      <td className="py-3 px-2 text-gray-700 text-sm">
        {consulta.horaConsulta} {/* Usando horaConsulta diretamente */}
      </td>
      <td className="py-3 px-2 text-gray-700 text-sm">
        {getPrioridadeLegenda(
          consulta.checkin
            ? consulta.checkin.prioridade
            : consulta.prioridade || 0
        )}
      </td>
      <td className="py-3 px-2">
        {checkInRealizado ? (
          <span className="bg-green-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm flex items-center gap-1">
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
            className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center gap-1"
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
      <td className="py-3 px-2 flex gap-2 justify-center">
        {checkInRealizado && (
          <>
            <button
              onClick={() => onEdit(consulta.checkin)}
              className="bg-[#001233] text-white p-2 rounded-md hover:bg-[#153a80]"
              title="Editar Check-In"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
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
              className="bg-[#001233] text-white p-2 rounded-md hover:bg-[#153a80]"
              title="Visualizar Check-In"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
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
    filtroData: new Date().toISOString().split("T")[0], // Data atual
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const consultasResponse = await getConsultasPorData(filtros.filtroData);
        const consultasDoDia = consultasResponse.data.filter((consulta) => {
          // Valida status da consulta e horário
          const agora = new Date();
          // console.log(agora);

          const dataConsulta = new Date(
            `${consulta.dataConsulta}T${consulta.horaConsulta}`
          );

          console.log(dataConsulta);

          return (
            consulta.status === "agendada" && // Apenas consultas agendadas
            dataConsulta > agora // Hora da consulta menor ou igual à atual
          );
        });
        setConsultas(consultasDoDia);
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
    return filtroNome
      ? consulta.paciente.nome.toLowerCase().includes(filtroNome.toLowerCase())
      : true;
  });

  const handleSalvarCheckIn = async () => {
    setError(null);
    try {
      const checkInData = {
        ...dadosCheckIn,
        consultaId: consultaSelecionada.id,
        profissionalId: 3, // Ajustar conforme autenticação
        horaChegada: new Date(),
        status: "registrado", // Status fixo para novo check-in
      };

      console.log("fazer checkin", checkInData);

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

  return (
    <section className="container mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl text-gray-800 font-bold text-center mb-6">
        Check-In de Pacientes - UBS
      </h2>

      <FiltroCheckIn
        onFiltroChange={handleFiltroChange}
        defaultDate={filtros.filtroData}
      />

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
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
                {[
                  "Paciente",
                  "Médico",
                  "Horário",
                  "Prioridade",
                  "Status",
                  "Ações",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-3 px-2 text-[#001233] font-semibold text-xs uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consultasFiltradas.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-3 px-2 text-center text-gray-500"
                  >
                    Nenhuma consulta disponível para check-in neste momento.
                  </td>
                </tr>
              ) : (
                consultasFiltradas.map((consulta) => (
                  <TableRow
                    key={consulta.id}
                    consulta={consulta}
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
