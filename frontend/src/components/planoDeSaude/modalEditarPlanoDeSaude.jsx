import React, { useState, useEffect } from "react";
import { atualizarPlanoDeSaude } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";

const ModalEditarPlanoDeSaude = ({ isOpen, onClose, plano, onUpdate }) => {
  const [formData, setFormData] = useState({
    nomeOperadora: "",
    codigoPlano: "",
    descricao: "",
    tipoPlano: "",
    dataInicio: "",
    dataFim: "",
    status: "Ativo",
  });

  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (plano) {
      setFormData({
        nomeOperadora: plano.nomeOperadora || "",
        codigoPlano: plano.codigoPlano || "",
        descricao: plano.descricao || "",
        tipoPlano: plano.tipoPlano || "",
        dataInicio: plano.dataInicio || "",
        dataFim: plano.dataFim || "",
        status: plano.status || "Ativo",
      });
      setErros({});
    }
  }, [plano]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarCampos = () => {
    const newErros = {};
    if (!formData.nomeOperadora) newErros.nomeOperadora = "O nome da operadora é obrigatório!";
    if (!formData.codigoPlano) newErros.codigoPlano = "O código do plano é obrigatório!";
    if (!formData.tipoPlano) newErros.tipoPlano = "O tipo do plano é obrigatório!";
    if (!formData.dataInicio) newErros.dataInicio = "A data de início é obrigatória!";

    if (formData.dataInicio && formData.dataFim && formData.dataFim < formData.dataInicio) {
      newErros.dataFim = "A data de fim não pode ser anterior à data de início.";
    }

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;
    if (!plano || !plano.idPlanoSaude) {
      setErros({ geral: "Erro: ID do plano não encontrado." });
      return;
    }

    try {
      setIsLoading(true);
      const response = await atualizarPlanoDeSaude(plano.idPlanoSaude, formData);
      setShowSuccessAlert(true);
      setTimeout(() => {
        onUpdate(response.plano);
        onClose();
      }, 250); // Reduzido de 2000ms para 1000ms
    } catch (error) {
      console.error("Erro ao atualizar plano de saúde:", error);
      setErros({ geral: "Erro ao salvar as alterações. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
        {showSuccessAlert && (
          <SuccessAlert message="Plano de saúde atualizado com sucesso!" />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">Editar Plano de Saúde</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nome da Operadora:
              </label>
              <input
                type="text"
                name="nomeOperadora"
                value={formData.nomeOperadora}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
              {erros.nomeOperadora && (
                <span className="text-red-500 text-xs mt-1">
                  {erros.nomeOperadora}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Código do Plano:
              </label>
              <input
                type="text"
                name="codigoPlano"
                value={formData.codigoPlano}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
              {erros.codigoPlano && (
                <span className="text-red-500 text-xs mt-1">
                  {erros.codigoPlano}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descrição:
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data de Início:
              </label>
              <input
                type="date"
                name="dataInicio"
                value={formData.dataInicio}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
              {erros.dataInicio && (
                <span className="text-red-500 text-xs mt-1">
                  {erros.dataInicio}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Data de Fim:
              </label>
              <input
                type="date"
                name="dataFim"
                value={formData.dataFim}
                onChange={handleChange}
                min={formData.dataInicio}
                className="w-full px-3 py-2 text-sm border rounded-md"
              />
              {erros.dataFim && (
                <span className="text-red-500 text-xs mt-1">{erros.dataFim}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo do Plano:
              </label>
              <select
                name="tipoPlano"
                value={formData.tipoPlano}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-white"
              >
                <option value="Individual">Individual</option>
                <option value="Familiar">Familiar</option>
                <option value="Empresarial">Empresarial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status:
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-white"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          {erros.geral && (
            <span className="text-red-500 text-xs mt-1 block text-center">
              {erros.geral}
            </span>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPlanoDeSaude;