import api from "./axiosConfig";
const apiUrl = "http://localhost:5000";

export const cancelarConsulta = async (id, motivoCancelamento) => {
  try {
    const response = await api.put(`${apiUrl}/consultas/${id}/cancelar`, {
      motivoCancelamento,
    });
    return response;
  } catch (error) {
    console.error(
      "Erro ao cancelar consulta:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao cancelar consulta" };
  }
};

export const criarProfissional = async (dadosProfissional) => {
  return await api.post(`${apiUrl}/profissionais`, dadosProfissional);
};

export const updateProfissional = async (matricula, dadosProfissional) => {
  return await api.put(
    `${apiUrl}/profissionais/${matricula}`,
    dadosProfissional
  );
};

export const excluirProfissional = async (id) => {
  return await api.delete(`${apiUrl}/profissionais/${id}`);
};

export const getProfissionais = async () => {
  return await api.get(`${apiUrl}/profissionais`);
};

export const getProfissionaisId = async (id) => {
  return await api.get(`${apiUrl}/profissionais/${id}`);
};

export const criarPacientes = async (dadosPacientes) => {
  return await api.post(`${apiUrl}/pacientes`, dadosPacientes);
};

export const updatePacientes = async (cpf, dadosPacientes) => {
  return await api.put(`${apiUrl}/pacientes/${cpf}`, dadosPacientes);
};

export const excluirPacientes = async (id) => {
  return await api.delete(`${apiUrl}/pacientes/${id}`);
};

export const getPacientes = async () => {
  return await api.get(`${apiUrl}/pacientes`);
};

