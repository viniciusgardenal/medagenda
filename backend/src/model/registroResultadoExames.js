// models/registroResultadoExames.js (com chaves estrangeiras)
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class RegistroResultadoExames extends Model {}

RegistroResultadoExames.init(
  {
    idRegistro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idSolicitacaoExame: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "solicitacaoExames",
        key: "idSolicitacaoExame",
      },
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
    },
    cpfPaciente: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "paciente",
        key: "cpf",
      },
    },
    observacoes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "inativo",
    },
  },
  {
    sequelize,
    tableName: "registroresultadoexames",
    timestamps: true,
  }
);

module.exports = RegistroResultadoExames;
