// models/permissao.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Permissao extends Model {}

Permissao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "permissao",
    timestamps: true, // Habilita timestamps automáticos (createdAt, updatedAt)
  }
);

module.exports = Permissao;
