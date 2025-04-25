// models/paciente.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Paciente extends Model {}

Paciente.init(
  {
    cpf: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "paciente",
    timestamps: true, // Habilita timestamps automáticos (createdAt, updatedAt)
  }
);

module.exports = Paciente;
