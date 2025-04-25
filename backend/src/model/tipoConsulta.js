// models/tipoConsulta.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class TipoConsulta extends Model {}

TipoConsulta.init(
  {
    idTipoConsulta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeTipoConsulta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    especialidade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duracaoEstimada: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requisitosEspecificos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ativo",
    },
  },
  {
    sequelize,
    tableName: "tipoconsulta",
    timestamps: true,
  }
);

module.exports = TipoConsulta;
