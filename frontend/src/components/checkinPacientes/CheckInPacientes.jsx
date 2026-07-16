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
import TableHeader from "../util/TableHeader";
import { Eye, Pencil, Check, Plus } from "lucide-react";

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
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Busca Geral
        </label>
        <input
          type="text"
          placeholder="Digite nome, médico, horário, prioridade ou status..."
          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
          value={filtroNome}
          onChange={(e) => onFiltroNomeChange(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Data da Consulta
        </label>
        <input
          type="date"
          className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
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
  const checkInRealizado =
    consulta.status === "checkin_realizado" || consulta.status === "realizada";
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-slate-700">
        {consulta.paciente.nome} {consulta.paciente.sobrenome}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {consulta.medico.nome} {consulta.medico.crm}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {formatarDataHoraBR(
          consulta.dataConsulta + "T" + consulta.horaConsulta
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {getPrioridadeLegenda(
          consulta.checkin
            ? consulta.checkin.prioridade
            : consulta.prioridade || 0
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        {checkInRealizado ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <Check size={12} />
            Chegada Confirmada
          </span>
        ) : (
          <button
            onClick={() => onAdd(consulta)}
            className="inline-flex items-center gap-1 rounded-md bg-amber-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 transition-colors"
            title="Registrar Chegada"
          >
            <Plus size={12} />
            Registrar Chegada
          </button>
        )}
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {checkInRealizado && (
            <>
              <button
                onClick={() => onEdit(consulta.checkin)}
                className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title="Editar Check-In"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onView(consulta.checkin)}
                className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                title="Visualizar Check-In"
              >
                <Eye size={15} />
              </button>
            </>
          )}
        </div>
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
          setError(
            "Por favor, selecione as datas de início e fim para o período."
          );
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
      link.setAttribute(
        "download",
        `relatorio_checkins_${tipoFiltroRelatorio}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      setError(
        "Erro ao gerar o relatório de check-ins. Verifique as datas e tente novamente."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Check-In de Pacientes</h2>
            <p className="text-sm text-slate-500 mt-0.5">Registrar chegada e triagem dos pacientes</p>
          </div>
        </div>

        {/* Seção para Download do Relatório - Added mt-6 */}
        <div className="mt-6 bg-green-50 p-4 rounded-lg shadow-sm border border-green-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-green-800 shrink-0 mb-2 md:mb-0">
            Gerar Relatório de Check-Ins
          </h3>

          <div className="flex flex-1 flex-wrap md:flex-nowrap gap-3 items-center justify-end">
            {/* Seleção do Tipo de Filtro */}
            <div className="flex-grow max-w-[180px]">
              {" "}
              {/* Limita a largura para compactar */}
              <label htmlFor="tipoFiltroRelatorio" className="sr-only">
                Tipo de Filtro
              </label>
              <select
                id="tipoFiltroRelatorio"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
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
              <div className="flex-grow max-w-[180px]">
                {" "}
                {/* Limita a largura para compactar */}
                <label htmlFor="dataRelatorio" className="sr-only">
                  Data do Relatório
                </label>
                <input
                  type="date"
                  id="dataRelatorio"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                  value={dataRelatorio}
                  onChange={(e) => setDataRelatorio(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="flex-grow max-w-[180px]">
                  {" "}
                  {/* Limita a largura para compactar */}
                  <label htmlFor="dataInicioRelatorio" className="sr-only">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    id="dataInicioRelatorio"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    value={dataInicioRelatorio}
                    onChange={(e) => setDataInicioRelatorio(e.target.value)}
                  />
                </div>
                <div className="flex-grow max-w-[180px]">
                  {" "}
                  {/* Limita a largura para compactar */}
                  <label htmlFor="dataFimRelatorio" className="sr-only">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    id="dataFimRelatorio"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                    value={dataFimRelatorio}
                    onChange={(e) => setDataFimRelatorio(e.target.value)}
                  />
                </div>
              </>
            )}

            <button
              onClick={handleDownloadRelatorio}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition w-full md:w-auto"
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V8"
                />
              </svg>
              Baixar Relatório
            </button>
          </div>
        </div>

        {error && (
          // Added mt-6 for spacing above error message
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
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
          <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <TableHeader label="Paciente" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Médico" field="medico" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Horário" field="horario" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Prioridade" field="prioridade" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
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
