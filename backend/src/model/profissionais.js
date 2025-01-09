// models/Profissional.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Configuração do banco de dados
const Roles = require("./roles");

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
      allowNull: true, // Campo específico para Médicos
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true, // Campo opcional para Diretores
    },
    setor: {
      type: DataTypes.STRING,
      allowNull: true, // Campo opcional para Atendentes
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
      defaultValue: 0, // Definindo padrão para evitar valores nulos
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Torna obrigatório associar a um papel
      references: {
        model: Roles, // Nome do modelo associado
        key: "id", // Chave primária da tabela roles
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

// Relacionamentos
Roles.hasMany(Profissional, { foreignKey: "roleId", as: "profissionais" });
Profissional.belongsTo(Roles, { foreignKey: "roleId", as: "roles" }); // Ajuste no alias

module.exports = Profissional;
