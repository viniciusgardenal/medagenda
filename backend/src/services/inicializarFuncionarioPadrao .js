const bcrypt = require("bcryptjs");
const Profissional = require("../model/profissionais"); // Ajuste o caminho conforme necessário
const moment = require("moment");

const inicializarFuncionariosPadrao = async () => {
  try {
    const funcionariosPadrao = [
      {
        nome: "Diretor",
        email: "diretor@medagenda.com",
        tipoProfissional: "Diretor",
        roleId: 1, // Role para Diretor
      },
      {
        nome: "Atendente",
        email: "atendente@medagenda.com",
        tipoProfissional: "Atendente",
        roleId: 2, // Role para Atendente
      },
      {
        nome: "Medico",
        email: "medico@medagenda.com",
        tipoProfissional: "Medico",
        roleId: 3, // Role para Médico
      },
    ];

    const senhaProvisoria = "abc123";
    const hashedPassword = await bcrypt.hash(senhaProvisoria, 10);
    const dataHoje = moment().format("YYYY-MM-DD"); // Formato adequado ao banco de dados

    for (const funcionario of funcionariosPadrao) {
      const funcionarioExistente = await Profissional.findOne({
        where: { email: funcionario.email },
      });

      if (!funcionarioExistente) {
        await Profissional.create({
          nome: funcionario.nome,
          email: funcionario.email,
          tipoProfissional: funcionario.tipoProfissional,
          dataNascimento: dataHoje,
          dataAdmissao: dataHoje,
          roleId: funcionario.roleId,
          password: hashedPassword,
        });

        //console.log(`Funcionário padrão (${funcionario.nome}) criado com sucesso.`);
      } else {
        //console.log(`Funcionário padrão (${funcionario.nome}) já existe.`);
      }
    }
  } catch (error) {
    console.error("Erro ao inicializar funcionários padrão:", error);
  }
};

module.exports = inicializarFuncionariosPadrao;
