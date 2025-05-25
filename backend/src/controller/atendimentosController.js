const Consulta = require("../model/consulta");
const Atendimento = require("../model/atendimentos");
const CheckIn = require("../model/checkin");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const TipoConsulta = require("../model/tipoConsulta");
const Atestado = require("../model/gerarAtestados");
const Receita = require("../model/receitas");
const SolicitacaoExames = require("../model/solicitacaoExames");
const { Op } = require("sequelize");

const realizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params; // ID da consulta
    const {
      diagnostico,
      prescricao,
      observacoes,
      atestados,
      receitas,
      exames,
    } = req.body;

    // Validar entrada
    if (
      !diagnostico &&
      !prescricao &&
      !observacoes &&
      !atestados &&
      !receitas &&
      !exames
    ) {
      return res.status(400).json({
        error:
          "Pelo menos um campo (diagnóstico, prescrição, observações, atestados, receitas ou exames) deve ser fornecido.",
      });
    }

    // Verificar se a consulta existe e está no status correto
    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: "Consulta não encontrada." });
    }
    if (consulta.status !== "checkin_realizado") {
      return res
        .status(400)
        .json({ error: "A consulta não está no status 'checkin_realizado'." });
    }

    // Verificar permissão do médico
    if (req.user && req.user.id !== consulta.medicoId) {
      return res.status(403).json({
        error: "Apenas o médico responsável pode registrar o atendimento.",
      });
    }

    // Atualizar status para em_atendimento
    consulta.status = "em_atendimento";
    await consulta.save();

    // Criar o registro de atendimento
    const novoAtendimento = await Atendimento.create({
      consultaId: id,
      diagnostico: diagnostico || null,
      prescricao: prescricao || null,
      observacoes: observacoes || null,
      dataAtendimento: new Date(),
    });

    // Criar atestados, receitas e exames, se fornecidos
    if (atestados) {
      await Atestado.create({
        consultaId: id,
        matriculaProfissional: consulta.medicoId,
        cpfPaciente: consulta.cpfPaciente,
        ...atestados, // Ex.: { dias, cid, observacoes }
      });
    }
    if (receitas) {
      for (const receita of receitas) {
        await Receita.create({
          consultaId: id,
          matriculaProfissional: consulta.medicoId,
          cpfPaciente: consulta.cpfPaciente,
          ...receita, // Ex.: { idMedicamento, dose, periodicidade }
        });
      }
    }
    if (exames) {
      for (const exame of exames) {
        await SolicitacaoExames.create({
          consultaId: id,
          matriculaProfissional: consulta.medicoId,
          cpfPaciente: consulta.cpfPaciente,
          ...exame, // Ex.: { idTipoExame, dataPrevistaRetorno }
        });
      }
    }

    // Atualizar status da consulta para realizada
    consulta.status = "realizada";
    await consulta.save();

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
    const { id } = req.params;

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

    if (req.user && req.user.id !== atendimento.consulta.medicoId) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    res.status(200).json(atendimento);
  } catch (error) {
    console.error("Erro ao buscar atendimento:", error);
    res.status(500).json({ error: "Erro interno ao buscar atendimento." });
  }
};

const atualizarAtendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnostico, prescricao, observacoes } = req.body;

    if (!diagnostico && !prescricao && !observacoes) {
      return res.status(400).json({
        error:
          "Pelo menos um campo (diagnóstico, prescrição ou observações) deve ser fornecido.",
      });
    }

    const atendimento = await Atendimento.findByPk(id);
    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    const consulta = await Consulta.findByPk(atendimento.consultaId);
    if (req.user && req.user.id !== consulta.medicoId) {
      return res.status(403).json({
        error: "Apenas o médico responsável pode atualizar o atendimento.",
      });
    }

    if (diagnostico !== undefined) atendimento.diagnostico = diagnostico;
    if (prescricao !== undefined) atendimento.prescricao = prescricao;
    if (observacoes !== undefined) atendimento.observacoes = observacoes;

    await atendimento.save();

    res.status(200).json(atendimento);
  } catch (error) {
    console.error("Erro ao atualizar atendimento:", error);
    res.status(500).json({ error: "Erro interno ao atualizar atendimento." });
  }
};

const excluirAtendimento = async (req, res) => {
  try {
    const { id } = req.params;

    const atendimento = await Atendimento.findByPk(id);
    if (!atendimento) {
      return res.status(404).json({ error: "Atendimento não encontrado." });
    }

    const consulta = await Consulta.findByPk(atendimento.consultaId);
    if (req.user && req.user.id !== consulta.medicoId) {
      return res.status(403).json({
        error: "Apenas o médico responsável pode excluir o atendimento.",
      });
    }

    await atendimento.destroy();

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir atendimento:", error);
    res.status(500).json({ error: "Erro interno ao excluir atendimento." });
  }
};

const getAtendimentosPorData = async (req, res) => {
  try {
    const medicoId = req.user.id;
    const data = req.query.data || new Date().toISOString().split("T")[0];

    const consultas = await Consulta.findAll({
      where: {
        medicoId,
        dataConsulta: data,
        status: {
          [Op.in]: ["checkin_realizado", "em_atendimento", "realizada"],
        },
      },
      include: [
        { model: CheckIn, as: "checkin", required: true },
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "medico" },
        { model: TipoConsulta, as: "tipoConsulta" },
        { model: Atendimento, as: "atendimento", required: false },
      ],
      order: [
        [{ model: CheckIn, as: "checkin" }, "prioridade", "DESC"],
        [{ model: CheckIn, as: "checkin" }, "horaChegada", "ASC"],
      ],
    });

    res.status(200).json(consultas);
  } catch (error) {
    console.error("Erro ao buscar consultas com check-in:", error);
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
