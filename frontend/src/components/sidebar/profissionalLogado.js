// services/profissionalService.js
import axios from "axios";

const apiUrl = "http://localhost:5000";

export const getProfissionaisId = async (id) => {
  return await axios.get(`${apiUrl}/profissionais/${id}`);
};
