// models/solicitacaoExames.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class SolicitacaoExames extends Model {}

SolicitacaoExames.init(
  {
    idSolicitacaoExame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeTipoExame: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataSolicitacao: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dataRetorno: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    justificativa: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "solicitacaoExames",
    timestamps: true,
  }
);

module.exports = SolicitacaoExames;
