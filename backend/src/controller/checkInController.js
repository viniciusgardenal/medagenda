const CheckIn = require("../model/checkin");

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
      profissionalId,
      status,
    } = req.body;

    const checkIn = await CheckIn.create({
      consultaId,
      horaChegada,
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade,
      status,
      profissionalId,
    });

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

// Listar pacientes em espera (fila de atendimento)
exports.getCheckIn = async (req, res) => {
  try {
    const listarCheckIn = await CheckIn.findAll({});

    res.status(200).json(listarCheckIn);
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

    const checkIn = await CheckIn.findAll({
      where: { consultaId },
    });

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in não encontrado" });
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
