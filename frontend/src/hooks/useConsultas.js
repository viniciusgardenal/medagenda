import { useState, useEffect } from "react";
import {
  getPacientes,
  getProfissionais,
  getTipoConsulta,
  agendarConsulta,
  getConsultasPorData,
  cancelarConsulta,
} from "../config/apiServices";

export const useConsultas = (initialFilters) => {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(initialFilters);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        consultasResponse,
        pacientesResponse,
        medicosResponse,
        tiposConsultaResponse,
      ] = await Promise.all([
        getConsultasPorData(
          filtros.filtroData,
          filtros.filtroStatus || "", // se não tiver valor, retorna todas
          filtros.filtroNome
        ),
        getPacientes(),
        getProfissionais(),
        getTipoConsulta(),
      ]);

      setConsultas(consultasResponse.data || []);
      setPacientes(pacientesResponse.data || []);
      setMedicos(medicosResponse.data || []);
      setTiposConsulta(tiposConsultaResponse.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar os dados. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    filtros.filtroData,
    filtros.filtroNome,
    filtros.filtroStatus, // agora observa o status do filtro
  ]);

  const handleSalvarConsulta = async (consultaData) => {
    setError(null);
    try {
      const response = await agendarConsulta({
        ...consultaData,
        status: "agendada", // novo status ao criar
      });

      const novaConsulta = response.data.data;

      const consultaEnriquecida = {
        ...novaConsulta,
        paciente: pacientes.find((p) => p.cpf === novaConsulta.cpfPaciente),
        medico: medicos.find((m) => m.matricula === novaConsulta.medicoId),
        tipoConsulta: tiposConsulta.find(
          (t) => t.idTipoConsulta === novaConsulta.idTipoConsulta
        ),
      };

      // só adiciona se o filtro estiver em "agendada"
      if (filtros.filtroStatus === "agendada") {
        setConsultas((prev) => [...prev, consultaEnriquecida]);
      }

      return true;
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      setError(error.response?.data?.error || "Erro ao salvar a consulta.");
      return false;
    }
  };

  const handleCancelConsulta = async (id, motivoCancelamento) => {
    setError(null);
    try {
      const motivo = motivoCancelamento ?? " ";
      const response = await cancelarConsulta(id, {
        motivoCancelamento: motivo,
      });

      // Se o filtro é "agendada", remove a consulta cancelada da lista
      if (filtros.filtroStatus === "agendada") {
        setConsultas((prev) => prev.filter((c) => c.id !== id));
      } else {
        // Atualiza a consulta na lista com o novo status
        setConsultas((prev) =>
          prev.map((c) => (c.id === id ? response.data.data : c))
        );
      }

      return true;
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      const errorMsg =
        error.response?.data?.error || "Erro ao cancelar consulta.";
      setError(errorMsg);
      throw new Error(errorMsg); // Relança o erro para tratamento no Modal
    }
  };

  return {
    consultas,
    pacientes,
    medicos,
    tiposConsulta,
    filtros,
    setFiltros,
    isLoading,
    error,
    setError,
    handleSalvarConsulta,
    handleCancelConsulta,
    fetchData,
  };
};
