// models/planoDeSaude.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class PlanoDeSaude extends Model {}

PlanoDeSaude.init(
  {
    idPlanoSaude: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeOperadora: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    codigoPlano: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    tipoPlano: {
      type: DataTypes.ENUM("Individual", "Familiar", "Empresarial"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo",
    },
  },
  {
    sequelize,
    tableName: "planodesaude",
    timestamps: true,
  }
);

module.exports = PlanoDeSaude;
