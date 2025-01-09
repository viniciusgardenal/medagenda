import axios from "axios";

const apiUrl = "http://localhost:5000";

export const criarTipoConsulta = async (dadosTipoConsulta) => {
  return await axios.post(`${apiUrl}/tipoConsulta`, dadosTipoConsulta);
};

export const updateTipoConsulta = async (id, dadosTipoConsulta) => {
  return await axios.put(`${apiUrl}/tipoConsulta/${id}`, dadosTipoConsulta);
};

export const excluirTipoConsulta = async (id) => {
  return await axios.delete(`${apiUrl}/tipoConsulta/${id}`);
};

export const getTipoConsulta = async () => {
  return await axios.get(`${apiUrl}/tipoConsulta`);
};

export const getTipoConsultaId = async (id) => {
  return await axios.get(`${apiUrl}/tipoConsulta/${id}`);
};
