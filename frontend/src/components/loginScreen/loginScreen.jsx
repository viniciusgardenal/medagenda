import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#001233]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#001233]">
          MedAgenda
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border rounded-md py-2 px-3 w-full"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2">
              Senha:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border rounded-md py-2 px-3 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#001233] text-white py-2 px-4 rounded-md w-full hover:bg-[#002568]"
          >
            Entrar
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default LoginScreen;
