// jobs/lembreteConsultaJob.js

const cron = require("node-cron");
const { Op } = require("sequelize");
const { models } = require("../model"); // Importa todos os modelos inicializados
const { enviarEmailDeLembrete } = require("../services/emailServices");

const { Consulta, Paciente, Profissional, TipoConsulta } = models;

/**
 * Busca consultas que acontecerão em aproximadamente 12 horas e envia lembretes.
 */
const verificarEEnviarLembretes = async () => {
  console.log("Executando verificação de lembretes de consulta...");

  // 1. Define a janela de tempo: entre 12 e 13 horas a partir de agora
  const agora = new Date();
  const limiteInferior = new Date(agora.getTime() + 12 * 60 * 60 * 1000); // 12 horas a partir de agora
  const limiteSuperior = new Date(agora.getTime() + 13 * 60 * 60 * 1000); // 13 horas a partir de agora

  try {
    const consultasParaLembrar = await Consulta.findAll({
      where: {
        status: "agendada", // Apenas para consultas agendadas
        // Combina a data e a hora para uma verificação completa
        [Op.and]: [
          sequelize.where(
            sequelize.fn(
              "CONCAT",
              sequelize.col("dataConsulta"),
              " ",
              sequelize.col("horaConsulta")
            ),
            {
              [Op.between]: [limiteInferior, limiteSuperior],
            }
          ),
        ],
        lembreteEnviado: false, // Campo opcional para não enviar duas vezes
      },
      include: [
        { model: Paciente, as: "paciente", attributes: ["nome", "email"] },
        { model: Profissional, as: "medico", attributes: ["nome"] },
        {
          model: TipoConsulta,
          as: "tipoConsulta",
          attributes: ["nomeTipoConsulta"],
        },
      ],
    });

    if (consultasParaLembrar.length === 0) {
      console.log("Nenhuma consulta para lembrar neste ciclo.");
      return;
    }

    console.log(
      `Encontradas ${consultasParaLembrar.length} consultas para enviar lembrete.`
    );

    for (const consulta of consultasParaLembrar) {
      await enviarEmailDeLembrete(consulta);
      // Opcional: Marcar que o lembrete foi enviado para não enviar de novo
      // await consulta.update({ lembreteEnviado: true });
    }
  } catch (error) {
    console.error("Erro ao executar o job de lembretes:", error);
  }
};

/**
 * Inicia o job para rodar a cada hora.
 * O padrão '0 * * * *' significa "no minuto 0 de cada hora".
 */
const initLembreteJob = () => {
  cron.schedule("0 * * * *", verificarEEnviarLembretes, {
    scheduled: true,
    timezone: "America/Sao_Paulo",
  });

  console.log(
    "-> Job de lembrete de consultas agendado para rodar a cada hora."
  );
};

module.exports = { initLembreteJob };
