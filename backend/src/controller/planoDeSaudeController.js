const planoDeSaude = require("../model/planoDeSaude");

// Recomendação: Adicionar índices no modelo para melhorar performance
// Exemplo:
// const planoDeSaude = sequelize.define('PlanoDeSaude', {
//   // ... campos ...
// }, {
//   indexes: [
//     { fields: ['nomeOperadora'] },
//     { fields: ['tipoPlano'] },
//     { fields: ['idPlanoSaude'] }
//   ]
// });

const criarPlanoDeSaude = async (req, res) => {
  try {
    const dados = req.body;
    const resultado = Array.isArray(dados)
      ? await planoDeSaude.bulkCreate(dados)
      : await planoDeSaude.create(dados);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Erro ao criar plano de saúde:", error); // Log para diagnóstico
    res.status(400).json({ error: error.message });
  }
};

const lerPlanoDeSaude = async (req, res) => {
  try {
    const plano = await planoDeSaude.findAll();
    res.status(200).json(plano);
  } catch (error) {
    console.error("Erro ao ler planos de saúde:", error); // Log para diagnóstico
    res.status(500).json({ error: error.message });
  }
};

const lerPlanoDeSaudeId = async (req, res) => {
  try {
    const id = req.params.id;
    const planoSaudeEncontrado = await planoDeSaude.findByPk(id);

    if (planoSaudeEncontrado) {
      res.status(200).json(planoSaudeEncontrado);
    } else {
      res.status(404).json({ message: "Plano de Saúde não encontrado!" });
    }
  } catch (error) {
    console.error("Erro em lerPlanoDeSaudeId:", error);
    res.status(500).json({
      error: error.message,
      detail: "Erro interno ao processar a solicitação do plano de saúde.",
    });
  }
};

const atualizarPlanoDeSaude = async (req, res) => {
  try {
    const idPlanoDeSaude = req.params.id;
    const dadosAtualizados = req.body;

    const plano = await planoDeSaude.findByPk(idPlanoDeSaude);
    if (!plano) {
      return res
        .status(404)
        .json({ message: "Plano de Saúde não encontrado!" });
    }

    await planoDeSaude.update(dadosAtualizados, {
      where: { idPlanoSaude: idPlanoDeSaude },
    });

    const planoAtualizado = await planoDeSaude.findByPk(idPlanoDeSaude);
    res.status(200).json({
      message: "Plano de Saúde atualizado com sucesso!",
      plano: planoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar plano de saúde:", error); // Log para diagnóstico
    res.status(500).json({ error: error.message });
  }
};

const excluirPlanoDeSaude = async (req, res) => {
  try {
    const idPlanoDeSaude = req.params.id;
    const plano = await planoDeSaude.findByPk(idPlanoDeSaude);
    if (!plano) {
      return res
        .status(404)
        .json({ message: "Plano de Saúde não encontrado!" });
    }
    await plano.destroy();
    res.status(200).json({ message: "Plano de Saúde excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir plano de saúde:", error); // Log para diagnóstico
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