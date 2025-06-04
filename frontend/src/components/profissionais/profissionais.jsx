import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getProfissionais,
  getProfissionaisId,
  excluirProfissional,
} from "../../config/apiServices";
import ModalProfissional from "./modalProfissional";
import ModalEditarProfissional from "./modalEditarProfissional";
import ModalDetalhesProfissional from "./modalDetalhesProfissional";
import Pagination from "../util/Pagination";

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadProfissionais = async () => {
    try {
      const response = await getProfissionais();
      setProfissionais(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    }
  };

  useEffect(() => {
    loadProfissionais();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
  };

  const sortProfissionais = (profissionais) => {
    return [...profissionais].sort((a, b) => {
      const fieldMap = {
        nome: (item) => item.nome.toLowerCase(),
        email: (item) => item.email.toLowerCase(),
        telefone: (item) => item.telefone,
        tipoProfissional: (item) => item.tipoProfissional.toLowerCase(),
        dataNascimento: (item) => new Date(item.dataNascimento).valueOf(),
      };
      const valueA = fieldMap[sortField](a);
      const valueB = fieldMap[sortField](b);

      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortField === "dataNascimento") {
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

  const profissionaisFiltrados = profissionais.filter((profissional) => {
    const pesquisa = filtro.toLowerCase();
    return (
      profissional.nome.toLowerCase().includes(pesquisa) ||
      profissional.email.toLowerCase().includes(pesquisa) ||
      profissional.telefone.includes(pesquisa) ||
      profissional.tipoProfissional.toLowerCase().includes(pesquisa) ||
      profissional.dataNascimento.toLowerCase().includes(pesquisa)
    );
  });

  const profissionaisOrdenados = sortProfissionais(profissionaisFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfissionais = profissionaisOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirProfissional(idToDelete);
      setShowAlert(true);
      await loadProfissionais();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadProfissionais();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (matricula) => {
    try {
      const response = await getProfissionaisId(matricula);
      const profissional = response.data;
      setProfissionalSelecionado({ ...profissional });
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar profissional:", error);
    }
  };

  const handleDetalhes = async (matricula) => {
    try {
      const response = await getProfissionaisId(matricula);
      const profissional = response.data;
      setProfissionalSelecionado({ ...profissional });
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do profissional:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setProfissionalSelecionado(null);
  };

  const handleUpdateProfissionais = () => {
    loadProfissionais();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Profissionais
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Cadastrar Profissional
          </button>
        </div>

        {showAlert && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            Excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            Adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            Editado com sucesso!
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome, E-mail, Telefone ou Profissional
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Filtrar por nome, e-mail, telefone ou profissional"
              />
              {filtro && (
                <button
                  onClick={() => handleFiltroChange({ target: { value: "" } })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {profissionais.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhum profissional encontrado.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Nome", "E-mail", "Telefone", "Tipo Profissional", "Data de Nascimento"].map(
                    (header, index) => (
                      <th
                        key={header}
                        onClick={() =>
                          handleSort(
                            ["nome", "email", "telefone", "tipoProfissional", "dataNascimento"][index]
                          )
                        }
                        className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer"
                      >
                        {header}
                        {sortField ===
                          ["nome", "email", "telefone", "tipoProfissional", "dataNascimento"][index] && (
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
                {currentProfissionais.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500 text-sm"
                    >
                      Nenhum profissional encontrado após filtragem.
                    </td>
                  </tr>
                ) : (
                  currentProfissionais.map((profissional) => (
                    <tr key={profissional.matricula} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {profissional.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {profissional.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {profissional.telefone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {profissional.tipoProfissional}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {profissional.dataNascimento}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-3">
                        <button
                          onClick={() => handleDetalhes(profissional.matricula)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Ver Detalhes"
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
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditar(profissional.matricula)}
                          className="text-yellow-500 hover:text-yellow-700 transition-colors"
                          title="Editar Profissional"
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
                          onClick={() => handleDelete(profissional.matricula)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Excluir Profissional"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {profissionaisOrdenados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={profissionaisOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        <ModalProfissional
          isOpen={isModalOpenAdd}
          onClose={() => setIsModalOpenAdd(false)}
          onSave={handleSave}
        />
        {isModalOpenEditar && profissionalSelecionado && (
          <ModalEditarProfissional
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            profissional={profissionalSelecionado}
            onUpdate={handleUpdateProfissionais}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
            message="Deseja excluir este profissional?"
          />
        )}
        {isModalOpenDetalhes && profissionalSelecionado && (
          <ModalDetalhesProfissional
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            profissional={profissionalSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default Profissionais;