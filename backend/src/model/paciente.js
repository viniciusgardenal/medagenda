const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // ajuste o caminho para a configuração do banco de dados
class Paciente extends Model {}
Paciente.init(
  {
    cpf: {
      type: DataTypes.STRING, // Alterado para STRING
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
    tableName: "paciente", // nome da tabela no banco de dados
    timestamps: true, // se você não quiser que Sequelize adicione `createdAt` e `updatedAt`
  }
);

module.exports = Paciente;
