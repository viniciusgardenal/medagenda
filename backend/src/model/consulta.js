const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Consulta extends Model {}

Consulta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      comment: "Identificador único da consulta",
    },
    cpfPaciente: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "paciente",
        key: "cpf",
      },
      comment: "CPF do paciente (chave estrangeira para Paciente)",
    },
    medicoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
      comment:
        "Matrícula do profissional (chave estrangeira para Profissional)",
    },
    idTipoConsulta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tipoconsulta",
        key: "idTipoConsulta",
      },
      comment: "ID do tipo de consulta (chave estrangeira para TipoConsulta)",
    },
    dataConsulta: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isFutureOrToday(value) {
          const today = new Date().toISOString().split("T")[0];
          if (value < today) {
            throw new Error("A data da consulta deve ser hoje ou no futuro.");
          }
        },
      },
      comment: "Data da consulta (formato YYYY-MM-DD)",
    },
    horaConsulta: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/i,
      },
      comment: "Hora da consulta (formato HH:mm ou HH:mm:ss)",
    },
    prioridade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
      comment: "Prioridade da consulta (0 a 5, onde 5 é mais urgente)",
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Motivo ou descrição da consulta",
    },
    responsavelAgendamento: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      comment: "Nome do responsável pelo agendamento",
    },
    status: {
      type: DataTypes.ENUM(
        "agendada", // Consulta criada, aguardando chegada do paciente
        "checkin_realizado", // Paciente fez check-in na secretaria
        "em_atendimento", // Médico iniciou o atendimento
        "realizada", // Atendimento concluído
        "cancelada", // Consulta cancelada
        "adiada" // Consulta remarcada para outra data
      ),
      defaultValue: "agendada",
      allowNull: false,
      comment: "Status do ciclo de vida da consulta",
    },
  },
  {
    sequelize,
    modelName: "Consulta",
    tableName: "consultas",
    timestamps: true,
    indexes: [
      {
        fields: ["cpfPaciente"],
        comment: "Índice para consultas por paciente",
      },
      { fields: ["medicoId"], comment: "Índice para consultas por médico" },
      { fields: ["dataConsulta"], comment: "Índice para consultas por data" },
      { fields: ["horaConsulta"], comment: "Índice para consultas por hora" },
      { fields: ["idTipoConsulta"], comment: "Índice para consultas por tipo" },
    ],
  }
);

module.exports = Consulta;
