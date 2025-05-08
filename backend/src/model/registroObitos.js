module.exports = (sequelize, DataTypes) => {
    const RegistroObitos = sequelize.define(
      "RegistroObitos",
      {
        idRegistroObito: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        cpfPaciente: {
          type: DataTypes.STRING(255), // Compatível com Paciente.cpf
          allowNull: false,
        },
        matriculaProfissional: {
          type: DataTypes.INTEGER, // Alterado para INTEGER, compatível com Profissional.matricula
          allowNull: false,
        },
        dataObito: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        causaObito: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        localObito: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        numeroAtestadoObito: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        observacoes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "Ativo",
        },
      },
      {
        tableName: "RegistroObitos",
        timestamps: false,
      }
    );
  
    RegistroObitos.associate = (models) => {
      RegistroObitos.belongsTo(models.Paciente, {
        foreignKey: "cpfPaciente",
        targetKey: "cpf",
        as: "paciente",
      });
      RegistroObitos.belongsTo(models.Profissional, {
        foreignKey: "matriculaProfissional",
        targetKey: "matricula",
        as: "profissional",
      });
    };
  
    return RegistroObitos;
  };