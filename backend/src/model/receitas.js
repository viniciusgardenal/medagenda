// models/receitas.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Receita extends Model {}

Receita.init({
  idReceita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Coluna para agrupar medicamentos da mesma receita. ESSENCIAL!
  batchId: {
    type: DataTypes.UUID, // Usamos um tipo UUID para garantir um identificador único
    allowNull: false,
  },
  dosagem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instrucaoUso: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "receitas",
  timestamps: true,
});

module.exports = Receita;