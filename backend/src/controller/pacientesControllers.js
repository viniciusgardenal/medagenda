const Pacientes = require("../model/paciente");
const moment = require("moment");
require("moment/locale/pt-br"); // Para definir o locale em português

const cadastrarPaciente = async (req, res) => {
  try {
    const novoPaciente = await Pacientes.create(req.body);
    res.status(201).json(novoPaciente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerPaciente = async (req, res) => {
  try {
    const pacientes = await Pacientes.findAll({
      order: [["nome", "ASC"]],
    });

    const pacientesFormatados = pacientes.map((p) => ({
      ...p.dataValues,
      dataNascimento: moment
        .utc(p.dataNascimento)
        .add(1, "day")
        .local()
        .format("L"),
    }));
    res.status(200).json(pacientesFormatados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerPacienteId = async (req, res) => {
  try {
    const cpf = req.params.id;
    const paciente = await Pacientes.findByPk(cpf);

    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    // Formata os dados do paciente, garantindo que sejam valores puros
    const pacienteFormatado = {
      ...paciente.toJSON(),
      dataNascimento: moment(paciente.dataNascimento)
        .utc()
        .add(1, "day")
        .local()
        .format("L"), // Adaptação conforme sua lógica de data
    };

    res.status(200).json(pacienteFormatado);
  } catch (error) {
    console.error("Erro ao buscar paciente por CPF:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const atualizarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const paciente = await Pacientes.findByPk(id);
    if (!paciente)
      return res.status(404).json({ message: "Paciente não encontrado!" });
    await paciente.update(dadosAtualizados);
    res
      .status(200)
      .json({ message: "Paciente atualizado com sucesso!", paciente });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const paciente = await Pacientes.findByPk(id);
    if (!paciente)
      return res.status(404).json({ message: "Paciente não encontrado!" });
    await paciente.destroy();
    res.status(200).json({ message: "Paciente excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  cadastrarPaciente,
  lerPaciente,
  lerPacienteId,
  atualizarPaciente,
  excluirPaciente,
};
