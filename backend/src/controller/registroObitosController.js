const { models } = require("../model/index");
const { Op } = require("sequelize");
const RegistroObitos = models.RegistroObitos;
const Paciente = models.Paciente;
const Profissional = models.Profissional;
const moment = require("moment");

// Função para formatar CPF com pontuação
const formatarCpfComPontuacao = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return cpf; // Retorna original se inválido
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(6, 9)}-${cpfLimpo.slice(9)}`;
};

const criarRegistroObito = async (req, res) => {
  try {
    const {
      cpfPaciente,
      matriculaProfissional,
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status,
    } = req.body;

    console.log("Dados recebidos para criação:", req.body);

    if (!cpfPaciente || !matriculaProfissional || !dataObito || !causaObito || !localObito || !numeroAtestadoObito) {
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    // Normalizar e formatar CPF
    const cpfNormalizado = cpfPaciente.replace(/\D/g, "");
    const cpfComPontuacao = formatarCpfComPontuacao(cpfNormalizado);
    console.log("CPF recebido:", cpfPaciente, "Normalizado:", cpfNormalizado, "Com pontuação:", cpfComPontuacao);

    const paciente = await Paciente.findOne({
      where: { cpf: { [Op.in]: [cpfPaciente, cpfNormalizado, cpfComPontuacao] } },
    });
    if (!paciente) {
      console.log("Paciente não encontrado para CPF:", cpfPaciente);
      return res.status(400).json({ message: `Paciente com CPF ${cpfPaciente} não encontrado` });
    }

    const matriculaInt = parseInt(matriculaProfissional, 10);
    if (isNaN(matriculaInt)) {
      return res.status(400).json({ message: "Matrícula do profissional deve ser um número válido" });
    }

    const profissional = await Profissional.findOne({ where: { matricula: matriculaInt } });
    if (!profissional) {
      console.log("Profissional não encontrado para matrícula:", matriculaProfissional);
      return res.status(400).json({ message: `Profissional com matrícula ${matriculaProfissional} não encontrado` });
    }

    const parsedDataObito = moment(dataObito, ["YYYY-MM-DDTHH:mm", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601]).isValid()
      ? moment(dataObito, ["YYYY-MM-DDTHH:mm", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601]).toDate()
      : null;
    if (!parsedDataObito) {
      return res.status(400).json({ message: "Formato de data inválido para dataObito" });
    }

    const registro = await RegistroObitos.create({
      cpfPaciente: paciente.cpf, // Usa o CPF do banco (com pontuação)
      matriculaProfissional: matriculaInt,
      dataObito: parsedDataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status: status || "Ativo",
    });

    const registroCriado = await RegistroObitos.findByPk(registro.idRegistroObito, {
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
      ],
    });

    const registroFormatado = {
      ...registroCriado.dataValues,
      cpfPaciente: registroCriado.cpfPaciente.replace(/\D/g, ""), // Retorna sem pontuação para o frontend
      matriculaProfissional: parseInt(registroCriado.matriculaProfissional, 10).toString(),
      dataObito: registroCriado.dataObito
        ? moment.utc(registroCriado.dataObito).local().format("YYYY-MM-DD HH:mm")
        : "Data inválida",
    };

    res.status(201).json({ data: registroFormatado });
  } catch (error) {
    console.error("Erro ao criar registro de óbito:", error);
    console.error("Stack trace:", error.stack);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: `Erro: CPF ${req.body.cpfPaciente} ou matrícula ${req.body.matriculaProfissional} não encontrado(s)`,
      });
    }
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

const lerTodosRegistrosObitos = async (req, res) => {
  try {
    const registros = await RegistroObitos.findAll({
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"], required: false },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"], required: false },
      ],
      where: {
        status: "Ativo",
      },
    });

    console.log("Número de registros encontrados:", registros.length);
    if (!Array.isArray(registros)) {
      console.error("Registros não é um array:", registros);
      return res.status(500).json({ error: "Erro interno: dados de óbitos inválidos" });
    }

    const registrosFormatados = registros.map((r) => ({
      ...r.dataValues,
      cpfPaciente: r.cpfPaciente.replace(/\D/g, ""), // Retorna sem pontuação
      matriculaProfissional: parseInt(r.matriculaProfissional, 10).toString(),
      dataObito: r.dataObito ? moment.utc(r.dataObito).local().format("YYYY-MM-DD HH:mm") : "Data inválida",
    }));

    console.log("Registros formatados:", registrosFormatados);
    res.status(200).json({ data: registrosFormatados });
  } catch (error) {
    console.error("Erro ao buscar registros de óbitos:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

const lerRegistroObitoId = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito, {
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"], required: false },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"], required: false },
      ],
    });

    if (registro) {
      const registroFormatado = {
        ...registro.dataValues,
        cpfPaciente: registro.cpfPaciente.replace(/\D/g, ""), // Retorna sem pontuação
        matriculaProfissional: parseInt(registro.matriculaProfissional, 10).toString(),
        dataObito: registro.dataObito ? moment.utc(registro.dataObito).local().format("YYYY-MM-DD HH:mm") : "Data inválida",
      };
      res.status(200).json(registroFormatado);
    } else {
      res.status(404).json({ error: "Registro de óbito não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar registro de óbito:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

const atualizarRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    console.log("ID do registro:", idRegistroObito);
    console.log("Dados recebidos:", req.body);

    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      console.log("Registro não encontrado para ID:", idRegistroObito);
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }
    console.log("Registro encontrado:", registro.dataValues);

    const {
      cpfPaciente,
      matriculaProfissional,
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status,
    } = req.body;

    console.log("Validando campos obrigatórios:", { causaObito, localObito, numeroAtestadoObito });
    if (!causaObito || !localObito || !numeroAtestadoObito) {
      return res.status(400).json({
        message: "Campos obrigatórios (causaObito, localObito, numeroAtestadoObito) não podem ser vazios",
      });
    }

    if (causaObito && causaObito.trim() === "") {
      return res.status(400).json({ message: "Causa do óbito não pode ser vazia" });
    }

    let cpfNormalizado = registro.cpfPaciente; // Manter CPF original por padrão
    if (cpfPaciente && cpfPaciente !== registro.cpfPaciente) {
      const cpfSemPontuacao = cpfPaciente.replace(/\D/g, "");
      const cpfComPontuacao = formatarCpfComPontuacao(cpfSemPontuacao);
      console.log("CPF recebido:", cpfPaciente, "Sem pontuação:", cpfSemPontuacao, "Com pontuação:", cpfComPontuacao);
      // Listar todos os CPFs disponíveis para depuração
      const pacientes = await Paciente.findAll({ attributes: ["cpf"] });
      console.log("CPFs disponíveis no banco:", pacientes.map((p) => p.cpf));
      const paciente = await Paciente.findOne({
        where: { cpf: { [Op.in]: [cpfPaciente, cpfSemPontuacao, cpfComPontuacao] } },
      });
      if (!paciente) {
        console.log("Paciente não encontrado para CPF:", cpfPaciente);
        return res.status(400).json({ message: `Paciente com CPF ${cpfPaciente} não encontrado` });
      }
      console.log("Paciente encontrado:", paciente.dataValues);
      cpfNormalizado = paciente.cpf; // Usa o CPF do banco (com pontuação)
    }

    let matriculaInt = registro.matriculaProfissional;
    if (matriculaProfissional && matriculaProfissional !== registro.matriculaProfissional.toString()) {
      matriculaInt = parseInt(matriculaProfissional, 10);
      console.log("Matrícula convertida:", matriculaInt);
      if (isNaN(matriculaInt)) {
        return res.status(400).json({ message: "Matrícula do profissional deve ser um número válido" });
      }
      const profissional = await Profissional.findOne({ where: { matricula: matriculaInt } });
      if (!profissional) {
        console.log("Profissional não encontrado para matrícula:", matriculaProfissional);
        return res.status(400).json({ message: `Profissional com matrícula ${matriculaProfissional} não encontrado` });
      }
      console.log("Profissional encontrado:", profissional.dataValues);
    }

    let parsedDataObito = registro.dataObito;
    if (dataObito) {
      console.log("Data recebida:", dataObito);
      parsedDataObito = moment(dataObito, ["YYYY-MM-DDTHH:mm", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601]).isValid()
        ? moment(dataObito, ["YYYY-MM-DDTHH:mm", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601]).toDate()
        : null;
      if (!parsedDataObito) {
        return res.status(400).json({ message: "Formato de data inválido para dataObito" });
      }
    }

    console.log("Atualizando registro com dados:", {
      cpfPaciente: cpfNormalizado,
      matriculaProfissional: matriculaInt,
      dataObito: parsedDataObito,
      causaObito: causaObito || registro.causaObito,
      localObito: localObito || registro.localObito,
      numeroAtestadoObito: numeroAtestadoObito || registro.numeroAtestadoObito,
      observacoes: observacoes !== undefined ? observacoes : registro.observacoes,
      status: status || registro.status,
    });
    await registro.update({
      cpfPaciente: cpfNormalizado,
      matriculaProfissional: matriculaInt,
      dataObito: parsedDataObito,
      causaObito: causaObito || registro.causaObito,
      localObito: localObito || registro.localObito,
      numeroAtestadoObito: numeroAtestadoObito || registro.numeroAtestadoObito,
      observacoes: observacoes !== undefined ? observacoes : registro.observacoes,
      status: status || registro.status,
    });
    console.log("Registro atualizado com sucesso");

    const registroAtualizado = await RegistroObitos.findByPk(idRegistroObito, {
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"], required: false },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"], required: false },
      ],
    });
    if (!registroAtualizado) {
      console.log("Registro atualizado não encontrado para ID:", idRegistroObito);
      return res.status(404).json({ message: "Registro atualizado não encontrado" });
    }
    console.log("Registro atualizado retornado:", registroAtualizado.dataValues);

    const registroFormatado = {
      ...registroAtualizado.dataValues,
      cpfPaciente: registroAtualizado.cpfPaciente.replace(/\D/g, ""), // Retorna sem pontuação
      matriculaProfissional: parseInt(registroAtualizado.matriculaProfissional, 10).toString(),
      dataObito: registroAtualizado.dataObito
        ? moment.utc(registroAtualizado.dataObito).local().format("YYYY-MM-DD HH:mm")
        : "Data inválida",
    };

    res.status(200).json({ message: "Registro de óbito atualizado com sucesso!", registro: registroFormatado });
  } catch (error) {
    console.error("Erro ao atualizar registro de óbito:", error);
    console.error("Stack trace:", error.stack);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: `Erro: CPF ${req.body.cpfPaciente} ou matrícula ${req.body.matriculaProfissional} não encontrado(s)`,
      });
    }
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

const excluirRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      console.log("Registro não encontrado para ID:", idRegistroObito);
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }
    await registro.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao deletar registro de óbito:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

module.exports = {
  criarRegistroObito,
  lerTodosRegistrosObitos,
  lerRegistroObitoId,
  atualizarRegistroObito,
  excluirRegistroObito,
};