const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class planoDeSaude extends Model {}

planoDeSaude.init(
  {
    idPlanoDeSaude: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomePlanoDeSaude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipoPlanoDeSaude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dataFim: {
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
    tableName: "planodesaude", // Nome da tabela no banco de dados
    timestamps: true,
    validate: {
      datasValidas() {
          if (this.dataInicio > this.dataFim) {
              throw new Error('A data de início deve ser menor ou igual à data de término.');
          }
        }
    }
  }
);

module.exports = planoDeSaude;
