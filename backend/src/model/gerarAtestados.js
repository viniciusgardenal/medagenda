const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Paciente = require("./paciente");
const Profissional = require("./profissionais");

class Atestado extends Model {}

Atestado.init(
  {
    idAtestado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoAtestado: {
      type: DataTypes.ENUM("Médico", "Odontológico", "Psicológico", "Outros"),
      allowNull: false,
    },
    dataEmissao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo",
    },
    cpfPaciente: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Paciente,
        key: "cpf",
      },
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profissional,
        key: "matricula",
      },
    },
  },
  {
    sequelize,
    tableName: "atestados",
    timestamps: true,
  }
);

// Definir associações
Atestado.belongsTo(Paciente, { foreignKey: "cpfPaciente", as: "Paciente" });
Atestado.belongsTo(Profissional, { foreignKey: "matriculaProfissional", as: "Profissional" });

module.exports = Atestado;