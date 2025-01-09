const express = require("express");
const solicitacaoExames = require("../model/solicitacaoExames");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const tiposExames = require("../model/tiposExames");
const RegistroResultadoExames = require("../model/registroResultadoExames");
const router = express.Router();
const moment = require("moment");

// Rota para buscar solicitacaoExames
router.get("/solicitacaoExames", async (req, res) => {
  try {
    const exames = await solicitacaoExames.findAll({
      include: [
        { model: Paciente },
        { model: Profissional },
        { model: tiposExames },
      ],
      where: {
        status: "Ativo",  // Busca apenas os registros com status inativo
      },
    }); 

    examesFormatados = exames.map((e) => ({
      ...e.dataValues,
      createdAt: moment.utc(e.createdAt).add(1, "day").local().format("L"),
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
    const exames = await solicitacaoExames.findByPk(idSolicitacaoExame, {
      include: [
        {
          model: Paciente,
          attributes: ["cpf", "nome", "sobrenome"], // Campos do paciente
        },
        {
          model: Profissional,
          attributes: ["matricula", "nome", "tipoProfissional", "crm"], // Campos do paciente
        },
        {
          model: tiposExames,
          attributes: ["idTipoExame", "nomeTipoExame"], // Campos do tipo de exame
        },
      ],
    });

    const examesFormatados = {
      ...exames.dataValues,
      createdAt: moment.utc(exames.createdAt).add(1, "day").local().format("L"),
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
    const novoExame = await solicitacaoExames.create(req.body);
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

    const exames = await solicitacaoExames.findByPk(idSolicitacaoExame);
    if (!exames)
      return res.status(404).json({ message: "Exame não Encontrado!" });

    await exames.update(dadosAtualizado);

    if(dadosAtualizado.status === 'Inativo'){
      const data = {
        status:dadosAtualizado.status,
        cpfPaciente:dadosAtualizado.cpfPaciente,
        matriculaProfissional:dadosAtualizado.matriculaProfissional,
        idSolicitacaoExame: parseInt(idSolicitacaoExame),
      }      
      RegistroResultadoExames.create(data)
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
