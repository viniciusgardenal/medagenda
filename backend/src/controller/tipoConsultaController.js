const tipoConsulta = require("../model/tipoConsultaModel");
const moment = require("moment");
require("moment/locale/pt-br"); // Para definir o locale em português

const criarTipoConsulta = async (req, res) => {
  try {
    const novoTipoConsulta = await tipoConsulta.create(req.body);
    res.status(201).json(novoTipoConsulta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerTipoConsulta = async (req, res) => {
  try {
    //console.log("Back chegou aqui ?");

    const tpc = await tipoConsulta.findAll({
      order: [["nomeTipoConsulta", "ASC"], ['descricao', 'ASC']],
    });

    const tiposConsultaFormatados = tpc.map((tpc) => ({
      ...tpc.dataValues,
      dataCriacao: moment
        .utc(tpc.dataCriacao)
        .add(1, "day")
        .local()
        .format("L"),
    }));
    res.status(200).json(tiposConsultaFormatados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerTipoConsultaId = async (req, res) => {
  try {
    const id = req.params.id;
    const tipoConsultaEncontrado = await tipoConsulta.findByPk(id);

    const tipoConsultaFormatado = {
      ...tipoConsultaEncontrado.toJSON(),
      dataCriacao: moment
        .utc(tipoConsultaEncontrado.dataCriacao)
        .add(1, "day")
        .local()
        .format("L"),
    };

    if (tipoConsultaFormatado) {
      res.status(200).json(tipoConsultaFormatado);
    } else {
      res.status(404).json({ message: "Tipo de consulta não encontrado!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const atualizarTipoConsulta = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;

    const tipoConsultaEncontrado = await tipoConsulta.findByPk(id);
    if (!tipoConsultaEncontrado) {
      return res
        .status(404)
        .json({ message: "Tipo de consulta não encontrado!" });
    }

    await tipoConsultaEncontrado.update(dadosAtualizados);
    res.status(200).json({
      message: "Tipo de consulta atualizado com sucesso!",
      tipoConsulta: tipoConsultaEncontrado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirTipoConsulta = async (req, res) => {
  try {
    const id = req.params.id;
    const tipoConsultaEncontrado = await tipoConsulta.findByPk(id);
    if (!tipoConsultaEncontrado) {
      return res
        .status(404)
        .json({ message: "Tipo de consulta não encontrado!" });
    }

    await tipoConsultaEncontrado.destroy();
    res.status(200).json({ message: "Tipo de consulta excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarTipoConsulta,
  lerTipoConsulta,
  lerTipoConsultaId,
  atualizarTipoConsulta,
  excluirTipoConsulta,
};
