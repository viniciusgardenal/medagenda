// models/tiposExames.js
const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

class TiposExames extends Model {}

TiposExames.init(
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
    tableName: "tiposexames",
    timestamps: true,
  }
);

module.exports = TiposExames;
