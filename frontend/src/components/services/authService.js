// src/services/authService.js
import axios from "../config/axiosConfig";

export const loginService = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", { email, password });
    return response.data.token;
  } catch (error) {
    throw new Error("Erro ao fazer login");
  }
};
