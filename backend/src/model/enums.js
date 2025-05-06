// Mapeamento para status de Consulta
const STATUS_CONSULTA = {
  0: 'Agendada',
  1: 'Realizada',
  2: 'Cancelada',
  3: 'Adiada',
};

// Mapeamento para tipoProfissional
const TIPO_PROFISSIONAL = {
  0: 'Medico',
  1: 'Atendente',
  2: 'Diretor',
};

// Mapeamento para status de CheckIn
const STATUS_CHECKIN = {
  0: 'Registrado',
  1: 'Finalizado',
};

// Mapeamento para tipoAtestado
const TIPO_ATESTADO = {
  0: 'Médico',
  1: 'Odontológico',
  2: 'Psicológico',
  3: 'Outros',
};

// Mapeamento para status de Atestado
const STATUS_ATESTADO = {
  0: 'Ativo',
  1: 'Inativo',
};

// Mapeamento para tipoPlano
const TIPO_PLANO = {
  0: 'Individual',
  1: 'Familiar',
  2: 'Empresarial',
};

// Mapeamento para status de PlanoDeSaude
const STATUS_PLANO = {
  0: 'Ativo',
  1: 'Inativo',
};

// Mapeamento para status de HorarioProfissional
const STATUS_HORARIO = {
  0: 'Ativo',
  1: 'Inativo',
};

// Funções utilitárias para converter números em strings
const getStatusConsulta = (value) => STATUS_CONSULTA[value] || 'Desconhecido';
const getTipoProfissional = (value) => TIPO_PROFISSIONAL[value] || 'Desconhecido';
const getStatusCheckIn = (value) => STATUS_CHECKIN[value] || 'Desconhecido';
const getTipoAtestado = (value) => TIPO_ATESTADO[value] || 'Desconhecido';
const getStatusAtestado = (value) => STATUS_ATESTADO[value] || 'Desconhecido';
const getTipoPlano = (value) => TIPO_PLANO[value] || 'Desconhecido';
const getStatusPlano = (value) => STATUS_PLANO[value] || 'Desconhecido';
const getStatusHorario = (value) => STATUS_HORARIO[value] || 'Desconhecido';

module.exports = {
  STATUS_CONSULTA,
  TIPO_PROFISSIONAL,
  STATUS_CHECKIN,
  TIPO_ATESTADO,
  STATUS_ATESTADO,
  TIPO_PLANO,
  STATUS_PLANO,
  STATUS_HORARIO,
  getStatusConsulta,
  getTipoProfissional,
  getStatusCheckIn,
  getTipoAtestado,
  getStatusAtestado,
  getTipoPlano,
  getStatusPlano,
  getStatusHorario,
};
