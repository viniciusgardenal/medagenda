const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class HorarioProfissional extends Model {}

HorarioProfissional.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    matriculaProfissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "profissionais",
        key: "matricula",
      },
    },
    diaSemana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inicio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    fim: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    intervaloInicio: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: "intervaloInicio deve estar no formato HH:mm",
        },
        isValidInterval(value) {
          if (value && this.inicio && this.fim) {
            const inicio = new Date(`1970-01-01T${this.inicio}:00`);
            const fim = new Date(`1970-01-01T${this.fim}:00`);
            const intervalo = new Date(`1970-01-01T${value}:00`);
            if (intervalo <= inicio || intervalo >= fim) {
              throw new Error(
                "intervaloInicio deve estar entre inicio e fim"
              );
            }
          }
        },
      },
    },
    intervaloFim: {
      type: DataTypes.STRING,
      allowNull: true, // Opcional
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: "intervaloFim deve estar no formato HH:mm",
        },
        isValidInterval(value) {
          if (value && this.inicio && this.fim && this.intervaloInicio) {
            const inicio = new Date(`1970-01-01T${this.inicio}:00`);
            const fim = new Date(`1970-01-01T${this.fim}:00`);
            const intervaloInicio = new Date(
              `1970-01-01T${this.intervaloInicio}:00`
            );
            const intervaloFim = new Date(`1970-01-01T${value}:00`);
            if (
              intervaloFim <= intervaloInicio ||
              intervaloFim > fim ||
              intervaloInicio < inicio
            ) {
              throw new Error(
                "intervaloFim deve ser após intervaloInicio e dentro do período de inicio e fim"
              );
            }
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Inativo"),
      allowNull: false,
      defaultValue: "Ativo",
    },
  },
  {
    sequelize,
    modelName: "HorarioProfissional",
    tableName: "horarios_profissionais",
    timestamps: true,
  }
);

module.exports = HorarioProfissional;