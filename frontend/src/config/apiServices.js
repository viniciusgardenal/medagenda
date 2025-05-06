import api from "./axiosConfig";
const apiUrl = "http://localhost:5000";

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

//Pacientes
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

    return response.data; // Retorna os dados do paciente
  } catch (error) {
    if (error.response && error.response.status === 404) {
      //console.log("Paciente não encontrado");
      return null; // Retorna null para pacientes inexistentes
    }
    throw error; // Lança erros inesperados
  }
};

//TiposExames
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

//Plano de Saude
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

//Tipo Consulta
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

//medicamentos
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

//Solicitacao Exames
export const criarSolicitacaoExames = async (dadosSolicitacaoExames) => {
  return await api.post(`${apiUrl}/solicitacaoExames`, dadosSolicitacaoExames);
};

export const updateSolicitacaoExames = async (id, dadosSolicitacaoExames) => {
  return await api.put(
    `${apiUrl}/solicitacaoExames/${id}`,
    dadosSolicitacaoExames
  );
};

export const excluirSolicitacaoExames = async (id) => {
  return await api.delete(`${apiUrl}/solicitacaoExames/${id}`);
};

export const getSolicitacaoExames = async () => {
  return await api.get(`${apiUrl}/solicitacaoExames`);
};

export const getSolicitacaoExamesId = async (id) => {
  return await api.get(`${apiUrl}/solicitacaoExames/${id}`);
};

//Receita

export const criarReceita = async (dadosReceita) => {
  return await api.post(`/receitas`, dadosReceita);
};

// Gerar Atestados
export const criarAtestado = async (dadosAtestado) => {
  return await api.post(`${apiUrl}/atestados`, dadosAtestado, {
    responseType: "blob", // Para receber o PDF como blob
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
    responseType: "blob", // Para receber o arquivo de texto como blob
  });
};

// Registro Resultado Exame
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

//check in
export const realizarCheckIn = async (dadosCheckIn) => {
  return await api.post(`${apiUrl}/checkIn`, dadosCheckIn);
};

export const getCheckIns = async () => {
  return await api.get(`${apiUrl}/getCheckIn`);
};

export const getCheckInPorConsulta = async (id) => {
  return await api.get(`${apiUrl}/checkIn/consulta/${id}`);
};

export const getConsultasPorData = async (data) => {
  return await api.get(`${apiUrl}/consultas/${data}`);
};

//Gerenciar Horarios Profissionais
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

//Agendar Consultas

export const agendarConsulta = async (dadosConsulta) => {
  return await api.post(`${apiUrl}/consultas`, dadosConsulta);
};

// Buscar consultas por data e matrícula do médico
export const getConsultasPorDataEMedico = async (data, matricula) => {
  return await api.get(`${apiUrl}/consultas`, {
    params: { dataConsulta: data, medicoId: matricula },
  });
};
