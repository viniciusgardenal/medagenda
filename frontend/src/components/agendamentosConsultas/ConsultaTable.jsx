import Pagination from "../util/Pagination";
import TableRow from "./TableRow";
import { useState } from "react";
import { enviarConfirmacaoConsulta } from "../../config/apiServices"; // Importe a nova função

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
    // console.log(" Consulta Table consultas", consultas); // Este log foi muito útil!

    return [...consultas].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        // --- CORREÇÃO APLICADA ABAIXO ---
        medico: (item) =>
          `${item.medico.nome} ${item.medico.crm}`.toLowerCase(),
        // item.medico.nome.toLowerCase(),
        // Se quiser incluir o CRM na ordenação, poderia ser:
        // medico:
        // --- FIM DA CORREÇÃO ---
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
  const [enviandoEmailId, setEnviandoEmailId] = useState(null); // Para feedback no botão

  const handleEnviarEmailConfirmacao = async (consulta) => {
    if (enviandoEmailId === consulta.id) return; // Evitar cliques duplos

    setEnviandoEmailId(consulta.id);
    // Se você tem um estado de erro global, limpe-o
    // setError(null);

    try {
      const response = await enviarConfirmacaoConsulta(consulta.id);
      alert(response.message || "E-mail de confirmação enviado com sucesso!");
      // Opcional: você pode querer atualizar o estado da consulta na lista
      // para indicar que o e-mail foi enviado (ex: um campo 'confirmacaoEnviada')
      // Se for o caso, você precisaria de um re-fetch ou uma atualização otimista.
    } catch (err) {
      // setError(err.error || "Não foi possível enviar o e-mail de confirmação.");
      alert(err.error || "Não foi possível enviar o e-mail de confirmação.");
      console.error("Falha ao enviar email de confirmação:", err);
    } finally {
      setEnviandoEmailId(null);
    }
  };

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
                  "Status",
                  "Ações",
                ].map((header, index) => (
                  <th
                    key={header}
                    onClick={() =>
                      ["nome", "medico", "tipo", "horario", "motivo", "status"][
                        index
                      ] &&
                      handleSort(
                        [
                          "nome",
                          "medico",
                          "tipo",
                          "horario",
                          "motivo",
                          "status",
                        ][index]
                      )
                    }
                    className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${index === 6 ? "rounded-tr-lg" : ""} ${
                      [
                        "nome",
                        "medico",
                        "tipo",
                        "horario",
                        "motivo",
                        "status",
                      ].includes(sortField) &&
                      sortField ===
                        [
                          "nome",
                          "medico",
                          "tipo",
                          "horario",
                          "motivo",
                          "status",
                        ][index]
                        ? "bg-blue-700"
                        : ""
                    }`}
                  >
                    {header}
                    {sortField ===
                      ["nome", "medico", "tipo", "horario", "motivo", "status"][
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
                    colSpan="7"
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
                    onEnviarConfirmacaoEmail={handleEnviarEmailConfirmacao} // Passa a função
                    enviandoEmailId={enviandoEmailId} // Passa o estado de carregamento
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
