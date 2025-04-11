// models/HorarioProfissional.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Configuração do banco de dados
const Profissional = require("./profissionais");

class HorarioProfissional extends Model {}

HorarioProfissional.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    profissionalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profissional, // Nome do modelo associado
        key: "matricula",   // Chave primária da tabela profissionais
      },
    },
    diaSemana: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    inicio: {
      type: DataTypes.STRING, // Armazenado como string no formato "HH:mm"
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:mm (00:00 a 23:59)
      },
    },
    fim: {
      type: DataTypes.STRING, // Armazenado como string no formato "HH:mm"
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // Valida formato HH:mm (00:00 a 23:59)
      },
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo", // Status padrão
    },
  },
  {
    sequelize,
    modelName: "HorarioProfissional",
    tableName: "horarios_profissionais",
    timestamps: true, // Inclui createdAt e updatedAt
  }
);

// Relacionamentos
Profissional.hasMany(HorarioProfissional, { foreignKey: "profissionalId", as: "horarios" });
HorarioProfissional.belongsTo(Profissional, { foreignKey: "profissionalId", as: "profissional" });

module.exports = HorarioProfissional;