const HorarioProfissional = require("../model/horariosProfissionais"); // Ajustado para o novo nome
const Profissional = require("../model/profissionais");
const moment = require("moment");
require("moment/locale/pt-br");

// Criar um novo horário
const criarHorario = async (req, res) => {
    try {
      const { profissionalId, diaSemana, inicio, fim, status } = req.body;
  
      // Validações
      const diasValidos = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
      if (!profissionalId || !diaSemana || !inicio || !fim) {
        return res.status(400).json({ error: "Todos os campos (profissionalId, diaSemana, inicio, fim) são obrigatórios!" });
      }
      if (!diasValidos.includes(diaSemana)) {
        return res.status(400).json({ error: "Dia da semana inválido!" });
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
  
      const novoHorario = await HorarioProfissional.create({
        profissionalId,
        diaSemana,
        inicio,
        fim,
        status: status || "Ativo",
      });
  
      res.status(201).json(novoHorario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Listar todos os horários
const lerHorarios = async (req, res) => {
  try {
    const horarios = await HorarioProfissional.findAll({
      include: [{
        model: Profissional,
        attributes: ["id", "nome", "sobrenome"], // Inclui dados do profissional
      }],
      order: [["diaSemana", "ASC"], ["inicio", "ASC"]],
    });

    const horariosFormatados = horarios.map((horario) => ({
      ...horario.dataValues,
      profissionalNome: `${horario.Profissional.nome} ${horario.Profissional.sobrenome}`,
      inicio: moment.utc(horario.inicio, "HH:mm").local().format("HH:mm"),
      fim: moment.utc(horario.fim, "HH:mm").local().format("HH:mm"),
    }));

    res.status(200).json(horariosFormatados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Consultar horário por ID
const lerHorarioId = async (req, res) => {
  try {
    const id = req.params.id;
    const horario = await HorarioProfissional.findByPk(id, {
      include: [{
        model: Profissional,
        attributes: ["id", "nome", "sobrenome"],
      }],
    });

    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    const horarioFormatado = {
      ...horario.dataValues,
      profissionalNome: `${horario.Profissional.nome} ${horario.Profissional.sobrenome}`,
      inicio: moment.utc(horario.inicio, "HH:mm").local().format("HH:mm"),
      fim: moment.utc(horario.fim, "HH:mm").local().format("HH:mm"),
    };

    res.status(200).json(horarioFormatado);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const id = req.params.id;

    const horario = await HorarioProfissional.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    await horario.destroy();
    res.status(200).json({ message: "Horário excluído com sucesso!" });
  } catch (error) {
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