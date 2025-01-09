const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Certifique-se de que o sequelize foi configurado corretamente

class Medicamento extends Model {}

Medicamento.init(
  {
    idMedicamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomeMedicamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    controlado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeFabricante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrucaoUso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interacao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "medicamentos", // Nome da tabela no banco de dados
    timestamps: true, // Desabilita timestamps automáticos (createdAt, updatedAt)
  }
);

module.exports = Medicamento;
