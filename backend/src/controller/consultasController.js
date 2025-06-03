const Consulta = require("../model/consulta");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const CheckIn = require("../model/checkin");
const TipoConsulta = require("../model/tipoConsulta");
const RegistroObitos = require("../model/registroObitos");
const HorarioProfissional = require("../model/horariosProfissionais");
const { Op } = require("sequelize");
const sequelize = require("../config/db");

// Função auxiliar para tratamento de erros
const handleError = (res, status, message, error) => {
  console.error(message, error);
  res
    .status(status)
    .json({ status: "error", error: message, details: error?.message || "" });
};

// Função para converter data em dia da semana (ex: "domingo", "segunda-feira")
const getDayOfWeek = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`); // Adiciona T00:00:00 para evitar problemas de fuso horário
  const days = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  return days[date.getDay()];
};

const criarConsulta = async (req, res) => {
  console.log("Criando consulta", req.body);

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
    } = req.body;

    // 1. Validação dos dados de entrada (continua igual)
    if (!cpfPaciente || !medicoId /* ... etc ... */) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // 2. Verificações sequenciais no banco (MAIS LENTO)
    const paciente = await Paciente.findByPk(cpfPaciente);
    if (!paciente)
      return res.status(404).json({ error: "Paciente não encontrado." });

    const obito = await RegistroObitos.findOne({
      where: { cpfPaciente: cpfPaciente },
    });
    if (obito) return res.status(400).json({ error: "Paciente falecido." });

    const medico = await Profissional.findByPk(medicoId);
    if (!medico)
      return res.status(404).json({ error: "Médico não encontrado." });

    const tipoConsulta = await TipoConsulta.findByPk(idTipoConsulta);
    if (!tipoConsulta)
      return res
        .status(404)
        .json({ error: "Tipo de consulta não encontrado." });

    // 3. Verificação de conflito (INSEGURO SEM TRANSAÇÃO)
    const consultaExistente = await Consulta.findOne({
      where: {
        medicoId,
        dataConsulta,
        horaConsulta,
        status: { [Op.ne]: "cancelada" },
      },
    });
    if (consultaExistente) {
      return res.status(409).json({ error: "Horário indisponível." });
    }

    // 4. Criação da consulta
    const novaConsulta = await Consulta.create({
      cpfPaciente,
      medicoId,
      idTipoConsulta,
      dataConsulta,
      horaConsulta,
      prioridade,
      motivo,
      responsavelAgendamento,
      status: "agendada",
    });

    res.status(201).json({ status: "success", data: novaConsulta });
  } catch (error) {
    // O catch agora só pega erros inesperados, mas não pode "desfazer" a criação da consulta
    console.error("ERRO AO CRIAR CONSULTA:", error);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
  }
};

const listarConsultasDoDia = async (req, res) => {
  try {
    const data = req.params.data || new Date().toISOString().split("T")[0];
    const { status } = req.query;

    const whereClause = { dataConsulta: data };
    if (status) {
      whereClause.status = status;
    }
    if (req.user.role === "medico") {
      whereClause.medicoId = req.user.id;
    }

    const consultas = await Consulta.findAll({
      where: whereClause,
      // --- INÍCIO DA CORREÇÃO ---
      // O 'include' diz ao Sequelize para fazer um JOIN e trazer os dados das tabelas associadas.
      include: [
        {
          model: Paciente,
          as: "paciente", // 'as' deve corresponder ao apelido na sua associação
        },
        {
          model: Profissional,
          as: "medico",
        },
        {
          model: TipoConsulta,
          as: "tipoConsulta",
        },
        {
          model: CheckIn,
          as: "checkin",
        },
      ],
      // --- FIM DA CORREÇÃO ---
      order: [
        ["prioridade", "DESC"],
        ["horaConsulta", "ASC"],
      ],
    });

    res.status(200).json(consultas);
  } catch (error) {
    handleError(res, 500, "Erro ao listar consultas do dia", error);
  }
};

const listarConsultas = async (req, res) => {
  try {
    const whereClause = {};
    if (req.user.role === "medico") {
      whereClause.medicoId = req.user.id;
    }

    const consultas = await Consulta.findAll({
      where: {
        status: {
          // Busca consultas prontas para atendimento ou já atendidas
          [Op.or]: ["checkin_realizado"],
        },
      },
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
          model: TipoConsulta,
          as: "tipoConsulta",
        },
        {
          model: CheckIn,
          as: "checkin",
        },
      ],
      order: [
        ["dataConsulta", "DESC"],
        ["horaConsulta", "ASC"],
      ],
    });

    res.status(200).json(consultas);
  } catch (error) {
    handleError(res, 500, "Erro ao listar consultas", error);
  }
};

const getHorariosDisponiveis = async (req, res) => {
  try {
    const { medicoId, dataConsulta: dataConsultaParam } = req.params; // ex: dataConsultaParam = "2025-05-30"
    const DURACAO_CONSULTA_MINUTOS = 60;

    const diaSemana = getDayOfWeek(dataConsultaParam);

    const regraHorario = await HorarioProfissional.findOne({
      where: {
        matriculaProfissional: medicoId,
        diaSemana: diaSemana,
        status: "Ativo",
      },
    });

    if (!regraHorario) {
      return res.status(200).json({
        status: "success",
        data: [],
        message:
          "Profissional não possui horário de trabalho para este dia da semana.",
      });
    }

    const horariosPossiveis = [];
    const { inicio, fim, intervaloInicio, intervaloFim } = regraHorario;

    let slotAtual = new Date(`${dataConsultaParam}T${inicio}`);
    const horarioFimDt = new Date(`${dataConsultaParam}T${fim}`);

    while (slotAtual < horarioFimDt) {
      const horaFormatada = slotAtual.toTimeString().slice(0, 5);
      horariosPossiveis.push(horaFormatada);
      slotAtual.setMinutes(slotAtual.getMinutes() + DURACAO_CONSULTA_MINUTOS);
    }

    let slotsValidos = horariosPossiveis;
    if (intervaloInicio && intervaloFim) {
      slotsValidos = horariosPossiveis.filter((hora) => {
        return hora < intervaloInicio || hora >= intervaloFim;
      });
    }

    // --- INÍCIO DA NOVA LÓGICA DE FILTRO POR HORA ATUAL ---
    const agora = new Date();
    const hojeString = agora.toISOString().split("T")[0]; // Data de hoje no formato YYYY-MM-DD

    // Verifica se a data da consulta é o dia de hoje
    if (dataConsultaParam === hojeString) {
      // Filtra os slots para incluir apenas horários futuros
      slotsValidos = slotsValidos.filter((horaSlot) => {
        // Cria objetos Date para comparação precisa
        const dataHoraSlot = new Date(`${dataConsultaParam}T${horaSlot}:00`);
        // Compara o horário do slot com a hora atual
        // O slot deve ser pelo menos alguns minutos no futuro para ser útil,
        // ou pode ser >= agora se você permitir agendamentos imediatos.
        // Vamos considerar que o slot deve começar APÓS a hora atual.
        return dataHoraSlot > agora;
      });
    }
    // --- FIM DA NOVA LÓGICA DE FILTRO POR HORA ATUAL ---

    const consultasAgendadas = await Consulta.findAll({
      where: {
        medicoId,
        dataConsulta: dataConsultaParam, // Usar a dataParam aqui
        status: { [Op.ne]: "cancelada" },
      },
      attributes: ["horaConsulta"],
    });

    const horariosOcupados = consultasAgendadas.map((c) => c.horaConsulta);

    const horariosDisponiveis = slotsValidos.filter(
      (h) => !horariosOcupados.includes(h)
    );

    res.status(200).json({ status: "success", data: horariosDisponiveis });
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    res.status(500).json({
      status: "error",
      message: "Erro interno ao buscar horários disponíveis.",
    });
  }
};

const cancelarConsulta = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { motivoCancelamento } = req.body;

    // Validar motivo
    if (!motivoCancelamento) {
      await transaction.rollback();
      return handleError(res, 400, "Motivo do cancelamento é obrigatório");
    }

    const consulta = await Consulta.findByPk(id, { transaction });
    if (!consulta) {
      await transaction.rollback();
      return handleError(res, 404, "Consulta não encontrada");
    }

    // Verificar status e permissões
    if (
      consulta.status !== "agendada" &&
      consulta.status !== "checkin_realizado"
    ) {
      await transaction.rollback();
      return handleError(
        res,
        400,
        "Consulta não está agendada ou com check-in realizado"
      );
    }
    if (
      consulta.status === "checkin_realizado" &&
      req.user.id !== consulta.medicoId
    ) {
      await transaction.rollback();
      return handleError(
        res,
        403,
        "Apenas o médico responsável pode cancelar após check-in"
      );
    }

    // Atualizar status
    consulta.status = "cancelada";
    consulta.motivoCancelamento = motivoCancelamento;
    await consulta.save({ transaction });

    // Buscar consulta completa
    const consultaCompleta = await Consulta.findByPk(id, {
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
          model: TipoConsulta,
          as: "tipoConsulta",
          attributes: ["idTipoConsulta", "nomeTipoConsulta"],
        },
        { model: CheckIn, as: "checkin" },
      ],
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ status: "success", data: consultaCompleta });
  } catch (error) {
    await transaction.rollback();
    handleError(res, 500, "Erro ao cancelar consulta", error);
  }
};

module.exports = {
  criarConsulta,
  listarConsultasDoDia,
  listarConsultas,
  getHorariosDisponiveis,
  cancelarConsulta,
};
