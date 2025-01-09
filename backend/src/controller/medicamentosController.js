const Medicamento = require("../model/medicamentos.js");

const cadastrarMedicamento = async (req, res) => {
  try {
    const novoMedicamento = await Medicamento.create(req.body);
    res.status(201).json(novoMedicamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      order: [['nomeMedicamento', 'ASC'], ['descricao', 'ASC']],
    });
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerMedicamentosId = async (req, res) => {
  try {
    const id = req.params.id;
    const medicamento = await Medicamento.findByPk(id);

    if (medicamento) res.status(200).json(medicamento);
    else res.status(404).json({ message: "Medicamento não encontrado!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMedicamentos = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizado = req.body;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento)
      return res.status(404).json({ message: "Medicamento não encontrado!" });

    await medicamento.update(dadosAtualizado);
    res
      .status(200)
      .json({ message: "Medicamento atualizado com sucesso!", medicamento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirMedicamentos = async (req, res) => {
  try {
    const id = req.params.id;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento)
      res.status(404).json({ message: "Medicamento não encontrado!" });

    await medicamento.destroy();
    res.status(200).json({ message: "Medicamento excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  cadastrarMedicamento,
  lerMedicamentos,
  lerMedicamentosId,
  updateMedicamentos,
  excluirMedicamentos,
};
