const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissional = require("../model/profissionais");
const tiposExames = require("./tiposExames");
const Paciente = require("../model/paciente");

class solicitacaoExames extends Model {}

solicitacaoExames.init(
  {
    idSolicitacaoExame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataRetorno: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "solicitacaoExames", // Nome da tabela no banco de dados
    timestamps: true,
  }
);

solicitacaoExames.belongsTo(Profissional, {
  foreignKey: "matriculaProfissional",
});
solicitacaoExames.belongsTo(Paciente, { foreignKey: "cpfPaciente" });
solicitacaoExames.belongsTo(tiposExames, { foreignKey: "idTipoExame" });

module.exports = solicitacaoExames;
