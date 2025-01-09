const planoDeSaude = require("../model/planoDeSaudeModel");
const moment = require("moment");

const criarPlanoDeSaude = async (req, res) => {
  try {
    // Criação de um novo plano de saúde
    const novoPlanoDeSaude = await planoDeSaude.create(req.body);
    res.status(201).json(novoPlanoDeSaude);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerPlanoDeSaude = async (req, res) => {
  try {
    // Obter todos os planos de saúde
    const plano = await planoDeSaude.findAll({
      order: [['nomePlanoDeSaude', 'ASC'], ['descricao', 'ASC']],
    });

    const planoData = plano.map((p) => ({
      ...p.dataValues,
      dataInicio: moment.utc(p.dataInicio).add(1, "day").local().format("L"),
      dataFim: moment.utc(p.dataFim).add(1, "day").local().format("L"),
    }));
    res.status(200).json(planoData); // Retorna a lista de planos de saúde
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerPlanoDeSaudeId = async (req, res) => {
  try {
    const id = req.params.id; // Captura o ID da requisição
    const planoSaude = await planoDeSaude.findByPk(id); // Busca pelo plano de saúde com o ID

    const planoData = {
      ...planoSaude.dataValues,
      dataInicio: moment
        .utc(planoSaude.dataInicio)
        .add(1, "day")
        .local()
        .format("L"),
      dataFim: moment.utc(planoSaude.dataFim).add(1, "day").local().format("L"),
    };

    if (planoData)
      res.status(200).json(planoData); // Retorna o plano de saúde encontrado
    else {
      res.status(404).json({ message: "Plano de Saúde não encontrado!" }); // Caso não encontre o plano
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarPlanoDeSaude = async (req, res) => {
  try {
    const idPlanoDeSaude = req.params.id; // Captura o ID da requisição
    const dadosAtualizados = req.body; // Obtém os dados paa atualização

    const plano = await planoDeSaude.findByPk(idPlanoDeSaude); // Busca o plano de saúde pelo ID
    if (!plano) {
      return res
        .status(404)
        .json({ message: "Plano de Saúde não encontrado!" }); // Caso não encontre o plano
    }

    await planoDeSaude.update(dadosAtualizados, {
      where: { idPlanoDeSaude },
    }); // Atualiza o plano de saúde
    res.status(200).json({
      message: "Plano de Saúde atualizado com sucesso!",
      plano,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirPlanoDeSaude = async (req, res) => {
  try {
    const idPlanoDeSaude = req.params.id; // Captura o ID da requisição
    const plano = await planoDeSaude.findByPk(idPlanoDeSaude); // Busca o plano de saúde pelo ID
    if (!plano) {
      return res
        .status(404)
        .json({ message: "Plano de Saúde não encontrado!" }); // Caso não encontre o plano
    }

    await plano.destroy(); // Exclui o plano de saúde
    res.status(200).json({ message: "Plano de Saúde excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarPlanoDeSaude,
  lerPlanoDeSaude,
  lerPlanoDeSaudeId,
  atualizarPlanoDeSaude,
  excluirPlanoDeSaude,
};
