const Pacientes = require("../model/paciente");
const moment = require("moment");
require("moment/locale/pt-br"); // Para definir o locale em português

const cadastrarPaciente = async (req, res) => {
  try {
    // Função para validar um paciente
    const validarPaciente = (paciente) => {
      const camposObrigatorios = ["nome", "sobrenome", "cpf"];
      for (const campo of camposObrigatorios) {
        if (
          !paciente[campo] ||
          typeof paciente[campo] !== "string" ||
          paciente[campo].trim() === ""
        ) {
          throw new Error(
            `O campo ${campo} é obrigatório e deve ser uma string não vazia.`
          );
        }
      }
      // Validar formato básico do CPF (exemplo simplificado)
      if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(paciente.cpf)) {
        throw new Error("CPF inválido. Use o formato XXX.XXX.XXX-XX.");
      }
    };

    // Verificar se é um array ou objeto
    const pacientesInput = Array.isArray(req.body) ? req.body : [req.body];

    // Validar cada paciente
    pacientesInput.forEach((paciente, index) => {
      if (!paciente || typeof paciente !== "object") {
        throw new Error(
          `Entrada inválida no índice ${index}. Esperado um objeto de paciente.`
        );
      }
      validarPaciente(paciente);
    });

    // Cadastrar pacientes
    let pacientesCadastrados;
    if (Array.isArray(req.body)) {
      // Cadastrar múltiplos pacientes com bulkCreate
      pacientesCadastrados = await Pacientes.bulkCreate(req.body, {
        validate: true, // Aplicar validações do modelo
        individualHooks: true, // Executar hooks (e.g., beforeCreate) para cada paciente
      });
    } else {
      // Cadastrar um único paciente
      pacientesCadastrados = [await Pacientes.create(req.body)];
    }

    // Retornar resposta
    res.status(201).json(
      pacientesCadastrados.length === 1
        ? pacientesCadastrados[0] // Retorna objeto para um paciente
        : pacientesCadastrados // Retorna array para múltiplos pacientes
    );
  } catch (error) {
    // Tratar erros específicos
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "CPF já cadastrado." });
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: error.errors.map((e) => e.message).join(", ") });
    }
    res
      .status(400)
      .json({ error: error.message || "Erro ao cadastrar paciente(s)." });
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
