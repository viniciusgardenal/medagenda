import Pagination from "../util/Pagination";
import TableRow from "./TableRow";

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
    console.log("consultas", consultas);

    return [...consultas].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente.nome.toLowerCase(),
        medico: (item) =>
          `${item.medico.nome} ${item.medico.sobrenome}`.toLowerCase(),
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
