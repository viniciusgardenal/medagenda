const Consulta = require("../model/consulta");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const CheckIn = require("../model/checkin");
const tipoConsulta = require("../model/tipoConsulta");

const criarConsulta = async (req, res) => {
  try {
    // Log para depuração
    console.log("Dados recebidos para criar consulta:", req.body);

    // Extrair e validar campos obrigatórios
    const {
      pacienteId,
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
      !pacienteId ||
      !medicoId ||
      !idTipoConsulta ||
      !dataConsulta ||
      !horaConsulta ||
      !motivo ||
      !responsavelAgendamento
    ) {
      return res.status(400).json({
        error:
          "Campos obrigatórios faltando: pacienteId, medicoId, idTipoConsulta, dataConsulta, horaConsulta, motivo, responsavelAgendamento.",
      });
    }

    // Validar chaves estrangeiras
    const [paciente, medico, ttipoConsulta] = await Promise.all([
      Paciente.findByPk(pacienteId),
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

    // Criar a consulta
    const novaConsulta = await Consulta.create({
      pacienteId,
      medicoId,
      idTipoConsulta,
      dataConsulta,
      horaConsulta,
      prioridade,
      motivo,
      responsavelAgendamento,
      status,
    });

    // Buscar a consulta com dados relacionados
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

    // Log para depuração
    console.log("Consulta completa retornada:", consultaCompleta.toJSON());

    res.status(201).json(consultaCompleta);
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error:
          "Chave estrangeira inválida. Verifique pacienteId, medicoId ou idTipoConsulta.",
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
    // console.log(req.params.data);

    // Pega a data do query parameter ou usa o dia atual como padrão
    const data = req.params.data || new Date().toISOString().split("T")[0]; // Ex.: "2025-04-08"
    console.log(data);

    // Busca consultas do dia com relacionamentos
    const consultas = await Consulta.findAll({
      where: {
        dataConsulta: data,
        status: "agendada", // Apenas consultas agendadas
      },
      include: [
        { model: Paciente, as: "paciente" }, // Dados do paciente
        { model: Profissional, as: "medico" }, // Dados do médico (ajustado de "profissionais" para "medico")
        { model: tipoConsulta, as: "tipoConsulta" }, // Dados do médico (ajustado de "profissionais" para "medico")
        { model: CheckIn, as: "checkin" }, // Dados do check-in (pode ser null)
      ],
    });

    // Retorna as consultas no formato esperado pela API
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

module.exports = {
  criarConsulta,
  listarConsultasDoDia,
};
