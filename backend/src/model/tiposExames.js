const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const tiposExames = sequelize.define(
  "tiposExames",
  {
    idTipoExame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nomeTipoExame: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialColetado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tempoJejum: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
    sequelize,
    tableName: "tiposexames", // Nome da tabela no banco de dados
    timestamps: true,
  }
);

module.exports = tiposExames;
