const solicitacaoExames = require("../model/solicitacaoExames");

const criarSolicitacaoExames = async (req, res) => {
  try {
    const novoExame = await solicitacaoExames.create(req.body);
    res.status(201).json(novoExame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerSolicitacaoExames = async (req, res) => {
  try {
    const tse = await solicitacaoExames.findAll({
      include: [{ model: paciente }],
    });
    res.status(200).send(tse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerSolicitacaoExamesId = async (req, res) => {
  try {
    const id = req.params.id;
    const exame = await solicitacaoExames.findByPk(id);

    if (exame) res.status(200).json(exame);
    else res.status(404).json({ message: "Exame não encontrado!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarSolicitacaoExames = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const exame = await solicitacaoExames.findByPk(id);
    if (!exame)
      return res.status(404).json({ message: "Exame não encontrado!" });
    await exame.update(dadosAtualizados);
    res.status(200).json({ message: "Exame atualizado com sucesso!", exame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirSolicitacaoExames = async (req, res) => {
  try {
    const id = req.params.id;
    const exame = await solicitacaoExames.findByPk(id);
    if (!exame)
      return res.status(404).json({ message: "Exame não encontrado!" });
    await exame.destroy();
    res.status(200).json({ message: "Exame excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarSolicitacaoExames,
  lerSolicitacaoExames,
  lerSolicitacaoExamesId,
  atualizarSolicitacaoExames,
  excluirSolicitacaoExames,
};
