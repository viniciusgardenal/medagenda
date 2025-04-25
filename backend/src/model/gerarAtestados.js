// models/gerarAtestados.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Atestado extends Model {}

Atestado.init(
  {
    idAtestado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoAtestado: {
      type: DataTypes.ENUM("Médico", "Odontológico", "Psicológico", "Outros"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "atestados",
    timestamps: true,
  }
);

module.exports = Atestado;
