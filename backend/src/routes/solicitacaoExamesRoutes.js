const express = require("express");
const { models } = require("../model/index");
const TiposExame = models.TiposExames;
const Paciente = models.Paciente;
const Profissional = models.Profissional;
const RegistroResultadoExames = models.RegistroResultadoExames;
const SolicitacaoExames = models.SolicitacaoExames;
const router = express.Router();
const moment = require("moment");

// Rota para buscar solicitacaoExames
router.get("/solicitacaoExames", async (req, res) => {
  try {
    const exames = await SolicitacaoExames.findAll({
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "profissional" },
        { model: TiposExame, as: "tipoExame" },
      ],
      where: {
        status: "Ativo", // Busca apenas os registros com status inativo
      },
    });

    examesFormatados = exames.map((e) => ({
      ...e.dataValues,
      dataSolicitacao: moment
        .utc(e.createdAt)
        .add(1, "day")
        .local()
        .format("L"),
      dataRetorno: moment.utc(e.dataRetorno).add(1, "day").local().format("L"),
    }));

    console.log(examesFormatados);

    res.status(200).json(examesFormatados);
  } catch (error) {
    console.error("Erro ao buscar exames:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    const exames = await SolicitacaoExames.findByPk(idSolicitacaoExame, {
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: ["cpf", "nome", "sobrenome"], // Campos do paciente
        },
        {
          model: Profissional,
          as: "profissional",
          attributes: ["matricula", "nome", "tipoProfissional", "crm"], // Campos do paciente
        },
        {
          model: TiposExame,
          as: "tipoExame",
          attributes: ["idTipoExame", "nomeTipoExame"], // Campos do tipo de exame
        },
      ],
    });

    const examesFormatados = {
      ...exames.dataValues,
      dataSolicitacao: moment
        .utc(exames.createdAt)
        .add(1, "day")
        .local()
        .format("L"),
      dataRetorno: moment
        .utc(exames.dataRetorno)
        .add(1, "day")
        .local()
        .format("L"),
    };

    //console.log(examesFormatados);

    if (examesFormatados) {
      res.status(200).json(examesFormatados);
    } else {
      res.status(404).json({ error: "Exame não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar um novo exame
router.post("/solicitacaoExames", async (req, res) => {
  try {
    //console.log("Dados recebidos para adicionar:", req.body); // Log para debug
    const novoExame = await SolicitacaoExames.create(req.body);
    res.status(201).json(novoExame);
  } catch (error) {
    console.error("Erro ao adicionar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um exame
router.put("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    const dadosAtualizado = req.body;

    const exames = await SolicitacaoExames.findByPk(idSolicitacaoExame);
    if (!exames)
      return res.status(404).json({ message: "Exame não Encontrado!" });

    await exames.update(dadosAtualizado);

    if (dadosAtualizado.status === "Inativo") {
      const data = {
        status: dadosAtualizado.status,
        cpfPaciente: dadosAtualizado.cpfPaciente,
        matriculaProfissional: dadosAtualizado.matriculaProfissional,
        idSolicitacaoExame: parseInt(idSolicitacaoExame),
      };
      RegistroResultadoExames.create(data);
    }
    res.status(200).json({ message: "Exame atualizado com Sucesso!", exames });
  } catch (error) {
    console.error("Erro ao atualizar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um exame
router.delete("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    // //console.log(`Deletando exame com id ${idSolicitacaoExame}`); // Log para debug
    await solicitacaoExames.destroy({ where: { idSolicitacaoExame } });
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao deletar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