export const getPacientesId = async (cpf) => {
  try {
    const response = await api.get(`/pacientes/${cpf}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const criarTipoExame = async (dadosTipoExame) => {
  return await api.post(`${apiUrl}/tiposExames`, dadosTipoExame);
};

export const updateTipoExame = async (id, dadosTipoExame) => {
  return await api.put(`${apiUrl}/tiposExames/${id}`, dadosTipoExame);
};

export const excluirTipoExame = async (id) => {
  return await api.delete(`${apiUrl}/tiposExames/${id}`);
};

export const getTiposExames = async () => {
  return await api.get(`${apiUrl}/tiposExames`);
};

export const getTiposExamesId = async (id) => {
  return await api.get(`${apiUrl}/tiposExames/${id}`);
};

export const criarPlanoDeSaude = async (dadosPlanoDeSaude) => {
  return await api.post(`${apiUrl}/planoDeSaude`, dadosPlanoDeSaude);
};

export const atualizarPlanoDeSaude = async (id, dadosPlanoDeSaude) => {
  return await api.put(`${apiUrl}/planoDeSaude/${id}`, dadosPlanoDeSaude);
};

export const excluirPlanoDeSaude = async (id) => {
  return await api.delete(`${apiUrl}/planoDeSaude/${id}`);
};

export const getPlanoDeSaude = async () => {
  return await api.get(`${apiUrl}/planoDeSaude`);
};

export const getPlanoDeSaudeId = async (id) => {
  return await api.get(`${apiUrl}/planoDeSaude/${id}`);
};

export const criarTipoConsulta = async (dadosTipoConsulta) => {
  console.log(dadosTipoConsulta);
  return await api.post(`${apiUrl}/tipoConsulta`, dadosTipoConsulta);
};

export const updateTipoConsulta = async (id, dadosTipoConsulta) => {
  return await api.put(`${apiUrl}/tipoConsulta/${id}`, dadosTipoConsulta);
};

export const excluirTipoConsulta = async (id) => {
  return await api.delete(`${apiUrl}/tipoConsulta/${id}`);
};

export const getTipoConsulta = async () => {
  return await api.get(`${apiUrl}/tipoConsulta`);
};

export const getTipoConsultaId = async (id) => {
  return await api.get(`${apiUrl}/tipoConsulta/${id}`);
};

export const criarMedicamentos = async (dadosMedicamentos) => {
  return await api.post(`${apiUrl}/medicamentos`, dadosMedicamentos);
};

export const updateMedicamentos = async (id, dadosMedicamentos) => {
  return await api.put(`${apiUrl}/medicamentos/${id}`, dadosMedicamentos);
};

export const excluirMedicamentos = async (id) => {
  return await api.delete(`${apiUrl}/medicamentos/${id}`);
};

export const getMedicamentos = async () => {
  return await api.get(`${apiUrl}/medicamentos`);
};

export const getMedicamentosId = async (id) => {
  return await api.get(`${apiUrl}/medicamentos/${id}`);
};

export const generateMedicamentosReport = async (params = {}) => {
  try {
    const response = await api.get(`${apiUrl}/medicamentos/report/excel`, {
      params,
      responseType: "blob", // Important for handling binary data (Excel file)
    });
    return response;
  } catch (error) {
    console.error(
      "Erro ao gerar relatório de medicamentos:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao gerar relatório de medicamentos." };
  }
};
export const criarSolicitacaoExames = async (dadosSolicitacaoExames) => {
  try {
    console.log("Criando solicitação com dados:", dadosSolicitacaoExames);
    const response = await api.post(
      `${apiUrl}/solicitacaoExames`,
      dadosSolicitacaoExames
    );
    console.log("Resposta de criação:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Erro ao criar solicitação:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao criar solicitação." };
  }
};

export const updateSolicitacaoExames = async (id, dadosSolicitacaoExames) => {
  try {
    console.log(
      `Atualizando solicitação ID ${id} com dados:`,
      dadosSolicitacaoExames
    );
    const response = await api.put(
      `${apiUrl}/solicitacaoExames/${id}`,
      dadosSolicitacaoExames
    );
    console.log("Resposta de atualização:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Erro ao atualizar solicitação:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao atualizar solicitação." };
  }
};

export const excluirSolicitacaoExames = async (id) => {
  try {
    console.log(`Enviando DELETE para solicitação ID: ${id}`);
    const response = await api.delete(`${apiUrl}/solicitacaoExames/${id}`);
    console.log("Resposta de exclusão:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Erro ao excluir solicitação ID:",
      id,
      error.response?.data || error.message
    );
    const errorMessage =
      error.response?.status === 404
        ? { error: "Solicitação não encontrada." }
        : error.response?.data || { error: "Erro ao excluir solicitação." };
    throw errorMessage;
  }
};

export const getSolicitacaoExames = async () => {
  try {
    console.log("Buscando todas as solicitações");
    const response = await api.get(`${apiUrl}/solicitacaoExames`);
    console.log("Resposta de busca:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Erro ao buscar solicitações:",
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao buscar solicitações." };
  }
};

export const getSolicitacaoExamesId = async (id) => {
  try {
    console.log(`Buscando solicitação ID: ${id}`);
    const response = await api.get(`${apiUrl}/solicitacaoExames/${id}`);
    console.log("Resposta de busca por ID:", response.data);
    return response;
  } catch (error) {
    console.error(
      "Erro ao buscar solicitação ID:",
      id,
      error.response?.data || error.message
    );
    throw error.response?.data || { error: "Erro ao buscar solicitação." };
  }
};

export const criarReceita = async (dadosReceita) => {
  return await api.post(`/receitas`, dadosReceita);
};

export const criarAtestado = async (dadosAtestado) => {
  return await api.post(`${apiUrl}/atestados`, dadosAtestado, {
    responseType: "blob",
  });
};

export const lerAtestados = async () => {
  return await api.get(`${apiUrl}/atestados`);
};

export const lerAtestadoId = async (id) => {
  return await api.get(`${apiUrl}/atestados/${id}`);
};

export const downloadAtestado = async (id) => {
  return await api.get(`${apiUrl}/atestados/${id}/download`, {
    responseType: "blob",
  });
};

export const criarRegistroResultadoExame = async (dadosRegistro) => {
  return await api.post(`${apiUrl}/registroResultadoExames`, dadosRegistro);
};

export const getRegistrosInativosResultadoExames = async () => {
  return await api.get(`${apiUrl}/registroResultadoExames/inativos`);
};

export const getRegistroResultadoExameId = async (id) => {
  return await api.get(`${apiUrl}/registroResultadoExames/${id}`);
};

export const atualizarRegistroResultadoExame = async (id, dadosRegistro) => {
  return await api.put(
    `${apiUrl}/registroResultadoExames/${id}`,
    dadosRegistro
  );
};

export const deletarRegistroResultadoExame = async (id) => {
  return await api.delete(`${apiUrl}/registroResultadoExames/${id}`);
};

export const realizarCheckIn = async (dadosCheckIn) => {
  return await api.post(`${apiUrl}/checkIn`, dadosCheckIn);
};

export const getCheckIns = async () => {
  return await api.get(`${apiUrl}/getCheckIn`);
};

export const getCheckInPorConsulta = async (id) => {
  return await api.get(`${apiUrl}/checkIn/consulta/${id}`);
};

export const getConsultasPorData = async (data, status, searchTerm = "") => {
  return await api.get(`${apiUrl}/consultas/${data}`, {
    params: { status, searchTerm },
  });
};

export const criarHorario = async (dadosHorario) => {
  return await api.post(`${apiUrl}/horarios-profissionais`, dadosHorario);
};

export const updateHorario = async (id, dadosHorario) => {
  return await api.put(`${apiUrl}/horarios-profissionais/${id}`, dadosHorario);
};

export const excluirHorario = async (id) => {
  return await api.delete(`${apiUrl}/horarios-profissionais/${id}`);
};

export const getHorarios = async () => {
  return await api.get(`${apiUrl}/horarios-profissionais`);
};

export const getHorarioId = async (id) => {
  return await api.get(`${apiUrl}/horarios-profissionais/${id}`);
};

export const agendarConsulta = async (dadosConsulta) => {
  return await api.post(`${apiUrl}/consultas`, dadosConsulta);
};

export const getConsultas = async () => {
  return await api.get(`${apiUrl}/consultas`);
};

export const getConsultasPorDataEMedico = async (data, matricula) => {
  return await api.get(`${apiUrl}/consultas`, {
    params: { dataConsulta: data, medicoId: matricula },
  });
};

export const getHorariosDisponiveis = async (medicoId, dataConsulta) => {
  return await api.get(`${apiUrl}/consultas/${medicoId}/${dataConsulta}`);
};

export const criarRegistroObito = async (dadosObito) => {
  try {
    const response = await api.post(`${apiUrl}/registro-obitos`, dadosObito);
    console.log("Resposta de criarRegistroObito:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro em criarRegistroObito:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateRegistroObito = async (id, dadosObito) => {
  try {
    const response = await api.put(
      `${apiUrl}/registro-obitos/${id}`,
      dadosObito
    );
    console.log("Resposta de updateRegistroObito:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro em updateRegistroObito:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const excluirRegistroObito = async (id) => {
  try {
    const response = await api.delete(`${apiUrl}/registro-obitos/${id}`);
    console.log("Resposta de excluirRegistroObito:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erro em excluirRegistroObito:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRegistroObitos = async () => {
  try {
    const response = await api.get(`${apiUrl}/registro-obitos`);
    console.log("Resposta bruta de getRegistroObitos:", response.data);
    const data = Array.isArray(response.data.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    return { data };
  } catch (error) {
    console.error(
      "Erro em getRegistroObitos:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRegistroObitoId = async (id) => {
  try {
    const response = await api.get(`${apiUrl}/registro-obitos/${id}`);
    console.log("Resposta de getRegistroObitoId:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Registro de óbito não encontrado para ID:", id);
      return null;
    }
    console.error(
      "Erro em getRegistroObitoId:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const registrarAtendimento = async (consultaId, dadosAtendimento) => {
  return await api.post(
    `${apiUrl}/atendimentos/${consultaId}`,
    dadosAtendimento
  );
};

export const getAtendimentoPorId = async (id) => {
  return await api.get(`${apiUrl}/atendimentos/${id}`);
};

export const getAtendimentos = async () => {
  return await api.get(`${apiUrl}/atendimentos`);
};

export const atualizarAtendimento = async (id, dadosAtendimento) => {
  return await api.put(`${apiUrl}/atendimentos/${id}`, dadosAtendimento);
};

export const excluirAtendimento = async (id) => {
  return await api.delete(`${apiUrl}/atendimentos/${id}`);
};

export const alterarConsultaEhAtendimentoCancelado = (idConsulta) =>
  api.put(`/consultas/${idConsulta}`, {
    ehAtendimentoCancelado: 1,
  });
