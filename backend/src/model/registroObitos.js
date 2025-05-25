const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Pega a instância do sequelize

class RegistroObitos extends Model {}

RegistroObitos.init(
  {
    // Seus campos (idRegistroObito, cpfPaciente, etc.) continuam aqui, sem alterações.
    idRegistroObito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "Chave primária auto-incrementada",
    },
    cpfPaciente: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "CPF do paciente, chave estrangeira para Paciente.cpf",
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment:
        "Matrícula do profissional, chave estrangeira para Profissional.matricula",
    },
    dataObito: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Data e hora do óbito",
    },
    causaObito: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Causa do óbito",
    },
    localObito: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Local onde ocorreu o óbito",
    },
    numeroAtestadoObito: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Número do atestado de óbito",
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observações adicionais",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Ativo",
      comment: "Status do registro (Ativo/Inativo)",
    },
  },
  {
    // CORREÇÃO 1: A instância 'sequelize' deve ser passada aqui
    sequelize,
    tableName: "RegistroObitos",
    timestamps: false,
    comment: "Tabela para armazenar registros de óbitos",
  }
);

// CORREÇÃO 2: Exporte a classe do modelo no final
module.exports = RegistroObitos;
