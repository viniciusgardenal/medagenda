import React, { useState } from "react";
import { criarPlanoDeSaude } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";

const ModalPlanoDeSaude = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nomeOperadora: "",
    codigoPlano: "",
    tipoPlano: "Individual",
    status: "Ativo",
  });
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErros({ ...erros, [name]: "" });
  };

  const validarCampos = () => {
    const newErros = {};
    if (!formData.nomeOperadora.trim()) {
      newErros.nomeOperadora = "O nome da operadora é obrigatório.";
    }
    if (!formData.codigoPlano.trim()) {
      newErros.codigoPlano = "O código do plano é obrigatório.";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    try {
      await criarPlanoDeSaude(formData);
      setShowSuccessAlert(true);
      onSave();
      onClose();
      setFormData({
        nomeOperadora: "",
        codigoPlano: "",
        tipoPlano: "Individual",
        status: "Ativo",
      });
      setErros({});
    } catch (error) {
      console.error("Erro ao criar plano de saúde:", error);
      setErros({ geral: "Erro ao salvar o plano de saúde. Tente novamente." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {showSuccessAlert && (
          <SuccessAlert
            message="Plano de saúde criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">
            Adicionar Plano de Saúde
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
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
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome da Operadora
            </label>
            <input
              type="text"
              name="nomeOperadora"
              value={formData.nomeOperadora}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.nomeOperadora && (
              <span className="text-red-500 text-xs mt-1">
                {erros.nomeOperadora}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código do Plano
            </label>
            <input
              type="text"
              name="codigoPlano"
              value={formData.codigoPlano}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {erros.codigoPlano && (
              <span className="text-red-500 text-xs mt-1">
                {erros.codigoPlano}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de Plano
            </label>
            <select
              name="tipoPlano"
              value={formData.tipoPlano}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Individual">Individual</option>
              <option value="Familiar">Familiar</option>
              <option value="Empresarial">Empresarial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
          {erros.geral && (
            <span className="text-red-500 text-xs mt-1 block">
              {erros.geral}
            </span>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPlanoDeSaude;
