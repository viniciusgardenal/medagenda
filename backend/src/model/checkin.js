// models/checkin.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class CheckIn extends Model {}

CheckIn.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consultaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "consultas",
        key: "id",
      },
      unique: true,
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
    },
    horaChegada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    pressaoArterial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temperatura: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    altura: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "0: normal, 1: média prioridade, 2: alta prioridade",
    },
  },
  {
    sequelize,
    tableName: "checkins",
    timestamps: true,
  }
);

module.exports = CheckIn;
