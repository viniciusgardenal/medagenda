import { useState, useEffect } from "react";
import {
  getPacientes,
  getProfissionais,
  getTipoConsulta,
  agendarConsulta,
  getConsultasPorData,
  cancelarConsulta,
} from "../config/apiServices";

export const useConsultas = (initialFilters, initialStatus) => {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [tiposConsulta, setTiposConsulta] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState(initialFilters);
  const [status, setStatus] = useState(initialStatus);

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
        getConsultasPorData(filtros.filtroData, status, filtros.filtroNome),
        getPacientes(),
        getProfissionais(),
        getTipoConsulta(),
      ]);

      // console.log("useConsultas:", consultasResponse.data);
      // console.log("Pacientes:", pacientesResponse.data);
      // console.log("Médicos:", medicosResponse.data.data);
      // console.log("Tipos de Consulta:", tiposConsultaResponse.data.data);

      setConsultas(consultasResponse.data.data || []);
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
  }, [filtros.filtroData, filtros.filtroNome, status]);

  const handleSalvarConsulta = async (consultaData) => {
    setError(null);
    console.log("Dados da consulta:", consultaData);

    try {
      const response = await agendarConsulta({
        ...consultaData,
        status: "agendada",
      });
      if (status === "agendada") {
        setConsultas((prev) => [...prev, response.data.data]);
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
      const response = await cancelarConsulta(id, motivoCancelamento);
      setConsultas((prev) =>
        prev.map((c) => (c.id === id ? response.data.data : c))
      );
      return true;
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      setError(error.response?.data?.error || "Erro ao cancelar consulta.");
      return false;
    }
  };

  return {
    consultas,
    pacientes,
    medicos,
    tiposConsulta,
    filtros,
    setFiltros,
    status,
    setStatus,
    isLoading,
    error,
    setError,
    handleSalvarConsulta,
    handleCancelConsulta,
    fetchData,
  };
};
