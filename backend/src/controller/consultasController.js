const Consulta = require("../model/consulta");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const CheckIn = require("../model/checkin");
const tipoConsulta = require("../model/tipoConsulta");
const { Op } = require("sequelize");

const criarConsulta = async (req, res) => {
  try {
    const {
      cpfPaciente,
      medicoId,
      idTipoConsulta,
      dataConsulta,
      horaConsulta,
      motivo,
      responsavelAgendamento,
      prioridade = 0,
      status = "agendada",
    } = req.body;

    if (
      !cpfPaciente ||
      !medicoId ||
      !idTipoConsulta ||
      !dataConsulta ||
      !horaConsulta ||
      !motivo ||
      !responsavelAgendamento
    ) {
      return res.status(400).json({
        error:
          "Campos obrigatórios faltando: cpfPaciente, medicoId, idTipoConsulta, dataConsulta, horaConsulta, motivo, responsavelAgendamento.",
      });
    }

    const [paciente, medico, ttipoConsulta] = await Promise.all([
      Paciente.findByPk(cpfPaciente),
      Profissional.findByPk(medicoId),
      tipoConsulta.findByPk(idTipoConsulta),
    ]);

    if (!paciente) {
      return res.status(400).json({ error: "Paciente não encontrado." });
    }
    if (!medico) {
      return res.status(400).json({ error: "Médico não encontrado." });
    }
    if (!ttipoConsulta) {
      return res
        .status(400)
        .json({ error: "Tipo de consulta não encontrado." });
    }

    const consultaExistente = await Consulta.findOne({
      where: {
        medicoId: medicoId,
        dataConsulta: dataConsulta,
        horaConsulta: horaConsulta,
      },
    });

    if (consultaExistente) {
      return res.status(409).json({
        error: "Já existe uma consulta agendada para este médico, data e hora.",
      });
    }

    const novaConsulta = await Consulta.create({
      cpfPaciente,
      medicoId,
      idTipoConsulta,
      dataConsulta,
      horaConsulta,
      prioridade,
      motivo,
      responsavelAgendamento,
      status,
    });

    const consultaCompleta = await Consulta.findByPk(novaConsulta.id, {
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          as: "medico",
          attributes: ["matricula", "nome", "crm"],
        },
        {
          model: tipoConsulta,
          as: "tipoConsulta",
          attributes: ["idTipoConsulta", "nomeTipoConsulta"],
        },
      ],
    });

    res.status(201).json(consultaCompleta);
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "Chave estrangeira inválida. Verifique cpfPaciente, medicoId ou idTipoConsulta.",
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: error.errors.map((e) => e.message).join(", "),
      });
    }
    res.status(400).json({ error: error.message || "Erro ao criar consulta." });
  }
};

const listarConsultasDoDia = async (req, res) => {
  try {
    const data = req.params.data || new Date().toISOString().split("T")[0];
    const { status } = req.query; // Get status from query parameter

    const whereClause = { dataConsulta: data };
    if (status) {
      whereClause.status = status; // Apply status filter if provided
    }

    const consultas = await Consulta.findAll({
      where: whereClause,
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "medico" },
        { model: tipoConsulta, as: "tipoConsulta" },
        { model: CheckIn, as: "checkin" },
      ],
    });

    res.status(200).json(consultas);
  } catch (error) {
    console.error("Erro ao listar consultas do dia:", error);
    res.status(400).json({
      status: "error",
      message: "Erro ao listar consultas",
      error: error.message,
    });
  }
};

const listarConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.findAll({
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "medico" },
        { model: tipoConsulta, as: "tipoConsulta" },
        { model: CheckIn, as: "checkin" },
      ],
    });

    res.status(200).json(consultas);
  } catch (error) {
    console.error("Erro ao listar consultas:", error);
    res.status(400).json({
      status: "error",
      message: "Erro ao listar consultas",
      error: error.message,
    });
  }
};

const getHorariosDisponiveis = async (req, res) => {
  const { medicoId, dataConsulta } = req.params;

  try {
    const consultas = await Consulta.findAll({
      where: {
        medicoId: medicoId,
        dataConsulta: dataConsulta,
        status: { [Op.ne]: "cancelada" },
      },
      attributes: ["horaConsulta"],
    });

    const horariosOcupados = consultas.map((c) => c.horaConsulta);
    const horariosPossiveis = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];

    const horariosDisponiveis = horariosPossiveis.filter(
      (horarioPossivel) => !horariosOcupados.includes(horarioPossivel)
    );

    res.status(200).json({ data: horariosDisponiveis });
  } catch (error) {
    console.error("Erro ao buscar horários disponíveis:", error);
    res.status(500).json({
      status: "error",
      message: "Erro ao buscar horários disponíveis",
      error: error.message,
    });
  }
};

const cancelarConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivoCancelamento } = req.body;

    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: "Consulta não encontrada." });
    }

    if (consulta.status !== "agendada") {
      return res.status(400).json({ error: "Consulta não está agendada." });
    }

    consulta.status = "cancelada";
    consulta.motivoCancelamento = motivoCancelamento || null;
    await consulta.save();

    const consultaCompleta = await Consulta.findByPk(id, {
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "medico" },
        { model: tipoConsulta, as: "tipoConsulta" },
        { model: CheckIn, as: "checkin" },
      ],
    });

    res.status(200).json(consultaCompleta);
  } catch (error) {
    console.error("Erro ao cancelar consulta:", error);
    res.status(500).json({ error: "Erro interno ao cancelar consulta." });
  }
};

const alterarConsultaEhAtendimentoCancelado = async (req, res) => {
  try {
    const { id } = req.params;
    const { ehAtendimentoCancelado } = req.body;

    const consulta = await Consulta.findByPk(id);
    if (!consulta) {
      return res.status(404).json({ error: "Consulta não encontrada." });
    }

    consulta.ehAtendimentoCancelado = ehAtendimentoCancelado;
    await consulta.save();

    res.status(200).json(consulta);
  } catch (error) {
    console.error("Erro ao alterar ehAtendimentoCancelado:", error);
    res.status(500).json({ error: "Erro interno ao alterar ehAtendimentoCancelado." });
  }
};

module.exports = {
  criarConsulta,
  listarConsultasDoDia,
  listarConsultas,
  getHorariosDisponiveis,
  cancelarConsulta,
  alterarConsultaEhAtendimentoCancelado
};
