import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/login",
        { email: username, password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      login(response.data.token);
      navigate("/home");
    } catch (error) {
      setError("E-mail ou senha incorretos. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Painel Esquerdo — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col items-center justify-center p-12">
        <div className="max-w-sm text-center">
          {/* Ícone */}
          <div className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4m0 0v4m0-4h4m-4 0H8" />
              <circle cx="12" cy="12" r="9" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">MedAgenda</h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Sistema integrado de gestão médico-administrativa para otimizar processos e melhorar o atendimento ao paciente.
          </p>

          {/* Separador */}
          <div className="mt-10 pt-8 border-t border-slate-700/60">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-white font-semibold text-lg">+500</p>
                <p className="text-slate-500 text-xs mt-0.5">Pacientes</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">99%</p>
                <p className="text-slate-500 text-xs mt-0.5">Uptime</p>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">24/7</p>
                <p className="text-slate-500 text-xs mt-0.5">Disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Painel Direito — Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Header mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4m0 0v4m0-4h4m-4 0H8" />
                <circle cx="12" cy="12" r="9" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">MedAgenda</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">Bem-vindo de volta</h2>
          <p className="text-slate-500 text-sm mb-8">Acesse sua conta para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="seu@email.com"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 text-white py-2.5 px-4 rounded-md text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Autenticando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => alert("A recuperação de senha não está disponível. Entre em contato com o administrador.")}
              className="text-sm text-blue-700 hover:text-blue-800 bg-transparent border-none p-0 cursor-pointer hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <p className="text-center text-slate-400 text-xs mt-12">
            MedAgenda © {new Date().getFullYear()} · Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;