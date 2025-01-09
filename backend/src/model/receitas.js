const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissional = require("./profissionais");
const Paciente = require("./paciente");
const Medicamento = require("./medicamentos");

class Receita extends Model {}

Receita.init(
  {
    idReceita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dosagem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instrucaoUso: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "receitas",
    timestamps: true,
  }
);

// Relacionamentos
Receita.belongsTo(Profissional, { foreignKey: "matriculaProfissional" });
Receita.belongsTo(Paciente, { foreignKey: "cpfPaciente" });
Receita.belongsTo(Medicamento, { foreignKey: "idMedicamento" });

module.exports = Receita;
