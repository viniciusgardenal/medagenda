const Consulta = require("../model/consulta");
const Atendimento = require("../model/atendimentos");
const CheckIn = require("../model/checkin");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const TipoConsulta = require("../model/tipoConsulta");
const { Op } = require("sequelize");

const realizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params; // ID da consulta
    const { diagnostico, prescricao, observacoes } = req.body;

    // Validar entrada
    if (!diagnostico && !prescricao && !observacoes) {
      return res.status(400).json({
        error:
          "Pelo menos um campo (diagnóstico, prescrição ou observações) deve ser fornecido.",
      });
    }

    // Verificar se a consulta existe
    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: "Consulta não encontrada." });
    }

    // Verificar se a consulta está agendada
    if (consulta.status !== "agendada") {
      return res
        .status(400)
        .json({ error: "A consulta não está no status 'agendada'." });
    }

    // // Verificar permissão do usuário (exemplo: apenas o médico responsável)
    // if (req.user && req.user.id !== consulta.medicoId) {
    //   return res.status(403).json({
    //     error: "Apenas o médico responsável pode registrar o atendimento.",
    //   });
    // }

    // Criar o registro de atendimento
    const novoAtendimento = await Atendimento.create({
      consultaId: id,
      diagnostico: diagnostico || null,
      prescricao: prescricao || null,
      observacoes: observacoes || null,
      dataAtendimento: new Date(),
    });

    // Atualizar o status da consulta
    consulta.status = "realizada";
    await consulta.save();

    // Retornar o atendimento criado
    res.status(201).json(novoAtendimento);
  } catch (error) {
    console.error("Erro ao realizar atendimento:", error);
    res.status(500).json({
      error: "Erro interno ao realizar atendimento. Tente novamente.",
    });
  }
};

const getAtendimentoPorId = async (req, res) => {
  try {
    const { id } = req.params; // ID do atendimento

    // Buscar o atendimento com informações relacionadas
    const atendimento = await Atendimento.findByPk(id, {
      include: [
        {
          model: Consulta,
          as: "consulta",
          include: ["paciente", "medico", "tipoConsulta"],
        },
      ],
    });

    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    res.status(200).json(atendimento);
  } catch (error) {
    console.error("Erro ao buscar atendimento:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao buscar atendimento. Tente novamente." });
  }
};

const atualizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params; // ID do atendimento
    const { diagnostico, prescricao, observacoes } = req.body;

    // Validar entrada
    if (!diagnostico && !prescricao && !observacoes) {
      return res.status(400).json({
        error:
          "Pelo menos um campo (diagnóstico, prescrição ou observações) deve ser fornecido.",
      });
    }

    // Buscar o atendimento pelo ID
    const atendimento = await Atendimento.findByPk(id);
    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    // Verificar permissão do usuário (exemplo: apenas o médico responsável)
    const consulta = await Consulta.findByPk(atendimento.consultaId);
    if (req.user && req.user.id !== consulta.medicoId) {
      return res.status(403).json({
        error: "Apenas o médico responsável pode atualizar o atendimento.",
      });
    }

    // Atualizar apenas os campos fornecidos
    if (diagnostico !== undefined) atendimento.diagnostico = diagnostico;
    if (prescricao !== undefined) atendimento.prescricao = prescricao;
    if (observacoes !== undefined) atendimento.observacoes = observacoes;

    await atendimento.save();

    res.status(200).json(atendimento);
  } catch (error) {
    console.error("Erro ao atualizar atendimento:", error);
    res.status(500).json({
      error: "Erro interno ao atualizar atendimento. Tente novamente.",
    });
  }
};

const excluirAtendimento = async (req, res) => {
  try {
    const { id } = req.params; // ID do atendimento

    // Buscar o atendimento pelo ID
    const atendimento = await Atendimento.findByPk(id);
    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    // Verificar permissão do usuário (exemplo: apenas o médico responsável)
    // const consulta = await Consulta.findByPk(atendimento.consultaId);
    // if (req.user && req.user.id !== consulta.medicoId) {
    //   return res.status(403).json({
    //     error: "Apenas o médico responsável pode excluir o atendimento.",
    //   });
    // }

    // Excluir o atendimento
    await atendimento.destroy();

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Erro ao excluir atendimento:", error);
    res
      .status(500)
      .json({ error: "Erro interno ao excluir atendimento. Tente novamente." });
  }
};

const getAtendimentosPorData = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      where: {
        status: { [Op.in]: ["agendada", "realizada"] }, // Opcional: filtrar status da consulta
      },
      include: [
        {
          model: CheckIn,
          as: "checkin",
          where: { status: "registrado" }, // Filtra check-ins com status "registrado"
          required: true, // Garante que só retorna consultas com check-in
        },
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "medico" },
        { model: TipoConsulta, as: "tipoConsulta" },
        {
          model: Atendimento,
          as: "atendimento",
          required: false,
        },
      ],
    });

    // console.log(consultas);

    res.status(200).json(consultas);
  } catch (error) {
    console.error("Erro ao buscar consultas com check-in registrado:", error);
    res.status(500).json({ error: "Erro interno ao buscar consultas." });
  }
};

module.exports = {
  realizarAtendimento,
  getAtendimentoPorId,
  atualizarAtendimento,
  excluirAtendimento,
  getAtendimentosPorData,
};
