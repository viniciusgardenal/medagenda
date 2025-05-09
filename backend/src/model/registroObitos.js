module.exports = (sequelize, DataTypes) => {
  const RegistroObitos = sequelize.define(
    "RegistroObitos",
    {
      idRegistroObito: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Chave primária auto-incrementada",
      },
      cpfPaciente: {
        type: DataTypes.STRING(255), // Compatível com Paciente.cpf
        allowNull: false,
        comment: "CPF do paciente, chave estrangeira para Pac STANDALONEiente.cpf",
      },
      matriculaProfissional: {
        type: DataTypes.INTEGER, // Compatível com Profissional.matricula
        allowNull: false,
        comment: "Matrícula do profissional, chave estrangeira para Profissional.matricula",
      },
      dataObito: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "Data e hora do óbito",
      },
      causaObito: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Causa do óbito",
      },
      localObito: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Local onde ocorreu o óbito",
      },
      numeroAtestadoObito: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Número do atestado de óbito",
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Observações adicionais",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Ativo",
        comment: "Status do registro (Ativo/Inativo)",
      },
    },
    {
      tableName: "RegistroObitos",
      timestamps: false,
      comment: "Tabela para armazenar registros de óbitos",
    }
  );

  RegistroObitos.associate = (models) => {
    RegistroObitos.belongsTo(models.Paciente, {
      foreignKey: "cpfPaciente",
      targetKey: "cpf",
      as: "paciente",
      required: false, // Permite que a query não falhe se o paciente não existir
    });
    RegistroObitos.belongsTo(models.Profissional, {
      foreignKey: "matriculaProfissional",
      targetKey: "matricula",
      as: "profissional",
      required: false, // Permite que a query não falhe se o profissional não existir
    });
  };

  return RegistroObitos;
};