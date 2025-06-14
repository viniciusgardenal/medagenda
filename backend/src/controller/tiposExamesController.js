const { models } = require("../model/index");
const tiposExames = models.TiposExames;

const criarTiposExame = async (req, res) => {
  try {
    const dados = req.body;

    let resultado;
    if (Array.isArray(dados)) {
      // Se for um array, cria múltiplos tipos de exame
      resultado = await tiposExames.bulkCreate(dados);
    } else {
      // Se for um único objeto, cria apenas um tipo de exame
      resultado = await tiposExames.create(dados);
    }

    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerTiposExame = async (req, res) => {
  try {
    const TiposExames = await tiposExames.findAll({
      order: [["nomeTipoExame", "ASC"]],
    });
    res.status(200).send(TiposExames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerTiposExameId = async (req, res) => {
  try {
    const id = req.params.id;
    const TiposExame = await tiposExames.findByPk(id);
    if (TiposExame) res.status(200).json(TiposExame);
    else res.status(404).json({ message: "Exame não encontrado!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarTiposExame = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;

    const TiposExame = await tiposExames.findByPk(id);
    if (!TiposExame)
      return res.status(404).json({ message: "Exame não encontrado!" });
    await TiposExame.update(dadosAtualizados);
    res
      .status(200)
      .json({ message: "Exame atualizado com sucesso!", TiposExame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirTiposExame = async (req, res) => {
  try {
    const id = req.params.id;
    const TiposExame = await tiposExames.findByPk(id);
    if (!TiposExame)
      return res.status(404).json({ message: "Exame não encontrado!" });
    await TiposExame.destroy();
    res.status(200).json({ message: "Exame excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarTiposExame,
  lerTiposExame,
  lerTiposExameId,
  atualizarTiposExame,
  excluirTiposExame,
};
