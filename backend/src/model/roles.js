const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // importe sua configuração de conexão aqui

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
    tableName: "roles", // nome da tabela no banco de dados
    timestamps: true, // se você não quiser que Sequelize adicione `createdAt` e `updatedAt`
  }
);

module.exports = Roles;
