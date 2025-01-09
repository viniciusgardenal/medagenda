const Roles = require("../model/roles");
const Permissao = require("../model/permissao");

const inicializarDados = async () => {
  try {
    // Verificar se os papéis já existem
    const [diretor] = await Roles.findOrCreate({ where: { nome: "Diretor" } });
    const [atendente] = await Roles.findOrCreate({
      where: { nome: "Atendente" },
    });
    const [medico] = await Roles.findOrCreate({ where: { nome: "Médico" } });

    // Verificar se as permissões já existem
    const [consultar] = await Permissao.findOrCreate({
      where: { nome: "consultar" },
    });
    const [criar] = await Permissao.findOrCreate({ where: { nome: "criar" } });
    const [alterar] = await Permissao.findOrCreate({
      where: { nome: "alterar" },
    });

    // Associar permissões aos papéis, verificando se a associação já existe
    // Para evitar duplicação, podemos verificar se já existe a permissão associada
    const diretorPermissoes = await diretor.getPermissoes();
    if (
      !diretorPermissoes.some((permissao) => permissao.nome === "consultar")
    ) {
      await diretor.addPermissoes([consultar, criar, alterar]);
    }

    const atendentePermissoes = await atendente.getPermissoes();
    if (
      !atendentePermissoes.some((permissao) => permissao.nome === "consultar")
    ) {
      await atendente.addPermissoes([consultar]);
    }

    const medicoPermissoes = await medico.getPermissoes();
    if (!medicoPermissoes.some((permissao) => permissao.nome === "consultar")) {
      await medico.addPermissoes([consultar, alterar]);
    }

    // //console.log("Dados iniciais inseridos (se necessário) com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados iniciais:", error);
  }
};

module.exports = inicializarDados;
