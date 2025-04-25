// models/horariosProfissionais.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class HorarioProfissional extends Model {}

HorarioProfissional.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
    },
    diaSemana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inicio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    fim: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo",
    },
  },
  {
    sequelize,
    modelName: "HorarioProfissional",
    tableName: "horarios_profissionais",
    timestamps: true,
  }
);

module.exports = HorarioProfissional;
