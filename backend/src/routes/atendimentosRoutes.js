const express = require("express");
const router = express.Router();
const AtendimentosController = require("../controller/atendimentosController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rotas
router.post(
  "/atendimentos/:id",
  checkpermissao("consultar"),
  AtendimentosController.realizarAtendimento
);
router.get(
  "/atendimentos/:id",
  checkpermissao("consultar"),
  AtendimentosController.getAtendimentoPorId
);
router.get("/atendimentos", 
  checkpermissao("consultar"),
  AtendimentosController.getAtendimentosPorData
);

router.put(
  "/atendimentos/:id",
  checkpermissao("consultar"),
  AtendimentosController.atualizarAtendimento
);
router.delete(
  "/atendimentos/:id",
  checkpermissao("consultar"),
  AtendimentosController.excluirAtendimento
);
module.exports = router;