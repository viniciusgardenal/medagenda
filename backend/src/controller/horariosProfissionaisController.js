const { models } = require("../model/index");
const HorarioProfissional = models.HorarioProfissional;
const Profissional = models.Profissional;
const moment = require("moment");
require("moment/locale/pt-br");

// Criar um novo horário
const criarHorario = async (req, res) => {
  try {
    const {
      matriculaProfissional,
      diaSemana,
      inicio,
      fim,
      intervaloInicio,
      intervaloFim,
      status,
    } = req.body;
    console.log("Dados recebidos:", {
      matriculaProfissional,
      diaSemana,
      inicio,
      fim,
      intervaloInicio,
      intervaloFim,
      status,
    });

    // Validações
    const diasValidos = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];
    if (!matriculaProfissional || !diaSemana || !inicio || !fim) {
      return res.status(400).json({
        error:
          "Todos os campos (matriculaProfissional, diaSemana, inicio, fim) são obrigatórios!",
      });
    }
    if (!diasValidos.includes(diaSemana)) {
      return res
        .status(400)
        .json({ error: `Dia da semana inválido! Recebido: ${diaSemana}` });
    }
    if (
      !moment(inicio, "HH:mm", true).isValid() ||
      !moment(fim, "HH:mm", true).isValid()
    ) {
      return res
        .status(400)
        .json({ error: "Horários devem estar no formato HH:mm!" });
    }
    if (moment(inicio, "HH:mm").isSameOrAfter(moment(fim, "HH:mm"))) {
      return res.status(400).json({
        error: "Horário de início deve ser anterior ao horário de fim!",
      });
    }
    // Validações para intervalo (se fornecidos)
    if (intervaloInicio && intervaloFim) {
      if (
        !moment(intervaloInicio, "HH:mm", true).isValid() ||
        !moment(intervaloFim, "HH:mm", true).isValid()
      ) {
        return res.status(400).json({
          error: "Intervalos devem estar no formato HH:mm!",
        });
      }
      if (
        moment(intervaloInicio, "HH:mm").isSameOrAfter(
          moment(intervaloFim, "HH:mm")
        )
      ) {
        return res.status(400).json({
          error: "Intervalo de início deve ser anterior ao intervalo de fim!",
        });
      }
      if (
        moment(intervaloInicio, "HH:mm").isBefore(moment(inicio, "HH:mm")) ||
        moment(intervaloFim, "HH:mm").isAfter(moment(fim, "HH:mm"))
      ) {
        return res.status(400).json({
          error: "Intervalo deve estar dentro do período de início e fim!",
        });
      }
    }

    // Verifica se o profissional existe
    const profissional = await Profissional.findByPk(matriculaProfissional);
    if (!profissional) {
      return res.status(404).json({ error: "Profissional não encontrado!" });
    }

    // Obtém a matrícula do profissional
    const imatriculaProfissional = profissional.matricula;
    if (!imatriculaProfissional) {
      return res
        .status(400)
        .json({ error: "O profissional não possui uma matrícula válida!" });
    }

    const novoHorario = await HorarioProfissional.create({
      matriculaProfissional: imatriculaProfissional,
      diaSemana,
      inicio: moment(inicio, "HH:mm").format("HH:mm"),
      fim: moment(fim, "HH:mm").format("HH:mm"),
      intervaloInicio: intervaloInicio
        ? moment(intervaloInicio, "HH:mm").format("HH:mm")
        : null,
      intervaloFim: intervaloFim
        ? moment(intervaloFim, "HH:mm").format("HH:mm")
        : null,
      status: status || "Ativo",
    });

    console.log("Horário criado:", novoHorario);
    res.status(201).json({
      ...novoHorario.dataValues,
      inicio: moment(novoHorario.inicio, "HH:mm").format("HH:mm"),
      fim: moment(novoHorario.fim, "HH:mm").format("HH:mm"),
      intervaloInicio: novoHorario.intervaloInicio
        ? moment(novoHorario.intervaloInicio, "HH:mm").format("HH:mm")
        : null,
      intervaloFim: novoHorario.intervaloFim
        ? moment(novoHorario.intervaloFim, "HH:mm").format("HH:mm")
        : null,
    });
  } catch (error) {
    console.error("Erro ao criar horário:", error);
    res.status(500).json({ error: error.message });
  }
};


