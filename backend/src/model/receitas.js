// models/receitas.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Receita extends Model {}

Receita.init(
  {
    idReceita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dosagem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instrucaoUso: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "receitas",
    timestamps: true,
  }
);

module.exports = Receita;
