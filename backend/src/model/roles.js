// models/roles.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Roles extends Model {}

Roles.init(
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
    tableName: "roles",
    timestamps: true, // Habilita timestamps automáticos (createdAt, updatedAt)
  }
);

module.exports = Roles;
