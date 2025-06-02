import React, { useState, useEffect } from "react";
import { getConsultasPorData, realizarCheckIn, gerarRelatorioCheckIns, atualizarCheckIn } from "../../config/apiServices";
import ModalAddCheckIn from "./ModalAddCheckIn";
import ModalEditCheckIn from "./ModalEditCheckIn";
import ModalViewCheckIn from "./ModalViewCheckIn";
import Pagination from "../util/Pagination";

const SearchFilter = ({
  filtroNome,
  filtroData,
  onFiltroNomeChange,
  onFiltroDataChange,
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Busca Geral
        </label>
        <input
          type="text"
          placeholder="Digite nome, médico, horário, prioridade ou status..."
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filtroNome}
          onChange={(e) => onFiltroNomeChange(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Data da Consulta
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filtroData}
          onChange={(e) => onFiltroDataChange(e.target.value)}
        />
      </div>
    </div>
  );
};

const TableRow = ({
  consulta,
  onAdd,
  onEdit,
  onView,
  getPrioridadeLegenda,
  formatarDataHoraBR,
}) => {
  const checkInRealizado = consulta.status === "checkin_realizado"; 
  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.paciente.nome} {consulta.paciente.sobrenome}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.medico.nome} {consulta.medico.crm}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {formatarDataHoraBR(consulta.dataConsulta + "T" + consulta.horaConsulta)}
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
      <td className="px-4 py-3 flex justify-start gap-3">
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

  const formatarDataHoraBR = (dataHora) => {
    if (!dataHora) return "";
    try {
      const date = new Date(dataHora);
      if (isNaN(date.getTime())) return "";
      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const ano = date.getFullYear();
      const hora = String(date.getHours()).padStart(2, "0");
      const minutos = String(date.getMinutes()).padStart(2, "0");
      return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "";
    }
  };

  const sortConsultas = (consultas) => {
    return [...consultas].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        medico: (item) =>
          `${item.medico.nome} ${item.medico.crm}`.toLowerCase(),
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
      console.log("Resposta de getConsultasPorData:", consultasResponse.data);

      const consultasArray = Array.isArray(consultasResponse.data)
        ? consultasResponse.data
        : [];

      // Filtra apenas as consultas do dia selecionado,
      // sem se preocupar com o status 'agendada' ou se já passou
      const consultasDoDia = consultasArray.filter((consulta) => {
        // Assume que 'dataConsulta' já está no formato correto para comparação com 'filtros.filtroData'
        return consulta.dataConsulta === filtros.filtroData;
      });

      if (!Array.isArray(consultasResponse.data)) {
        console.warn(
          "consultasResponse.data não é um array:",
          consultasResponse.data
        );
        setError(
          "Formato de dados inválido retornado pela API. Esperado: array."
        );
      }

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
      `${consulta.paciente.nome} ${consulta.paciente.sobrenome}`
        .toLowerCase()
        .includes(termoBusca) ||
      `${consulta.medico.nome} ${consulta.medico.crm}`
        .toLowerCase()
        .includes(termoBusca) ||
      formatarDataHoraBR(consulta.dataConsulta + "T" + consulta.horaConsulta)
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
      )
        .toLowerCase()
        .includes(termoBusca)
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
      if (checkInSelecionado) {
        // Lógica para EDIÇÃO de Check-In existente
        const dadosParaAtualizar = {
          pressaoArterial: dadosCheckIn.pressaoArterial,
          temperatura: dadosCheckIn.temperatura,
          peso: dadosCheckIn.peso,
          altura: dadosCheckIn.altura,
          observacoes: dadosCheckIn.observacoes,
          prioridade: dadosCheckIn.prioridade,
          // Não inclua consultaId, matriculaProfissional, horaChegada ou status aqui,
          // pois estes são dados de criação e não devem ser alterados na edição.
        };

        // Chama a API de atualização do check-in
        await atualizarCheckIn(checkInSelecionado.id, dadosParaAtualizar);

        // Atualiza o estado local para refletir a mudança imediatamente
        // (é uma atualização otimista, o ideal é re-fetch completo para garantir consistência)
        const updatedConsultas = consultas.map((c) => {
          if (c.checkin && c.checkin.id === checkInSelecionado.id) {
            return {
              ...c,
              checkin: {
                ...c.checkin,
                ...dadosParaAtualizar, // Mescla os dados atualizados no objeto checkin existente
              },
            };
          }
          return c;
        });
        setConsultas(updatedConsultas);

        // Opcional, mas recomendado: re-fetch completo dos dados após a atualização
        // para garantir que a tabela esteja totalmente sincronizada com o backend.
        // Chame a função fetchData diretamente ou extraia a lógica de carregamento.
        const consultasResponse = await getConsultasPorData(filtros.filtroData);
        const consultasArray = Array.isArray(consultasResponse.data)
          ? consultasResponse.data
          : [];
        const consultasDoDia = consultasArray.filter((consulta) => {
          return consulta.dataConsulta === filtros.filtroData;
        });
        setConsultas(consultasDoDia);


      } else {
        // Lógica para CRIAÇÃO de NOVO Check-In
        const checkInData = {
          ...dadosCheckIn,
          consultaId: consultaSelecionada.id,
          matriculaProfissional: 3, // Considere obter isso de um contexto de autenticação/usuário logado
          horaChegada: new Date().toISOString(),
          status: "registrado", // Conforme seu modelo CheckIn no backend
        };
        await realizarCheckIn(checkInData);

        // Após salvar um novo check-in, faça um re-fetch dos dados
        // para garantir que a tabela mostre o novo check-in com o status correto
        const consultasResponse = await getConsultasPorData(filtros.filtroData);
        const consultasArray = Array.isArray(consultasResponse.data)
          ? consultasResponse.data
          : [];
        const consultasDoDia = consultasArray.filter((consulta) => {
          return consulta.dataConsulta === filtros.filtroData;
        });
        setConsultas(consultasDoDia);
      }

      // Limpar estados e fechar modais
      setModalAddOpen(false);
      setModalEditOpen(false); // Fechar modal de edição
      setDadosCheckIn({
        pressaoArterial: "",
        temperatura: "",
        peso: "",
        altura: "",
        observacoes: "",
        prioridade: 0,
      });
      setConsultaSelecionada(null);
      setCheckInSelecionado(null); // Limpar checkInSelecionado
    } catch (error) {
      console.error("Erro ao salvar check-in:", error);
      // Aqui você pode adicionar uma lógica para exibir uma mensagem de erro mais amigável
      setError(
        error.response?.data?.message ||
          "Erro ao salvar o check-in. Tente novamente."
      );
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

  const handleDownloadRelatorio = async () => {
    try {
      const response = await gerarRelatorioCheckIns();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_checkins.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      setError("Erro ao gerar o relatório de check-ins.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Check-In de Pacientes
          </h2>
        </div>
        <button
          onClick={handleDownloadRelatorio}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V8"
            />
          </svg>
          Baixar Relatório de Check-Ins
        </button>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <SearchFilter
          filtroNome={filtros.filtroNome}
          filtroData={filtros.filtroData}
          onFiltroNomeChange={(value) =>
            setFiltros({ ...filtros, filtroNome: value })
          }
          onFiltroDataChange={(value) =>
            setFiltros({ ...filtros, filtroData: value })
          }
        />

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