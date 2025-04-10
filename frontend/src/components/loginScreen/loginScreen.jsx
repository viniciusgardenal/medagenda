import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        { email: username, password: password },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      login(response.data.token);
      navigate("/home");
    } catch (error) {
      setError("Credenciais inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {/* Título */}
        <div className="flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-600 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <h1 className="text-3xl font-bold text-blue-600">MedAgenda</h1>
        </div>

        {/* Subtítulo */}
        <p className="text-center text-gray-600 mb-6">
          Bem-vindo ao seu sistema de gestão de saúde
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-150 disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Link de Recuperação de Senha */}
        <p className="mt-4 text-center text-sm text-gray-600">
          <a
            href="/recuperar-senha"
            className="text-blue-600 hover:underline"
          >
            Esqueceu sua senha?
          </a>
        </p>

        {/* Mensagem de Erro */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;