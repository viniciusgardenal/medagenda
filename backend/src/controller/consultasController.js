
const Consulta = require("../model/consulta");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const CheckIn = require("../model/checkin");

const criarConsulta = async (req, res) => {
  try {
    const novaConsulta = await Consulta.create(req.body);
    res.status(201).json(novaConsulta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarConsultasDoDia = async (req, res) => {
  try {
    // Pega a data do query parameter ou usa o dia atual como padrão
    const data = req.query.data || new Date().toISOString().split("T")[0]; // Ex.: "2025-04-08"

    // Busca consultas do dia com relacionamentos
    const consultas = await Consulta.findAll({
      where: {
        dataConsulta: data,
        status: "agendada", // Apenas consultas agendadas
      },
      include: [
        { model: Paciente, as: "paciente"}, // Dados do paciente
        { model: Profissional, as: "profissionais" }, // Dados do médico (ajustado de "profissionais" para "medico")
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
