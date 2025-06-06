// /model/gerarAtestados.js (ou Atestado.js)

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// Não é necessário importar Paciente e Profissional aqui se as chaves estrangeiras forem strings

class Atestado extends Model {
  static associate(models) {
    // Definir associações aqui se estiver usando um arquivo central de associações
    this.belongsTo(models.Paciente, { foreignKey: "cpfPaciente", as: "paciente" });
    this.belongsTo(models.Profissional, { foreignKey: "matriculaProfissional", as: "profissional" });
  }
}

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
        model: 'paciente', // Nome da tabela
        key: 'cpf',
      },
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'profissionais', // Nome da tabela
        key: 'matricula',
      },
    },
  },
  {
    sequelize,
    tableName: "atestados",
    timestamps: true,
  }
);

module.exports = Atestado;