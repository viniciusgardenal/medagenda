const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissional = require("../model/profissionais");
const Paciente = require("../model/paciente");
const SolicitacaoExames = require("../model/solicitacaoExames");

class RegistroResultadoExames extends Model {}

RegistroResultadoExames.init(
  {
    idRegistro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    observacoes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "inativo",  // Define o valor padrão como "inativo"
    },
  },
  {
    sequelize,
    tableName: "registroresultadoexames", // Nome da tabela no banco de dados
    timestamps: true, // Cria as colunas createdAt e updatedAt
  }
);

// Relacionamento com a tabela solicitacaoExames
RegistroResultadoExames.belongsTo(SolicitacaoExames, {
  foreignKey: "idSolicitacaoExame",
  as: "solicitacaoExame",  // Alias definido no relacionamento
});

// Relacionamento com o modelo Profissional
RegistroResultadoExames.belongsTo(Profissional, {
  foreignKey: "matriculaProfissional",
  as: "profissional",
});

// Relacionamento com o modelo Paciente
RegistroResultadoExames.belongsTo(Paciente, {
  foreignKey: "cpfPaciente",
  as: "paciente",
});

// Método para buscar registros com status inativo da tabela solicitacaoExames
RegistroResultadoExames.findInativos = async () => {
  return await RegistroResultadoExames.findAll({
    where: {
      status: "Inativo",  // Busca apenas os registros com status inativo
    },
    include: [
      {
        model: SolicitacaoExames,  // Use o nome correto do modelo
        as: "solicitacaoExame",  // Use o alias correto aqui
        where: { status: "Inativo" },  // Garante que estamos pegando apenas as solicitações inativas
        required: true,  // Faz uma junção interna (inner join)
      },
      {
        model: Profissional,
        as: "profissional",  // Use o alias correto aqui
      },
      {
        model: Paciente,
        as: "paciente",  // Use o alias correto aqui
      },
    ],
  });
};

module.exports = RegistroResultadoExames;
