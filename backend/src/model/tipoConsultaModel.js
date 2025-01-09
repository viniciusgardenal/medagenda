const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const tipoConsulta = sequelize.define(
  "tipoConsulta",
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
      type: DataTypes.STRING, // Pode ser alterado para ENUM se houver valores específicos como "Alta", "Média", "Baixa"
      allowNull: true,
    },
    dataCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, // Pode ser alterado para ENUM se os valores forem "ativo", "inativo"
      allowNull: false,
      defaultValue: "ativo",
    },
  },
  {
    sequelize,
    tableName: "tipoconsulta", // Nome da tabela no banco de dados
    timestamps: true,
  }
);

module.exports = tipoConsulta;
