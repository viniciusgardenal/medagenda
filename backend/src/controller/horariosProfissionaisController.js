const HorarioProfissional = require("../model/horariosProfissionais"); // Ajustado para o novo nome
const Profissional = require("../model/profissionais");
const moment = require("moment");
require("moment/locale/pt-br");

// Criar um novo horário
const criarHorario = async (req, res) => {
  try {
    const { profissionalId, diaSemana, inicio, fim, status } = req.body;
    console.log("Dados recebidos:", { profissionalId, diaSemana, inicio, fim, status });

    // Validações
    const diasValidos = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    if (!profissionalId || !diaSemana || !inicio || !fim) {
      return res.status(400).json({ error: "Todos os campos (profissionalId, diaSemana, inicio, fim) são obrigatórios!" });
    }
    if (!diasValidos.includes(diaSemana)) {
      return res.status(400).json({ error: `Dia da semana inválido! Recebido: ${diaSemana}` });
    }
    if (!moment(inicio, "HH:mm", true).isValid() || !moment(fim, "HH:mm", true).isValid()) {
      return res.status(400).json({ error: "Horários devem estar no formato HH:mm!" });
    }
    if (moment(inicio, "HH:mm").isSameOrAfter(moment(fim, "HH:mm"))) {
      return res.status(400).json({ error: "Horário de início deve ser anterior ao horário de fim!" });
    }

    // Verifica se o profissional existe
    const profissional = await Profissional.findByPk(profissionalId);
    if (!profissional) {
      return res.status(404).json({ error: "Profissional não encontrado!" });
    }

    // Obtém a matrícula do profissional
    const matriculaProfissional = profissional.matricula;
    if (!matriculaProfissional) {
      return res.status(400).json({ error: "O profissional não possui uma matrícula válida!" });
    }

    const novoHorario = await HorarioProfissional.create({
      matriculaProfissional, // Inclui o campo obrigatório
      diaSemana,
      inicio: moment(inicio, "HH:mm").format("HH:mm"),
      fim: moment(fim, "HH:mm").format("HH:mm"),
      status: status || "Ativo",
    });

    console.log("Horário criado:", novoHorario);
    res.status(201).json({
      ...novoHorario.dataValues,
      inicio: moment(novoHorario.inicio, "HH:mm").format("HH:mm"),
      fim: moment(novoHorario.fim, "HH:mm").format("HH:mm"),
    });
  } catch (error) {
    console.error("Erro ao criar horário:", error);
    res.status(500).json({ error: error.message });
  }
};

// Listar todos os horários
const lerHorarios = async (req, res) => {
  try {
    const horarios = await HorarioProfissional.findAll({
      order: [["diaSemana", "ASC"], ["inicio", "ASC"]],
    });

    const horariosFormatados = horarios.map((horario) => ({
      id: horario.id,
      profissionalId: horario.profissionalId,
      diaSemana: horario.diaSemana,
      inicio: moment.utc(horario.inicio, "HH:mm").local().format("HH:mm"),
      fim: moment.utc(horario.fim, "HH:mm").local().format("HH:mm"),
      status: horario.status,
      createdAt: horario.createdAt,
      updatedAt: horario.updatedAt,
      profissional: null,
      profissionalNome: `Profissional ID: ${horario.profissionalId}`,
    }));

    res.status(200).json(horariosFormatados);
  } catch (error) {
    console.error("Erro detalhado em lerHorarios:", error);
    res.status(500).json({ error: "Erro ao listar horários", details: error.message });
  }
};

// Consultar horário por ID
const lerHorarioId = async (req, res) => {
  try {
    const id = req.params.id;
    const horario = await HorarioProfissional.findByPk(id, {
      include: [
        {
          model: Profissional,
          attributes: ["matricula", "nome", "sobrenome"],
        },
      ],
    });

    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    const horarioFormatado = {
      id: horario.id,
      matriculaProfissional: horario.matriculaProfissional,
      diaSemana: horario.diaSemana,
      inicio: moment.utc(horario.inicio, "HH:mm").local().format("HH:mm"),
      fim: moment.utc(horario.fim, "HH:mm").local().format("HH:mm"),
      status: horario.status,
      createdAt: horario.createdAt,
      updatedAt: horario.updatedAt,
      profissionalNome: horario.Profissional
        ? `${horario.Profissional.nome} ${horario.Profissional.sobrenome}`
        : `Matrícula: ${horario.matriculaProfissional}`,
    };

    res.status(200).json(horarioFormatado);
  } catch (error) {
    console.error("Erro ao consultar horário:", error);
    res.status(500).json({ error: "Erro ao consultar horário", details: error.message });
  }
};

// Atualizar horário
const atualizarHorario = async (req, res) => {
  try {
    const id = req.params.id;
    const { profissionalId, diaSemana, inicio, fim, status } = req.body;

    const horario = await HorarioProfissional.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    // Validações
    const diasValidos = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    if (diaSemana && !diasValidos.includes(diaSemana)) {
      return res.status(400).json({ error: "Dia da semana inválido!" });
    }
    if ((inicio && !moment(inicio, "HH:mm", true).isValid()) || (fim && !moment(fim, "HH:mm", true).isValid())) {
      return res.status(400).json({ error: "Horários devem estar no formato HH:mm!" });
    }
    if (inicio && fim && moment(inicio, "HH:mm").isSameOrAfter(moment(fim, "HH:mm"))) {
      return res.status(400).json({ error: "Horário de início deve ser anterior ao horário de fim!" });
    }
    if (profissionalId) {
      const profissional = await Profissional.findByPk(profissionalId);
      if (!profissional) {
        return res.status(404).json({ error: "Profissional não encontrado!" });
      }
    }

    await horario.update({
      profissionalId: profissionalId || horario.profissionalId,
      diaSemana: diaSemana || horario.diaSemana,
      inicio: inicio || horario.inicio,
      fim: fim || horario.fim,
      status: status || horario.status,
    });

    res.status(200).json({ message: "Horário atualizado com sucesso!", horario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir horário
const excluirHorario = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Tentando excluir horário com ID:", id);
    const horario = await HorarioProfissional.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado" });
    }
    await horario.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir horário:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarHorario,
  lerHorarios,
  lerHorarioId,
  atualizarHorario,
  excluirHorario,
};