import axios from "axios";

const apiUrl = "http://localhost:5000";

export const criarSolicitacaoExames = async (dadosSolicitacaoExames) => {
  return await axios.post(`${apiUrl}/solicitacaoExames`, dadosSolicitacaoExames);
};

export const updateSolicitacaoExames = async (id, dadosSolicitacaoExames) => {
  return await axios.put(`${apiUrl}/solicitacaoExames/${id}`, dadosSolicitacaoExames);
};

export const excluirSolicitacaoExames = async (id) => {
  return await axios.delete(`${apiUrl}/solicitacaoExames/${id}`);
};

export const getSolicitacaoExames = async () => {
  return await axios.get(`${apiUrl}/solicitacaoExames`);
};

export const getSolicitacaoExamesId = async (id) => {
  return await axios.get(`${apiUrl}/solicitacaoExames/${id}`);
};
