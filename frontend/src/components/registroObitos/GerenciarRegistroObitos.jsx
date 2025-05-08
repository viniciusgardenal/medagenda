import React, { useState, useEffect } from "react";
import {
  getRegistroObitos,
  criarRegistroObito,
  updateRegistroObito,
  excluirRegistroObito,
  getPacientes,
  getProfissionais,
} from "../../config/apiServices";
import ModalAddObito from "./ModalAddObito";
import ModalEditObito from "./ModalEditObito";
import ModalViewObito from "./ModalViewObito";
import ConfirmationModal from "./confirmationModal";
import Pagination from "../util/Pagination";
import { FaPlus, FaEye, FaEdit, FaTrash, FaSkullCrossbones } from "react-icons/fa";

const GerenciarRegistroObitos = () => {
  const [obitos, setObitos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedObito, setSelectedObito] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [filtroPaciente, setFiltroPaciente] = useState("");
  const [filtroProfissional, setFiltroProfissional] = useState("");
  const [filtroCausa, setFiltroCausa] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("idRegistroObito");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [obitosData, pacientesData, profissionaisData] = await Promise.all([
        getRegistroObitos(),
        getPacientes(),
        getProfissionais(),
      ]);
      const validObitos = obitosData.data.filter(
        (o) => o.idRegistroObito && o.cpfPaciente && o.matriculaProfissional && o.dataObito
      );
      const validPacientes = pacientesData.data.filter(
        (p) => p && p.cpf && p.nome && typeof p.cpf !== "undefined"
      );
      const validProfissionais = profissionaisData.data.filter(
        (p) => p && p.matricula && p.nome && typeof p.matricula !== "undefined"
      );
      setObitos(validObitos || []);
      setPacientes(validPacientes || []);
      setProfissionais(validProfissionais || []);
      console.log("Pacientes carregados:", validPacientes);
      console.log("Profissionais carregados:", validProfissionais);
      console.log("Óbitos carregados:", validObitos);
      if (validPacientes.length === 0) {
        console.warn("Nenhum paciente válido encontrado.");
        setError("Nenhum paciente válido encontrado. Verifique a fonte de dados.");
      }
      if (validProfissionais.length === 0) {
        console.warn("Nenhum profissional válido encontrado.");
        setError("Nenhum profissional válido encontrado. Verifique a fonte de dados.");
      }
      if (validObitos.length === 0) {
        console.warn("Nenhum óbito válido encontrado.");
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddObito = async (dadosObito) => {
    setIsSaving(true);
    try {
      const response = await criarRegistroObito(dadosObito);
      const newObito = {
        ...response.data,
        idRegistroObito: response.data.idRegistroObito || Date.now(), // Fallback para garantir ID único
        cpfPaciente: response.data.cpfPaciente,
        matriculaProfissional: response.data.matriculaProfissional,
        dataObito: response.data.dataObito,
        causaObito: response.data.causaObito || "",
      };
      setObitos((prevObitos) => {
        const updatedObitos = [...prevObitos, newObito];
        console.log("Novo óbito adicionado:", newObito);
        console.log("Obitos atualizados:", updatedObitos);
        return updatedObitos;
      });
      setIsAddModalOpen(false);
      // Opcional: Resetar filtros para garantir que o novo registro apareça
      setFiltroPaciente("");
      setFiltroProfissional("");
      setFiltroCausa("");
      setCurrentPage(1); // Voltar para a primeira página
    } catch (err) {
      console.error("Erro ao adicionar registro:", err);
      setError("Erro ao adicionar registro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditObito = async (id, dadosObito) => {
    setIsSaving(true);
    try {
      const response = await updateRegistroObito(id, dadosObito);
      setObitos(obitos.map((obito) => (obito.idRegistroObito === id ? response.data : obito)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao editar registro:", err);
      setError("Erro ao editar registro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteObito = async () => {
    setIsSaving(true);
    try {
      await excluirRegistroObito(selectedObito.idRegistroObito);
      setObitos(obitos.filter((obito) => obito.idRegistroObito !== selectedObito.idRegistroObito));
      setIsConfirmModalOpen(false);
      setSelectedObito(null);
    } catch (err) {
      console.error("Erro ao excluir registro:", err);
      if (err.response?.status === 403) {
        setError("Acesso negado. Verifique suas permissões ou tente novamente.");
      } else {
        setError("Erro ao excluir registro. Tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (obito) => {
    setSelectedObito(obito);
    setIsEditModalOpen(true);
  };

  const openViewModal = (obito) => {
    setSelectedObito(obito);
    setIsViewModalOpen(true);
  };

  const openConfirmDelete = (obito) => {
    setSelectedObito(obito);
    setIsConfirmModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedObito(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Data inválida" : `${date.toLocaleDateString("pt-BR")} ${date.toLocaleTimeString("pt-BR")}`;
  };

  const getPacienteNome = (cpf) => {
    if (!cpf) {
      console.warn("CPF inválido fornecido:", cpf);
      return "Paciente não encontrado";
    }
    const paciente = pacientes.find((p) => {
      if (!p || typeof p.cpf === "undefined") {
        console.warn("Paciente inválido:", p);
        return false;
      }
      return p.cpf.toString() === cpf.toString();
    });
    return paciente ? `${paciente.nome} ${paciente.sobrenome || ''}` : "Paciente não encontrado";
  };

  const getProfissionalNome = (matricula) => {
    if (!matricula) {
      console.warn("Matrícula inválida fornecida:", matricula);
      return "Profissional não encontrado";
    }
    const profissional = profissionais.find((p) => {
      if (!p || typeof p.matricula === "undefined") {
        console.warn("Profissional inválido:", p);
        return false;
      }
      return p.matricula.toString() === matricula.toString();
    });
    if (!profissional) {
      console.warn("Nenhum profissional encontrado para matrícula:", matricula);
    }
    return profissional ? `${profissional.nome} ${profissional.sobrenome || ''}` : "Profissional não encontrado";
  };

  const sortObitos = (obitos) => {
    return [...obitos].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        idRegistroObito: (item) => item.idRegistroObito,
        paciente: (item) => getPacienteNome(item.cpfPaciente).toLowerCase(),
        profissional: (item) => getProfissionalNome(item.matriculaProfissional).toLowerCase(),
        dataObito: (item) => new Date(item.dataObito).getTime(),
        causaObito: (item) => (item.causaObito || "").toLowerCase(),
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);

      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortField === "idRegistroObito" || sortField === "dataObito") {
        return (valueA - valueB) * direction;
      }
      return valueA.localeCompare(valueB) * direction;
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

  const obitosFiltrados = obitos.filter((obito) => {
    const pacienteNome = getPacienteNome(obito.cpfPaciente).toLowerCase();
    const profissionalNome = getProfissionalNome(obito.matriculaProfissional).toLowerCase();
    const causa = obito.causaObito ? obito.causaObito.toLowerCase() : "";
    const passesFilter =
      pacienteNome.includes(filtroPaciente.toLowerCase()) &&
      profissionalNome.includes(filtroProfissional.toLowerCase()) &&
      causa.includes(filtroCausa.toLowerCase());
    if (!passesFilter) {
      console.log("Óbito filtrado:", obito);
    }
    return passesFilter;
  });

  const obitosOrdenados = sortObitos(obitosFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentObitos = obitosOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="max-w-6xl mx-auto mt-6 px-4 py-6 bg-gray-50 rounded-2xl shadow-lg">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaSkullCrossbones className="h-6 w-6" />
          Gerenciar Registro de Óbitos
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <FaPlus className="h-4 w-4" />
          Adicionar Registro
        </button>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nome do Paciente
            </label>
            <input
              type="text"
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por nome do paciente"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nome do Profissional
            </label>
            <input
              type="text"
              value={filtroProfissional}
              onChange={(e) => setFiltroProfissional(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por nome do profissional"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Causa do Óbito
            </label>
            <input
              type="text"
              value={filtroCausa}
              onChange={(e) => setFiltroCausa(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por causa do óbito"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Óbitos */}
      <div className="bg-white p-5 rounded-lg shadow-md mb-4">
        {isLoading ? (
          <p className="text-center text-gray-500 py-2 text-sm">Carregando...</p>
        ) : pacientes.length === 0 || profissionais.length === 0 ? (
          <p className="text-center text-gray-500 py-2 text-sm">
            Dados incompletos (pacientes ou profissionais não carregados). Verifique a conexão com a API.
          </p>
        ) : obitosOrdenados.length === 0 ? (
          <p className="text-center text-gray-500 py-2 text-sm">
            Nenhum registro de óbito encontrado.
          </p>
        ) : (
          <div className="rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["ID", "Paciente", "Profissional", "Data do Óbito", "Causa"].map(
                    (header, index) => (
                      <th
                        key={header}
                        onClick={() =>
                          handleSort(
                            [
                              "idRegistroObito",
                              "paciente",
                              "profissional",
                              "dataObito",
                              "causaObito",
                            ][index]
                          )
                        }
                        className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer w-[20%]"
                      >
                        {header}
                        {sortField ===
                          [
                            "idRegistroObito",
                            "paciente",
                            "profissional",
                            "dataObito",
                            "causaObito",
                          ][index] && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    )
                  )}
                  <th className="px-5 py-3 text-left text-sm font-semibold uppercase tracking-wider w-[10%]">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentObitos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-3 text-center text-gray-500 text-sm"
                    >
                      Nenhum registro de óbito encontrado após filtragem.
                    </td>
                  </tr>
                ) : (
                  currentObitos.map((obito) => (
                    <tr key={obito.idRegistroObito} className="hover:bg-gray-100 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-900">
                        {obito.idRegistroObito}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900">
                        {getPacienteNome(obito.cpfPaciente)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900">
                        {getProfissionalNome(obito.matriculaProfissional)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900">
                        {formatDate(obito.dataObito)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900">
                        {obito.causaObito || "N/A"}
                      </td>
                      <td className="px-5 py-3 text-sm flex gap-2">
                        <button
                          onClick={() => openViewModal(obito)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Ver Detalhes"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(obito)}
                          className="text-green-500 hover:text-green-700"
                          title="Editar Registro"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openConfirmDelete(obito)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir Registro"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {obitosOrdenados.length > 0 && (
        <div className="mb-4">
          <Pagination
            totalItems={obitosOrdenados.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      )}

      {/* Modais */}
      <ModalAddObito
        isOpen={isAddModalOpen}
        onClose={closeModals}
        onSubmit={handleAddObito}
        pacientes={pacientes}
        profissionais={profissionais}
        isSaving={isSaving}
      />
      <ModalEditObito
        isOpen={isEditModalOpen}
        onClose={closeModals}
        onSubmit={handleEditObito}
        obito={selectedObito}
        pacientes={pacientes}
        profissionais={profissionais}
        isSaving={isSaving}
      />
      <ModalViewObito
        isOpen={isViewModalOpen}
        onClose={closeModals}
        obito={selectedObito}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleDeleteObito}
        onCancel={closeModals}
        message={
          selectedObito
            ? `Deseja excluir o registro de óbito do paciente ${
                getPacienteNome(selectedObito.cpfPaciente)
              } em ${formatDate(selectedObito.dataObito)}?`
            : ""
        }
        isSaving={isSaving}
      />
    </section>
  );
};

export default GerenciarRegistroObitos;