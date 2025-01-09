const express = require("express");
const router = express.Router();
const planoDeSaudeController = require("../controller/planoDeSaudeController");
const checkpermissao = require("../middlewares/checarPermissao");

router.post(
  "/planoDeSaude",
  checkpermissao("consultar"),
  planoDeSaudeController.criarPlanoDeSaude
);
router.get(
  "/planoDeSaude",
  checkpermissao("consultar"),
  planoDeSaudeController.lerPlanoDeSaude
);
router.get(
  "/planoDeSaude/:id",
  checkpermissao("consultar"),
  planoDeSaudeController.lerPlanoDeSaudeId
);
router.put(
  "/planoDeSaude/:id",
  checkpermissao("consultar"),
  planoDeSaudeController.atualizarPlanoDeSaude
);
router.delete(
  "/planoDeSaude/:id",
  checkpermissao("consultar"),
  planoDeSaudeController.excluirPlanoDeSaude
);

module.exports = router;
