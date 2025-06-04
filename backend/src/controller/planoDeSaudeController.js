const planoDeSaude = require("../model/planoDeSaude"); // Importa o modelo de plano de saúde

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
    const plano = await planoDeSaude.findAll();

    res.status(200).json(plano); // Retorna a lista de planos de saúde
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerPlanoDeSaudeId = async (req, res) => {
  try {
    const id = req.params.id; // Captura o ID da requisição
    const planoSaudeEncontrado = await planoDeSaude.findByPk(id); // Busca pelo plano de saúde com o ID

    if (planoSaudeEncontrado) { // VERIFICAÇÃO PRIMEIRO
      const planoData = {
        ...planoSaudeEncontrado.dataValues,
        // Formata as datas apenas se existirem, para evitar erros com datas nulas
        dataInicio: planoSaudeEncontrado.dataInicio 
          ? moment
              .utc(planoSaudeEncontrado.dataInicio)
              .add(1, "day") // A lógica de adicionar 1 dia pode precisar de revisão dependendo do fuso horário e armazenamento
              .local()
              .format("L") 
          : null, // Ou undefined, ou string vazia, conforme a necessidade do frontend
        dataFim: planoSaudeEncontrado.dataFim
          ? moment
              .utc(planoSaudeEncontrado.dataFim)
              .add(1, "day") // A lógica de adicionar 1 dia pode precisar de revisão
              .local()
              .format("L")
          : null,
      };
      res.status(200).json(planoData); // Retorna o plano de saúde encontrado
    } else {
      res.status(404).json({ message: "Plano de Saúde não encontrado!" }); // Caso não encontre o plano
    }
  } catch (error) {
    console.error("Erro em lerPlanoDeSaudeId:", error); // É bom logar o erro no servidor também
    res.status(500).json({ error: error.message, detail: "Erro interno ao processar a solicitação do plano de saúde." });
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
