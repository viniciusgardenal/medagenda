const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Atendimento extends Model {}

Atendimento.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      comment: "Identificador único do atendimento",
    },
    consultaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "consultas",
        key: "id",
      },
      comment: "ID da consulta relacionada",
    },
    diagnostico: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Diagnóstico registrado pelo médico",
    },
    prescricao: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Prescrição médica (medicamentos, tratamentos)",
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observações gerais do atendimento",
    },
    dataAtendimento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "Data e hora do atendimento",
    },
  },
  {
    sequelize,
    modelName: "Atendimento",
    tableName: "atendimentos",
    timestamps: true,
  }
);

module.exports = Atendimento;