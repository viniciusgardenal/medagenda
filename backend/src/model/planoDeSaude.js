// models/planoDeSaude.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class PlanoDeSaude extends Model {}

PlanoDeSaude.init(
  {
    idPlanoSaude: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeOperadora: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    codigoPlano: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    tipoPlano: {
      type: DataTypes.ENUM("Individual", "Familiar", "Empresarial"),
      allowNull: false,
    },
    // --- CAMPOS ADICIONADOS ---
    descricao: {
      type: DataTypes.TEXT, // Usar TEXT para descrições mais longas
      allowNull: true,      // Permitir que seja nulo se não for obrigatório
    },
    dataInicio: {
      type: DataTypes.DATEONLY, // Armazena apenas a data (YYYY-MM-DD)
      allowNull: true,
    },
    dataFim: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // -------------------------
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo",
    },
  },
  {
    sequelize,
    tableName: "planodesaude",
    timestamps: true,
  }
);

module.exports = PlanoDeSaude;