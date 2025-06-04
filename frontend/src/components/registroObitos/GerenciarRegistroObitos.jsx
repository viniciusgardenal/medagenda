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
// FaEye, FaEdit, FaTrash podem ser removidos se não forem mais usados em outros lugares após esta alteração
import { FaPlus /*, FaEye, FaEdit, FaTrash */ } from "react-icons/fa";
import moment from "moment";

// Função para formatar CPF com pontuação
const formatarCpfComPontuacao = (cpf) => {
  if (!cpf) return "";
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
  const [successMessage, setSuccessMessage] = useState(null);
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
    setSuccessMessage(null);
    try {
      const [obitosData, pacientesData, profissionaisData] = await Promise.all([
        getRegistroObitos(),
        getPacientes(),
        getProfissionais(),
      ]);
      
      const validObitos = Array.isArray(obitosData?.data)
        ? obitosData.data.filter(
            (o) => o && o.idRegistroObito && o.cpfPaciente && o.matriculaProfissional && o.dataObito
          )
        : [];
      const normalizedObitos = validObitos.map((obito) => ({
        ...obito,
        cpfPaciente: obito.cpfPaciente, 
        matriculaProfissional: parseInt(obito.matriculaProfissional, 10).toString(),
      }));
      setObitos(normalizedObitos || []);


      const validPacientes = Array.isArray(pacientesData?.data)
        ? pacientesData.data.filter((p) => p && p.cpf && p.nome && typeof p.cpf !== "undefined")
        : [];
      const normalizedPacientes = validPacientes.map((paciente) => ({
        ...paciente,
        cpf: paciente.cpf,
      }));
      setPacientes(normalizedPacientes || []);

      const validProfissionais = Array.isArray(profissionaisData?.data)
        ? profissionaisData.data.filter((p) => p && p.matricula && p.nome && typeof p.matricula !== "undefined")
        : [];
      const normalizedProfissionais = validProfissionais.map((profissional) => ({
        ...profissional,
        matricula: parseInt(profissional.matricula, 10).toString(),
      }));
      setProfissionais(normalizedProfissionais || []);

      if (normalizedPacientes.length === 0) console.warn("Nenhum paciente válido encontrado.");
      if (normalizedProfissionais.length === 0) console.warn("Nenhum profissional válido encontrado.");

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

  const getPacienteDetalhes = (cpf) => {
    if (!cpf || !pacientes || pacientes.length === 0) {
      return { nome: "Paciente não informado", status: "N/A" };
    }
    const cpfNormalizadoBusca = normalizarCpf(cpf);
    const pacienteEncontrado = pacientes.find(p => normalizarCpf(p.cpf) === cpfNormalizadoBusca);

    if (pacienteEncontrado) {
      return {
        nome: `${pacienteEncontrado.nome} ${pacienteEncontrado.sobrenome || ''}`,
        status: pacienteEncontrado.status || "N/A" 
      };
    }
    return { nome: "Paciente não encontrado", status: "N/A" };
  };
  
  const getProfissionalNome = (matricula) => {
    if (!matricula) return "Profissional não encontrado";
    const normalizedMatricula = parseInt(matricula, 10).toString();
    const profissional = profissionais.find((p) => parseInt(p.matricula, 10).toString() === normalizedMatricula);
    return profissional ? `${profissional.nome} ${profissional.sobrenome || ''}` : "Profissional não encontrado";
  };

  const handleAddObito = async (dadosObito) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await criarRegistroObito(dadosObito); 
      setSuccessMessage("Registro de óbito adicionado com sucesso! Atualizando lista...");
      setIsAddModalOpen(false);
      await fetchData(); 
    } catch (err) {
      console.error("Erro ao adicionar registro:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || "Erro ao adicionar registro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditObito = async (id, dadosObito) => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await updateRegistroObito(id, dadosObito); 
      setSuccessMessage("Registro de óbito atualizado com sucesso! Atualizando lista...");
      setIsEditModalOpen(false);
      await fetchData(); 
    } catch (err) {
      console.error("Erro ao editar registro:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || "Erro ao editar registro. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteObito = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const backendResponse = await excluirRegistroObito(selectedObito.idRegistroObito);
      setSuccessMessage(backendResponse?.message || "Registro de óbito excluído com sucesso! Atualizando lista...");
      setIsConfirmModalOpen(false);
      setSelectedObito(null);
      await fetchData(); 
    } catch (err) {
      console.error("Erro ao excluir registro:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || "Erro ao excluir registro. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (obito) => { setSelectedObito(obito); setIsEditModalOpen(true); setError(null); setSuccessMessage(null);};
  const openViewModal = (obito) => { setSelectedObito(obito); setIsViewModalOpen(true); setError(null); setSuccessMessage(null);};
  const openConfirmDelete = (obito) => { setSelectedObito(obito); setIsConfirmModalOpen(true); setError(null); setSuccessMessage(null);};
  const openAddModal = () => { setIsAddModalOpen(true); setError(null); setSuccessMessage(null);};

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setIsConfirmModalOpen(false);
    setSelectedObito(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Data inválida";
    const parsedDate = moment(dateString);
    return parsedDate.isValid() ? parsedDate.format("DD/MM/YYYY HH:mm") : "Data inválida";
  };

  const sortObitos = (obitosToSort) => {
    return [...obitosToSort].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        idRegistroObito: (item) => item.idRegistroObito,
        paciente: (item) => getPacienteDetalhes(item.cpfPaciente).nome.toLowerCase(),
        profissional: (item) => getProfissionalNome(item.matriculaProfissional).toLowerCase(),
        dataObito: (item) => moment(item.dataObito).valueOf(),
        causaObito: (item) => (item.causaObito || "").toLowerCase(),
      };
      
      valueA = fieldMap[sortField] ? fieldMap[sortField](a) : '';
      valueB = fieldMap[sortField] ? fieldMap[sortField](b) : '';

      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }
      return String(valueA).toLowerCase().localeCompare(String(valueB).toLowerCase()) * direction;
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
    const pacienteNome = getPacienteDetalhes(obito.cpfPaciente).nome.toLowerCase();
    const profissionalNome = getProfissionalNome(obito.matriculaProfissional).toLowerCase();
    const causa = obito.causaObito ? obito.causaObito.toLowerCase() : "";
    return (
      pacienteNome.includes(filtroPaciente.toLowerCase()) &&
      profissionalNome.includes(filtroProfissional.toLowerCase()) &&
      causa.includes(filtroCausa.toLowerCase())
    );
  });

  const obitosOrdenados = sortObitos(obitosFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentObitos = obitosOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const tableHeaders = ["ID", "Paciente", "Profissional", "Data do Óbito", "Causa"];
  const sortableFields = ["idRegistroObito", "paciente", "profissional", "dataObito", "causaObito"];

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Registro de Óbitos
          </h2>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Novo Registro
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
            {error}
          </div>
        )}
        {successMessage && (
            <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300" role="alert">
                {successMessage}
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label htmlFor="filtroPaciente" className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Paciente
            </label>
            <input
              id="filtroPaciente"
              type="text"
              value={filtroPaciente}
              onChange={(e) => setFiltroPaciente(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por paciente"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroProfissional" className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Profissional
            </label>
            <input
              id="filtroProfissional"
              type="text"
              value={filtroProfissional}
              onChange={(e) => setFiltroProfissional(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por profissional"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroCausa" className="block text-sm font-semibold text-gray-700 mb-1">
              Causa do Óbito
            </label>
            <input
              id="filtroCausa"
              type="text"
              value={filtroCausa}
              onChange={(e) => setFiltroCausa(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por causa"
            />
          </div>
        </div>

        {/* INÍCIO DA SEÇÃO DA TABELA ATUALIZADA COM ÍCONES SVG */}
        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Carregando registros...
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {tableHeaders.map((header, index) => (
                      <th
                        key={header}
                        onClick={() => handleSort(sortableFields[index])}
                        className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        {header}
                        {sortField === sortableFields[index] && (
                          <span className="ml-2" aria-hidden="true">
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
                      colSpan={tableHeaders.length + 1} 
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      {obitosFiltrados.length === 0 && (filtroPaciente || filtroProfissional || filtroCausa) 
                        ? "Nenhum registro encontrado após filtragem."
                        : "Nenhum registro de óbito encontrado."}
                    </td>
                  </tr>
                ) : (
                  currentObitos.map((obito) => {
                    const pacienteInfo = getPacienteDetalhes(obito.cpfPaciente);
                    const statusDoRegistroDeObitoLower = obito.status ? obito.status.toLowerCase() : "n/a";
                    const exibirSeloFalecido = statusDoRegistroDeObitoLower === "ativo";
                    
                    return (
                      <tr key={obito.idRegistroObito} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {obito.idRegistroObito}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {pacienteInfo.nome}
                          {exibirSeloFalecido && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-black rounded-full">
                              Falecido
                            </span>
                          )}
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
                            title="Visualizar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(obito)}
                            className="text-yellow-500 hover:text-yellow-700 transition-colors"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openConfirmDelete(obito)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Excluir"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
        {/* FIM DA SEÇÃO DA TABELA ATUALIZADA */}

        {obitosOrdenados.length > itemsPerPage && (
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

        <ModalAddObito isOpen={isAddModalOpen} onClose={closeModals} onSubmit={handleAddObito} pacientes={pacientes} profissionais={profissionais} isSaving={isSaving} />
        <ModalEditObito isOpen={isEditModalOpen} onClose={closeModals} onSubmit={handleEditObito} obito={selectedObito} pacientes={pacientes} profissionais={profissionais} isSaving={isSaving} />
        <ModalViewObito isOpen={isViewModalOpen} onClose={closeModals} obito={selectedObito} pacientes={pacientes} profissionais={profissionais} />
        <ConfirmationModal isOpen={isConfirmModalOpen} onConfirm={handleDeleteObito} onCancel={closeModals} message={ selectedObito ? `Deseja excluir o registro de óbito do paciente ${ getPacienteDetalhes(selectedObito.cpfPaciente).nome } em ${formatDate(selectedObito.dataObito)}?` : "" } isSaving={isSaving} />
      </section>
    </div>
  );
};

export default GerenciarRegistroObitos;