const lerHorarios = async (req, res) => {
  try {
    const horarios = await HorarioProfissional.findAll({
      order: [
        ["diaSemana", "ASC"],
        ["inicio", "ASC"],
      ],
    });

    const horariosFormatados = horarios.map((horario) => ({
      id: horario.id,
      matriculaProfissional: horario.matriculaProfissional,
      diaSemana: horario.diaSemana,
      inicio: horario.inicio,          // Retorna como string HH:mm
      fim: horario.fim,                // Retorna como string HH:mm
      intervaloInicio: horario.intervaloInicio,  // Retorna como string HH:mm ou null
      intervaloFim: horario.intervaloFim,        // Retorna como string HH:mm ou null
      status: horario.status,
      createdAt: horario.createdAt,
      updatedAt: horario.updatedAt,
      profissionalNome: `Profissional ID: ${horario.matriculaProfissional}`,
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
      inicio: horario.inicio,          // Retorna como string HH:mm
      fim: horario.fim,                // Retorna como string HH:mm
      intervaloInicio: horario.intervaloInicio,  // Retorna como string HH:mm ou null
      intervaloFim: horario.intervaloFim,        // Retorna como string HH:mm ou null
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
    const {
      matriculaProfissional,
      diaSemana,
      inicio,
      fim,
      intervaloInicio,
      intervaloFim,
      status,
    } = req.body;

    const horario = await HorarioProfissional.findByPk(id);
    if (!horario) {
      return res.status(404).json({ error: "Horário não encontrado!" });
    }

    // Validações
    const diasValidos = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];
    if (diaSemana && !diasValidos.includes(diaSemana)) {
      return res.status(400).json({ error: "Dia da semana inválido!" });
    }
    if (
      (inicio && !moment(inicio, "HH:mm", true).isValid()) ||
      (fim && !moment(fim, "HH:mm", true).isValid())
    ) {
      return res
        .status(400)
        .json({ error: "Horários devem estar no formato HH:mm!" });
    }
    if (
      inicio &&
      fim &&
      moment(inicio, "HH:mm").isSameOrAfter(moment(fim, "HH:mm"))
    ) {
      return res.status(400).json({
        error: "Horário de início deve ser anterior ao horário de fim!",
      });
    }
    // Validações para intervalo (se fornecidos)
    if (intervaloInicio && intervaloFim) {
      if (
        !moment(intervaloInicio, "HH:mm", true).isValid() ||
        !moment(intervaloFim, "HH:mm", true).isValid()
      ) {
        return res.status(400).json({
          error: "Intervalos devem estar no formato HH:mm!",
        });
      }
      if (
        moment(intervaloInicio, "HH:mm").isSameOrAfter(
          moment(intervaloFim, "HH:mm")
        )
      ) {
        return res.status(400).json({
          error: "Intervalo de início deve ser anterior ao intervalo de fim!",
        });
      }
      if (
        moment(intervaloInicio, "HH:mm").isBefore(
          moment(inicio || horario.inicio, "HH:mm")
        ) ||
        moment(intervaloFim, "HH:mm").isAfter(
          moment(fim || horario.fim, "HH:mm")
        )
      ) {
        return res.status(400).json({
          error: "Intervalo deve estar dentro do período de início e fim!",
        });
      }
    }
    if (matriculaProfissional) {
      const profissional = await Profissional.findByPk(matriculaProfissional);
      if (!profissional) {
        return res.status(404).json({ error: "Profissional não encontrado!" });
      }
    }

    await horario.update({
      matriculaProfissional:
        matriculaProfissional || horario.matriculaProfissional,
      diaSemana: diaSemana || horario.diaSemana,
      inicio: inicio || horario.inicio,
      fim: fim || horario.fim,
      intervaloInicio:
        intervaloInicio !== undefined
          ? intervaloInicio
          : horario.intervaloInicio,
      intervaloFim:
        intervaloFim !== undefined ? intervaloFim : horario.intervaloFim,
      status: status || horario.status,
    });

    res
      .status(200)
      .json({ message: "Horário atualizado com sucesso!", horario });
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
