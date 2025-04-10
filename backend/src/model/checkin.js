const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Profissionais = require("./profissionais"); // Ajuste o caminho
const Consulta = require("./consulta"); // Adicione o modelo Consulta

class CheckIn extends Model {}

CheckIn.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consultaId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Obrigatório, pois cada check-in deve estar ligado a uma consulta
      references: {
        model: "consultas", // Nome da tabela
        key: "id",
      },
      unique: true, // Garante relação 1:1
    },
    profissionalId: {
      // Substitui "matriculaProfissional" para consistência
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
    },
    horaChegada: {
      type: DataTypes.DATE, // Ajustado para incluir data e hora
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usa timestamp atual
    },
    pressaoArterial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temperatura: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    altura: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("registrado", "finalizado"), // Mantive "finalizado" como "concluido"
      defaultValue: "registrado",
      allowNull: false,
    },
    prioridade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "0: normal, 1: média prioridade, 2: alta prioridade",
    },
  },
  {
    sequelize,
    tableName: "checkins", // Ajustei o nome da tabela para plural, padrão comum
    timestamps: true,
  }
);

// Relacionamentos
CheckIn.belongsTo(Consulta, { foreignKey: "consultaId", as: "consulta" });
Consulta.hasOne(CheckIn, { foreignKey: "consultaId", as: "checkin" });

CheckIn.belongsTo(Profissionais, {
  foreignKey: "profissionalId",
  as: "profissionais",
});
Profissionais.hasMany(CheckIn, {
  foreignKey: "profissionalId",
  as: "checkins",
});

module.exports = CheckIn;
