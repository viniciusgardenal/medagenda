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
import moment from "moment";

// Função para formatar CPF com pontuação
const formatarCpfComPontuacao = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return cpf;
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9)}`;
};

// Função para normalizar CPF (remover pontuação)
const normalizarCpf = (cpf) => {
  return cpf ? cpf.replace(/\D/g, "") : "";
};

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
      console.log("Resposta de getRegistroObitos:", obitosData);
      console.log("Tipo de obitosData.data:", typeof obitosData.data, Array.isArray(obitosData.data) ? "Array" : "Não é array");

      const validObitos = Array.isArray(obitosData.data)
        ? obitosData.data.filter(
            (o) => o && o.idRegistroObito && o.cpfPaciente && o.matriculaProfissional && o.dataObito
          )
        : [];
      if (!Array.isArray(obitosData.data)) {
        console.warn("obitosData.data não é um array:", obitosData.data);
        setError("Formato de dados inválido retornado pela API de óbitos. Esperado: array.");
      }

      const validPacientes = Array.isArray(pacientesData.data)
        ? pacientesData.data.filter((p) => p && p.cpf && p.nome && typeof p.cpf !== "undefined")
        : [];
      const validProfissionais = Array.isArray(profissionaisData.data)
        ? profissionaisData.data.filter((p) => p && p.matricula && p.nome && typeof p.matricula !== "undefined")
        : [];

      // Normalizar dados
      const normalizedObitos = validObitos.map((obito) => ({
        ...obito,
        cpfPaciente: obito.cpfPaciente, // Mantém o formato do banco
        matriculaProfissional: parseInt(obito.matriculaProfissional, 10).toString(),
      }));
      const normalizedPacientes = validPacientes.map((paciente) => ({
        ...paciente,
        cpf: paciente.cpf, // Mantém com pontuação
      }));
      const normalizedProfissionais = validProfissionais.map((profissional) => ({
        ...profissional,
        matricula: parseInt(profissional.matricula, 10).toString(),
      }));

      setObitos(normalizedObitos || []);
      setPacientes(normalizedPacientes || []);
      setProfissionais(normalizedProfissionais || []);
      console.log("Pacientes carregados:", normalizedPacientes);
      console.log("Profissionais carregados:", normalizedProfissionais);
      console.log("Óbitos carregados:", normalizedObitos);

      if (normalizedPacientes.length === 0) {
        console.warn("Nenhum paciente válido encontrado.");
        setError("Nenhum paciente válido encontrado. Verifique a fonte de dados.");
      }
      if (normalizedProfissionais.length === 0) {
        console.warn("Nenhum profissional válido encontrado.");
        setError("Nenhum profissional válido encontrado. Verifique a fonte de dados.");
      }
      if (normalizedObitos.length === 0) {
        console.warn("Nenhum óbito válido encontrado.");
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Não foi possível carregar os dados. Verifique a conexão com a API.");
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
        idRegistroObito: response.data.idRegistroObito || Date.now(),
        cpfPaciente: response.data.cpfPaciente, // Mantém com pontuação
        matriculaProfissional: parseInt(response.data.matriculaProfissional, 10).toString(),
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
      setFiltroPaciente("");
      setFiltroProfissional("");
      setFiltroCausa("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Erro ao adicionar registro:", err);
      setError("Erro ao adicionar registro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditObito = async (id, dadosObito) => {
    setIsSaving(true);
    console.log("Editando registro ID:", id, "com dados:", dadosObito);
    console.log("Lista de pacientes disponíveis:", pacientes);
    try {
      // Validar CPF antes de enviar
      if (!pacientes.length) {
        throw new Error("Nenhum paciente disponível. Carregue a lista de pacientes primeiro.");
      }
      if (dadosObito.cpfPaciente) {
        const cpfComPontuacao = formatarCpfComPontuacao(dadosObito.cpfPaciente);
        const pacienteExiste = pacientes.find((p) => p.cpf === cpfComPontuacao);
        if (!pacienteExiste) {
          throw new Error(`Paciente com CPF ${dadosObito.cpfPaciente} não encontrado na lista de pacientes.`);
        }
        dadosObito.cpfPaciente = cpfComPontuacao; // Usa CPF com pontuação
      } else {
        throw new Error("CPF do paciente é obrigatório.");
      }

      const response = await updateRegistroObito(id, dadosObito);
      setObitos(obitos.map((obito) => (obito.idRegistroObito === id ? {
        ...response.registro,
        cpfPaciente: response.registro.cpfPaciente, // Mantém com pontuação
        matriculaProfissional: parseInt(response.registro.matriculaProfissional, 10).toString(),
      } : obito)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Erro ao editar registro:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erro ao editar registro. Verifique os dados e tente novamente.";
      setError(errorMessage);
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
    if (!dateString) {
      console.warn("Data inválida fornecida:", dateString);
      return "Data inválida";
    }
    const parsedDate = moment(dateString, ["YYYY-MM-DDTHH:mm", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601]);
    if (!parsedDate.isValid()) {
      console.warn("Formato de data inválido:", dateString);
      return "Data inválida";
    }
    return parsedDate.format("DD/MM/YYYY HH:mm");
  };

  const getPacienteNome = (cpf) => {
    if (!cpf) {
      console.warn("CPF inválido fornecido:", cpf);
      return "Paciente não encontrado";
    }
    const cpfNormalizado = normalizarCpf(cpf);
    const paciente = pacientes.find((p) => {
      if (!p || typeof p.cpf === "undefined") {
        console.warn("Paciente inválido:", p);
        return false;
      }
      return normalizarCpf(p.cpf) === cpfNormalizado;
    });
    if (!paciente) {
      console.warn("Nenhum paciente encontrado para CPF:", cpf, "Normalizado:", cpfNormalizado);
    }
    return paciente ? `${paciente.nome} ${paciente.sobrenome || ''}` : "Paciente não encontrado";
  };

  const getProfissionalNome = (matricula) => {
    if (!matricula) {
      console.warn("Matrícula inválida fornecida:", matricula);
      return "Profissional não encontrado";
    }
    const normalizedMatricula = parseInt(matricula, 10).toString();
    const profissional = profissionais.find((p) => {
      if (!p || typeof p.matricula === "undefined") {
        console.warn("Profissional inválido:", p);
        return false;
      }
      const normalizedProfissionalMatricula = parseInt(p.matricula, 10).toString();
      return normalizedProfissionalMatricula === normalizedMatricula;
    });
    if (!profissional) {
      console.warn("Nenhum profissional encontrado para matrícula:", normalizedMatricula);
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
        dataObito: (item) => moment(item.dataObito).valueOf(),
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
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Registro de Óbitos
          </h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Novo Registro
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Paciente
            </label>
            <input
              type="text"
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por paciente"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Profissional
            </label>
            <input
              type="text"
              value={filtroProfissional}
              onChange={(e) => setFiltroProfissional(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por profissional"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Causa do Óbito
            </label>
            <input
              type="text"
              value={filtroCausa}
              onChange={(e) => setFiltroCausa(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por causa"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Carregando registros...
            </p>
          ) : pacientes.length === 0 || profissionais.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Dados incompletos. Verifique a conexão com a API.
            </p>
          ) : obitosOrdenados.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhum registro de óbito encontrado.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
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
                        className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer"
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
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    )
                  )}
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentObitos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      Nenhum registro encontrado após filtragem.
                    </td>
                  </tr>
                ) : (
                  currentObitos.map((obito) => (
                    <tr key={obito.idRegistroObito} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {obito.idRegistroObito}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getPacienteNome(obito.cpfPaciente)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getProfissionalNome(obito.matriculaProfissional)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(obito.dataObito)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {obito.causaObito || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <button
                          onClick={() => openViewModal(obito)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Ver Detalhes"
                        >
                          <FaEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openEditModal(obito)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Editar Registro"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openConfirmDelete(obito)}
                          className="text-red-600 hover:text-red-700 transition-colors"
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
          )}
        </div>

        {obitosOrdenados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={obitosOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

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
    </div>
  );
};

export default GerenciarRegistroObitos;