import axios from "axios";

const apiUrl = "http://localhost:5000";

export const criarPlanoDeSaude = async (dadosPlanoDeSaude) => {
  return await axios.post(`${apiUrl}/planoDeSaude`, dadosPlanoDeSaude);
};

export const atualizarPlanoDeSaude = async (id, dadosPlanoDeSaude) => {
  return await axios.put(`${apiUrl}/planoDeSaude/${id}`, dadosPlanoDeSaude);
};

export const excluirPlanoDeSaude = async (id) => {
  return await axios.delete(`${apiUrl}/planoDeSaude/${id}`);
};

export const getPlanoDeSaude = async () => {
  return await axios.get(`${apiUrl}/planoDeSaude`);
};

export const getPlanoDeSaudeId = async (id) => {
  return await axios.get(`${apiUrl}/planoDeSaude/${id}`);
};
