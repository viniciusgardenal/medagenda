import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import { criarAtestado, getPacientes } from "../../config/apiServices";
import { FileText, Save } from "lucide-react";
import { useAuthContext } from "../../context/authContext";
import { criarAtestado, getPacientes } from "../../config/apiServices";
import { FileText, Save } from "lucide-react";

const GerarAtestados = () => {
  const { user } = useAuthContext();
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [tipoAtestado, setTipoAtestado] = useState("");
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDados = async () => {
      try {
        const pacienteResponse = await getPacientes();
        if (Array.isArray(pacienteResponse.data)) {
          setCpfPaciente(pacienteResponse.data);
        } else {
          console.error("Os dados de pacientes não são um array", pacienteResponse.data);
          setError("Erro ao carregar lista de pacientes.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados de pacientes", error);
        setError("Erro ao carregar pacientes. Tente novamente.");
      }
    };

    loadDados();

    if (user?.id) {
      setMatriculaProfissional(user.id);
    } else {
      setError("Profissional não autenticado. Faça login novamente.");
    }
  }, [user]);

  const handlePacienteChange = (event) => {
    setPacienteSelecionado(event.target.value);
    setError(null);
  };

  const handleTipoAtestadoChange = (event) => {
    setTipoAtestado(event.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validação no frontend
    if (!pacienteSelecionado || !matriculaProfissional || !tipoAtestado) {
      setError("Por favor, preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    const dados = {
      cpfPaciente: pacienteSelecionado,
      matriculaProfissional,
      tipoAtestado,
    };

    console.log("Dados enviados:", dados); // Debug para verificar os dados

    try {
      const response = await criarAtestado(dados);

      // Verifica se houve erro no status
      if (response.status !== 200) {
        const errorBlob = response.data;
        const errorText = await errorBlob.text(); // Converte Blob para texto
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || "Erro desconhecido no servidor");
      }

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `atestado_${dados.cpfPaciente}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setPacienteSelecionado("");
      setTipoAtestado("");
    } catch (error) {
      console.error("Erro ao gerar atestado:", error);
      setError(error.message || "Erro ao gerar o atestado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

    return (
        <div className="gerar-atestados-container">
            <h2>Gerar Atestados Médicos</h2>
            <form className="atestado-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Paciente:</label>
                    <select
                        name="PacienteCpf"
                        value={pacienteSelecionado}
                        onChange={handlePacienteChange}
                        required
                    >
                        <option value="">Selecione o Paciente</option>
                        {Array.isArray(cpfPaciente) &&
                            cpfPaciente.map((pac) => (
                                <option value={pac.cpf} key={pac.cpf}>
                                    {pac.nome} {pac.sobrenome} (CPF: {pac.cpf})
                                </option>
                            ))}
                    </select>
                </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profissional
            </label>
            <input
              type="text"
              value={`${user?.nome || "Nome não disponível"} (Matrícula: ${user?.id || "Matrícula não disponível"})`}
              readOnly
              required
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Atestado
            </label>
            <select
              value={tipoAtestado}
              onChange={handleTipoAtestadoChange}
              required
              disabled={isLoading}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-700 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecione o Tipo de Atestado</option>
              <option value="Médico">Médico</option>
              <option value="Odontológico">Odontológico</option>
              <option value="Psicológico">Psicológico</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150 flex items-center font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              <Save className="mr-2" size={18} />
              {isLoading ? "Gerando..." : "Gerar Atestado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GerarAtestados;