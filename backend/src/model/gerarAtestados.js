const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissional = require("./profissionais");
const Paciente = require("./paciente");

class Atestado extends Model {}

Atestado.init(
  {
    idAtestado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipoAtestado: {
      type: DataTypes.ENUM(
        "Médico",
        "Odontológico",
        "Psicológico",
        "Outros"
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "atestados",
    timestamps: true, // Inclui `createdAt` e `updatedAt` automaticamente
  }
);

// Relacionamentos
Atestado.belongsTo(Profissional, { foreignKey: "matriculaProfissional" });
Atestado.belongsTo(Paciente, { foreignKey: "cpfPaciente" });

module.exports = Atestado;
