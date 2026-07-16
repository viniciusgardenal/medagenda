import Pagination from "../util/Pagination";
import TableRow from "./TableRow";
import TableHeader from "../util/TableHeader";
import { useState } from "react";
import { enviarConfirmacaoConsulta } from "../../config/apiServices";

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
          `${item.medico.nome} ${item.medico.crm}`.toLowerCase(),
        tipo: (item) => item.tipoConsulta.nomeTipoConsulta.toLowerCase(),
        horario: (item) => item.horaConsulta,
        motivo: (item) => item.motivo.toLowerCase(),
        status: (item) => item.status.toLowerCase(),
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
  const [enviandoEmailId, setEnviandoEmailId] = useState(null);

  const handleEnviarEmailConfirmacao = async (consulta) => {
    if (enviandoEmailId === consulta.id) return;
    setEnviandoEmailId(consulta.id);
    try {
      const response = await enviarConfirmacaoConsulta(consulta.id);
      alert(response.message || "E-mail de confirmação enviado com sucesso!");
    } catch (err) {
      alert(err.error || "Não foi possível enviar o e-mail de confirmação.");
      console.error("Falha ao enviar email de confirmação:", err);
    } finally {
      setEnviandoEmailId(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Carregando consultas...</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <TableHeader label="Paciente" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <TableHeader label="Médico" field="medico" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <TableHeader label="Tipo de Consulta" field="tipo" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <TableHeader label="Data - Hora" field="horario" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <TableHeader label="Motivo" field="motivo" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <TableHeader label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {currentConsultas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-400 text-sm">
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
                    onEnviarConfirmacaoEmail={handleEnviarEmailConfirmacao}
                    enviandoEmailId={enviandoEmailId}
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

export default ConsultaTable;
