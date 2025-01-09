const express = require("express");
const router = express.Router();
const tiposExamesController = require("../controller/tiposExamesController");
const checkpermissao = require("../middlewares/checarPermissao");

router.post(
  "/tiposExames",
  checkpermissao("consultar"),
  tiposExamesController.criarTiposExame
);
router.get(
  "/tiposExames",
  checkpermissao("consultar"),
  tiposExamesController.lerTiposExame
);
router.get(
  "/tiposExames/:id",
  checkpermissao("consultar"),
  tiposExamesController.lerTiposExameId
);
router.put(
  "/tiposExames/:id",
  checkpermissao("consultar"),
  tiposExamesController.atualizarTiposExame
);
router.delete(
  "/tiposExames/:id",
  checkpermissao("consultar"),
  tiposExamesController.excluirTiposExame
);

module.exports = router;
