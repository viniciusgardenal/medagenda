const CheckIn = require("../model/checkin");
const Consulta = require("../model/consulta");
const { Op } = require("sequelize");

exports.realizarCheckIn = async (req, res) => {
  try {
    const {
      consultaId,
      horaChegada,
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade,
      matriculaProfissional,
    } = req.body;

    // Validar consulta
    const consulta = await Consulta.findByPk(consultaId);
    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada" });
    }

    // Verificar atraso (>30 minutos)
    const horaConsulta = new Date(
      `${consulta.dataConsulta}T${consulta.horaConsulta}`
    );
    const horaChegadaDate = new Date(horaChegada || Date.now());
    const diffMinutes = (horaChegadaDate - horaConsulta) / 1000 / 60;
    if (diffMinutes > 30) {
      return res.status(400).json({
        message:
          "Atraso superior a 30 minutos. Consulta deve ser cancelada ou autorizada manualmente.",
      });
    }

    // Sugerir prioridade com base em sinais vitais
    let suggestedPriority = prioridade || 0;
    if (temperatura && temperatura > 38) {
      suggestedPriority = 2; // Alta prioridade para febre alta
    } else if (
      pressaoArterial &&
      /1[8-9][0-9]\/1[0-1][0-9]/.test(pressaoArterial)
    ) {
      suggestedPriority = Math.max(suggestedPriority, 1); // Média prioridade para pressão alta
    }

    // Criar check-in
    const checkIn = await CheckIn.create({
      consultaId,
      horaChegada: horaChegada || Date.now(),
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade: suggestedPriority,
      matriculaProfissional,
    });

    // Atualizar status da consulta
    consulta.status = "checkin_realizado";
    await consulta.save();

    res.status(201).json({
      message: "Check-in realizado com sucesso",
      checkIn,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao realizar check-in", error: error.message });
  }
};

exports.getCheckIn = async (req, res) => {
  try {
    const medicoId = req.user.id; // ID do médico logado
    const data = new Date().toISOString().split("T")[0]; // Data atual

    const checkIns = await CheckIn.findAll({
      include: [
        {
          model: Consulta,
          as: "consulta",
          where: { medicoId, dataConsulta: data, status: "checkin_realizado" },
        },
      ],
      order: [
        ["prioridade", "DESC"],
        ["horaChegada", "ASC"],
      ],
    });

    res.status(200).json(checkIns);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao listar fila de atendimento",
      error: error.message,
    });
  }
};

exports.getCheckInConsultas = async (req, res) => {
  try {
    const { consultaId } = req.params;

    const checkIn = await CheckIn.findOne({
      where: { consultaId },
      include: [{ model: Consulta, as: "consulta" }],
    });

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in não encontrado" });
    }

    // Verificar permissão do médico
    if (req.user.id !== checkIn.consulta.medicoId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    res.status(200).json(checkIn);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao listar check-in",
      error: error.message,
    });
  }
};
