// models/Consulta.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissional = require("./profissionais");
const Paciente = require("./paciente");

class Consulta extends Model {}

Consulta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    pacienteId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Paciente,
        key: "cpf",
      },
    },
    medicoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profissional,
        key: "matricula", // Usando "matricula" como chave primária de Profissional
      },
    },
    dataConsulta: {
      type: DataTypes.DATEONLY, // Apenas a data (ex.: "2025-04-08")
      allowNull: false,
    },
    horaConsulta: {
      type: DataTypes.TIME, // Apenas a hora (ex.: "10:00:00")
      allowNull: false,
    },
    prioridade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("agendada", "realizada", "cancelada", "adiada"),
      defaultValue: "agendada",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Consulta",
    tableName: "consultas",
    timestamps: true,
  }
);

// Relacionamentos
Consulta.belongsTo(Paciente, { foreignKey: "pacienteId", as: "paciente" });
Consulta.belongsTo(Profissional, { foreignKey: "medicoId", as: "profissionais" });
Paciente.hasMany(Consulta, { foreignKey: "pacienteId", as: "consultas" });
Profissional.hasMany(Consulta, { foreignKey: "medicoId", as: "consultas" });

module.exports = Consulta;
