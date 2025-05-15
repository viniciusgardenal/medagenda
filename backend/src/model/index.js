// models/index.js
const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// Importação dos modelos
const CheckIn = require("./checkin");
const Consulta = require("./consulta");
const Profissional = require("./profissionais");
const Paciente = require("./paciente");
const TipoConsulta = require("./tipoConsulta");
const Atestado = require("./gerarAtestados");
const HorarioProfissional = require("./horariosProfissionais");
const Medicamento = require("./medicamentos");
const TiposExames = require("./tiposExames");
const Receita = require("./receitas");
const PlanoDeSaude = require("./planoDeSaude");
const Roles = require("./roles");
const Permissao = require("./permissao");
const SolicitacaoExames = require("./solicitacaoExames");
const RegistroResultadoExames = require("./registroResultadoExames");
const RegistroObitos = require("./registroObitos")(
  sequelize,
  Sequelize.DataTypes
);
const Atendimento = require("./atendimentos");

// Objeto contendo todos os modelos
const models = {
  CheckIn,
  Consulta,
  Profissional,
  Paciente,
  TipoConsulta,
  Atestado,
  HorarioProfissional,
  Medicamento,
  TiposExames,
  Receita,
  PlanoDeSaude,
  Roles,
  Permissao,
  SolicitacaoExames,
  RegistroResultadoExames,
  RegistroObitos,
  Atendimento,
};

// Definição das associações

// Profissional
models.Profissional.belongsTo(models.Roles, {
  foreignKey: "roleId",
  as: "role", // Corrigido de "roles" para "role"
});
models.Roles.hasMany(models.Profissional, {
  foreignKey: "roleId",
  as: "profissionais",
});

// CheckIn
models.CheckIn.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.CheckIn, {
  foreignKey: "matriculaProfissional",
  as: "checkins",
});
models.CheckIn.belongsTo(models.Consulta, {
  foreignKey: "consultaId",
  as: "consulta",
});
models.Consulta.hasOne(models.CheckIn, {
  foreignKey: "consultaId",
  as: "checkin",
});

// Consulta
models.Consulta.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.Consulta, {
  foreignKey: "cpfPaciente",
  as: "consultas",
});
models.Consulta.belongsTo(models.Profissional, {
  foreignKey: "medicoId",
  as: "medico",
});
models.Profissional.hasMany(models.Consulta, {
  foreignKey: "medicoId",
  as: "consultas",
});
models.Consulta.belongsTo(models.TipoConsulta, {
  foreignKey: "idTipoConsulta",
  as: "tipoConsulta",
});
models.TipoConsulta.hasMany(models.Consulta, {
  foreignKey: "idTipoConsulta",
  as: "consultas",
});

// Atestado
models.Atestado.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.Atestado, {
  foreignKey: "matriculaProfissional",
  as: "atestados",
});
models.Atestado.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.Atestado, {
  foreignKey: "cpfPaciente",
  as: "atestados",
});

// HorarioProfissional
models.HorarioProfissional.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.HorarioProfissional, {
  foreignKey: "matriculaProfissional",
  as: "horarios",
});

// Receita
models.Receita.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.Receita, {
  foreignKey: "matriculaProfissional",
  as: "receitas",
});
models.Receita.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.Receita, {
  foreignKey: "cpfPaciente",
  as: "receitas",
});
models.Receita.belongsTo(models.Medicamento, {
  foreignKey: "idMedicamento",
  as: "medicamento",
});
models.Medicamento.hasMany(models.Receita, {
  foreignKey: "idMedicamento",
  as: "receitas",
});

// PlanoDeSaude
models.PlanoDeSaude.hasMany(models.Paciente, {
  foreignKey: "planoSaudeId",
  as: "pacientes",
});
models.Paciente.belongsTo(models.PlanoDeSaude, {
  foreignKey: "planoSaudeId",
  as: "planoSaude",
});

// SolicitacaoExames
models.SolicitacaoExames.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.SolicitacaoExames, {
  foreignKey: "matriculaProfissional",
  as: "solicitacoesExames",
});
models.SolicitacaoExames.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.SolicitacaoExames, {
  foreignKey: "cpfPaciente",
  as: "solicitacoesExames",
});
models.SolicitacaoExames.belongsTo(models.TiposExames, {
  foreignKey: "idTipoExame",
  as: "tipoExame",
});
models.TiposExames.hasMany(models.SolicitacaoExames, {
  foreignKey: "idTipoExame",
  as: "solicitacoesExames",
});

// RegistroResultadoExames
models.RegistroResultadoExames.belongsTo(models.SolicitacaoExames, {
  foreignKey: "idSolicitacaoExame",
  as: "solicitacaoExame",
});
models.SolicitacaoExames.hasOne(models.RegistroResultadoExames, {
  foreignKey: "idSolicitacaoExame",
  as: "resultadoExame",
});
models.RegistroResultadoExames.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.RegistroResultadoExames, {
  foreignKey: "matriculaProfissional",
  as: "resultadosExames",
});
models.RegistroResultadoExames.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.RegistroResultadoExames, {
  foreignKey: "cpfPaciente",
  as: "resultadosExames",
});

// RegistroObitos
models.RegistroObitos.belongsTo(models.Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});
models.Paciente.hasMany(models.RegistroObitos, {
  foreignKey: "cpfPaciente",
  as: "registrosObitos",
});
models.RegistroObitos.belongsTo(models.Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});
models.Profissional.hasMany(models.RegistroObitos, {
  foreignKey: "matriculaProfissional",
  as: "registrosObitos",
});

// Atendimento
models.Atendimento.belongsTo(models.Consulta, {
  foreignKey: "consultaId",
  as: "consulta",
});
models.Consulta.hasOne(models.Atendimento, {
  foreignKey: "consultaId",
  as: "atendimento",
});
// Exportação dos modelos e sequelize
module.exports = { sequelize, models };
