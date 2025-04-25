// models/profissionais.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Profissional extends Model {}

Profissional.init(
  {
    matricula: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
    },
    tipoProfissional: {
      type: DataTypes.ENUM("Medico", "Atendente", "Diretor"),
      allowNull: false,
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    crm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    setor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataAdmissao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sendEmail: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Profissional",
    tableName: "profissionais",
    timestamps: true,
  }
);

module.exports = Profissional;
