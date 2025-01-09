
// Importa os modelos
const Profissionais = require("../model/profissionais");
const Exames = require("../model/solicitacaoExames");

// Configura a associação do médico
Exames.belongsTo(Profissionais, {
  foreignKey: "Medico_matricula", // Campo em Exames que referencia Profissionais
  as: "medico",                  // Alias para identificar o médico
});

// Configura a associação do paciente
Exames.belongsTo(Profissionais, {
  foreignKey: "Paciente_cpf",    // Campo em Exames que referencia Profissionais
  as: "paciente",                // Alias para identificar o paciente
});

module.exports = { Profissionais, Exames };
