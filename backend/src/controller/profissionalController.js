const Profissional = require("../model/profissionais");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { enviarSenhaProvisoria } = require("../services/emailServices");
require("moment/locale/pt-br"); // Para definir o locale em português

const criarProfissional = async (req, res) => {
  try {
    // Função para processar um profissional
    const processarProfissional = async (profissionalData) => {
      const { tipoProfissional, sendEmail = 0 } = profissionalData;

      // Validação do tipo de profissional
      const tiposValidos = ["Medico", "Atendente", "Diretor"];
      if (!tiposValidos.includes(tipoProfissional)) {
        throw new Error(
          "Tipo de profissional inválido. Valores aceitos: Medico, Atendente, Diretor."
        );
      }

      // Define a role automaticamente com base no tipoProfissional
      let role;
      switch (tipoProfissional) {
        case "Diretor":
          role = 1;
          break;
        case "Medico":
          role = 3;
          break;
        case "Atendente":
          role = 2;
          break;
        default:
          role = null;
      }

      // Gera senha provisória e faz hash
      const senhaProvisoria = gerarSenhaProvisoria();
      const hashedPassword = await bcrypt.hash(senhaProvisoria, 10);

      // Retorna os dados do profissional com senha e role
      return {
        ...profissionalData,
        password: hashedPassword,
        roleId: role,
        senhaProvisoria, // Inclui a senha provisória para envio de e-mail
        sendEmail,
      };
    };

    // Verificar se é um array ou objeto
    const profissionaisInput = Array.isArray(req.body) ? req.body : [req.body];

    // Processar cada profissional
    const profissionaisProcessados = await Promise.all(
      profissionaisInput.map(async (profissionalData, index) => {
        if (!profissionalData || typeof profissionalData !== "object") {
          throw new Error(
            `Entrada inválida no índice ${index}. Esperado um objeto de profissional.`
          );
        }
        return await processarProfissional(profissionalData);
      })
    );

    // Cadastrar profissionais
    let profissionaisCadastrados;
    if (Array.isArray(req.body)) {
      // Cadastrar múltiplos profissionais com bulkCreate
      profissionaisCadastrados = await Profissional.bulkCreate(
        profissionaisProcessados.map(
          ({ senhaProvisoria, sendEmail, ...data }) => data
        ), // Remove senhaProvisoria e sendEmail
        {
          validate: true,
          individualHooks: true,
        }
      );
    } else {
      // Cadastrar um único profissional
      const { senhaProvisoria, sendEmail, ...data } =
        profissionaisProcessados[0];
      profissionaisCadastrados = [await Profissional.create(data)];
    }

    // Enviar e-mails para os profissionais (se necessário)
    for (const [index, profissional] of profissionaisCadastrados.entries()) {
      const { sendEmail, senhaProvisoria } = profissionaisProcessados[index];
      if (sendEmail != 0) {
        try {
          await enviarSenhaProvisoria(profissional.email, senhaProvisoria);
        } catch (emailError) {
          console.error(
            `Erro ao enviar e-mail para ${profissional.email}:`,
            emailError
          );
          // Não interrompe o fluxo, apenas registra o erro
        }
      }
    }

    // Retornar resposta
    res.status(201).json(
      profissionaisCadastrados.length === 1
        ? profissionaisCadastrados[0] // Retorna objeto para um profissional
        : profissionaisCadastrados // Retorna array para múltiplos profissionais
    );
  } catch (error) {
    console.error("Erro ao criar profissional(is):", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message).join(", ") });
    }
    res
      .status(400)
      .json({ error: error.message || "Erro ao criar profissional(is)." });
  }
};

// Função para gerar uma senha provisória aleatória
function gerarSenhaProvisoria(length = 8) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let senha = "";
  for (let i = 0; i < length; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

const getNivelDescricao = (roleId) => {
  switch (roleId) {
    case 0:
      return "Consultar";
    case 1:
      return "Criar";
    case 2:
      return "Alterar";
    default:
      return "desconhecido";
  }
};

const lerProfissionais = async (req, res) => {
  try {
    const profissionais = await Profissional.findAll({
      order: [["nome", "ASC"]],
    });

    const emailsExcluir = [
      "diretor@medagenda.com",
      "atendente@medagenda.com",
      "medico@medagenda.com",
    ];

    // Filtra o usuário indesejado (por exemplo, o administrador)
    const profissionaisFiltrados = profissionais.filter(
      (profissional) => !emailsExcluir.includes(profissional.email)
    );

    const profissionaisFormatados = profissionaisFiltrados.map(
      (profissional) => ({
        ...profissional.dataValues,
        roleId: profissional.roleId,
        roleIdDescricao: getNivelDescricao(profissional.roleId),
        dataAdmissao: moment
          .utc(profissional.dataAdmissao)
          .add(1, "day")
          .local()
          .format("L"),
        dataNascimento: moment
          .utc(profissional.dataNascimento)
          .add(1, "day")
          .local()
          .format("L"),
      })
    );

    res.status(200).json(profissionaisFormatados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerProfissionalId = async (req, res) => {
  try {
    const id = req.params.id;
    const profissional = await Profissional.findByPk(id);

    const profissionaisFormatados = {
      ...profissional.dataValues,
      roleId: profissional.roleId,
      roleIdDescricao: getNivelDescricao(profissional.roleId),
      dataAdmissao: moment
        .utc(profissional.dataAdmissao)
        .add(1, "day")
        .local()
        .format("L"),
      dataNascimento: moment
        .utc(profissional.dataNascimento)
        .add(1, "day")
        .local()
        .format("L"),
    };
    res.status(200).json(profissionaisFormatados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarProfissional = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizado = req.body;

    const profissional = await Profissional.findByPk(id);
    if (!profissional)
      return res.status(404).json({ message: "Profissional não Encontrado!" });

    // Verificar se o tipoProfissional foi alterado e, se sim, atualizar a role
    if (dadosAtualizado.tipoProfissional) {
      const tiposValidos = ["Medico", "Atendente", "Diretor"];
      if (!tiposValidos.includes(dadosAtualizado.tipoProfissional)) {
        return res
          .status(400)
          .json({ error: "Tipo de profissional inválido!" });
      }

      switch (dadosAtualizado.tipoProfissional) {
        case "Diretor":
          dadosAtualizado.roleId = 1;
          break;
        case "Medico":
          dadosAtualizado.roleId = 3;
          break;
        case "Atendente":
          dadosAtualizado.roleId = 2;
          break;
        default:
          return res.status(400).json({ error: "Role não definida!" });
      }
    }

    const hashedPassword = await bcrypt.hash(dadosAtualizado.password, 10);

    await profissional.update({ ...dadosAtualizado, password: hashedPassword });
    res
      .status(200)
      .json({ message: "Profissional atualizado com Sucesso!", profissional });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirProfissional = async (req, res) => {
  try {
    const id = req.params.id;

    const profissional = await Profissional.findByPk(id);
    if (!profissional)
      res.status(401).json({ message: "Profissional não Encontrado!" });

    await profissional.destroy();
    res.status(200).json({ message: "Profissional Excluido com Sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarProfissional,
  lerProfissionais,
  lerProfissionalId,
  atualizarProfissional,
  excluirProfissional,
};
