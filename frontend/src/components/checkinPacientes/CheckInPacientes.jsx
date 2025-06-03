import { useState, useEffect } from "react";
import {
  getConsultasPorData,
  realizarCheckIn,
  // Certifique-se de que gerarRelatorioCheckIns pode receber parâmetros
  gerarRelatorioCheckIns,
  atualizarCheckIn,
} from "../../config/apiServices";
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
    // Added mt-6 for spacing above this component
    <div className="flex gap-4 mt-6">
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
        {formatarDataHoraBR(
          consulta.dataConsulta + "T" + consulta.horaConsulta
        )}
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

  // Novas estados para o filtro de relatório
  const [tipoFiltroRelatorio, setTipoFiltroRelatorio] = useState("dia"); // 'dia' ou 'periodo'
  const [dataRelatorio, setDataRelatorio] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dataInicioRelatorio, setDataInicioRelatorio] = useState("");
  const [dataFimRelatorio, setDataFimRelatorio] = useState("");

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

        const consultasDoDia = consultasArray.filter((consulta) => {
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
        const dadosParaAtualizar = {
          pressaoArterial: dadosCheckIn.pressaoArterial,
          temperatura: dadosCheckIn.temperatura,
          peso: dadosCheckIn.peso,
          altura: dadosCheckIn.altura,
          observacoes: dadosCheckIn.observacoes,
          prioridade: dadosCheckIn.prioridade,
        };

        await atualizarCheckIn(checkInSelecionado.id, dadosParaAtualizar);

        // Atualiza o estado local para refletir a mudança imediatamente
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

        // Recarrega os dados do dia para garantir que tudo esteja sincronizado
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
          // Considere obter matriculaProfissional de um contexto de autenticação/usuário logado
          // Por enquanto, usaremos consultaSelecionada.medicoId como exemplo,
          // mas isso deve ser a matrícula do profissional que está REALIZANDO o check-in.
          matriculaProfissional: consultaSelecionada.medicoId, // ATENÇÃO: Revisar esta linha
          horaChegada: new Date().toISOString(),
        };
        await realizarCheckIn(checkInData);

        // Recarrega os dados do dia para exibir o novo check-in
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
    setConsultaSelecionada(consulta); // Pode ser útil ter a consulta ligada ao checkin para exibir detalhes
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

  // Alterada a função para receber os parâmetros de data
  const handleDownloadRelatorio = async () => {
    setError(null); // Limpa erros anteriores
    try {
      let params = {};
      if (tipoFiltroRelatorio === "dia") {
        if (!dataRelatorio) {
          setError("Por favor, selecione uma data para o relatório.");
          return;
        }
        params = { data: dataRelatorio };
      } else if (tipoFiltroRelatorio === "periodo") {
        if (!dataInicioRelatorio || !dataFimRelatorio) {
          setError("Por favor, selecione as datas de início e fim para o período.");
          return;
        }
        // Validação básica: data de início não pode ser depois da data de fim
        if (new Date(dataInicioRelatorio) > new Date(dataFimRelatorio)) {
          setError("A data de início não pode ser posterior à data de fim.");
          return;
        }
        params = { dataInicio: dataInicioRelatorio, dataFim: dataFimRelatorio };
      }

      // Chama a função da API passando os parâmetros
      const response = await gerarRelatorioCheckIns(params);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_checkins_${tipoFiltroRelatorio}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      setError("Erro ao gerar o relatório de check-ins. Verifique as datas e tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Check-In de Pacientes
          </h2>
        </div>

        {/* Seção para Download do Relatório - Added mt-6 */}
        <div className="mt-6 bg-green-50 p-4 rounded-lg shadow-sm border border-green-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-green-800 shrink-0 mb-2 md:mb-0">Gerar Relatório de Check-Ins</h3>
          
          <div className="flex flex-1 flex-wrap md:flex-nowrap gap-3 items-center justify-end">
            {/* Seleção do Tipo de Filtro */}
            <div className="flex-grow max-w-[180px]"> {/* Limita a largura para compactar */}
              <label htmlFor="tipoFiltroRelatorio" className="sr-only">Tipo de Filtro</label>
              <select
                id="tipoFiltroRelatorio"
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={tipoFiltroRelatorio}
                onChange={(e) => {
                  setTipoFiltroRelatorio(e.target.value);
                  setDataRelatorio(new Date().toISOString().split("T")[0]);
                  setDataInicioRelatorio("");
                  setDataFimRelatorio("");
                }}
              >
                <option value="dia">Dia Específico</option>
                <option value="periodo">Período Personalizado</option>
              </select>
            </div>

            {/* Campos de Data Condicionais */}
            {tipoFiltroRelatorio === "dia" ? (
              <div className="flex-grow max-w-[180px]"> {/* Limita a largura para compactar */}
                <label htmlFor="dataRelatorio" className="sr-only">Data do Relatório</label>
                <input
                  type="date"
                  id="dataRelatorio"
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={dataRelatorio}
                  onChange={(e) => setDataRelatorio(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="flex-grow max-w-[180px]"> {/* Limita a largura para compactar */}
                  <label htmlFor="dataInicioRelatorio" className="sr-only">Data de Início</label>
                  <input
                    type="date"
                    id="dataInicioRelatorio"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={dataInicioRelatorio}
                    onChange={(e) => setDataInicioRelatorio(e.target.value)}
                  />
                </div>
                <div className="flex-grow max-w-[180px]"> {/* Limita a largura para compactar */}
                  <label htmlFor="dataFimRelatorio" className="sr-only">Data de Fim</label>
                  <input
                    type="date"
                    id="dataFimRelatorio"
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={dataFimRelatorio}
                    onChange={(e) => setDataFimRelatorio(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <button
              onClick={handleDownloadRelatorio}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700 transition w-full md:w-auto"
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
              Baixar Relatório
            </button>
          </div>
        </div>


        {error && (
          // Added mt-6 for spacing above error message
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        {/* SearchFilter component will have mt-6 from its internal definition */}
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
          // Added mt-6 for spacing above loading message
          <div className="mt-6 text-center py-4">
            <p className="text-sm text-gray-500">Carregando consultas...</p>
          </div>
        ) : (
          // Added mt-6 for spacing above table container
          <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
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
          // Wrapped Pagination in a div with mt-6 for spacing
          <div className="mt-6">
            <Pagination
              totalItems={consultasOrdenadasFiltradas.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
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
      </div>
    </div>
  );
};

export default CheckInPacientes;