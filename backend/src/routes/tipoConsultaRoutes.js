const express = require("express");
const router = express.Router();
const tipoConsultaController = require("../controller/tipoConsultaController");
const checkpermissao = require("../middlewares/checarPermissao");

router.post(
  "/tipoConsulta",
  checkpermissao("consultar"),
  tipoConsultaController.criarTipoConsulta
);
router.get(
  "/tipoConsulta",
  checkpermissao("consultar"),
  tipoConsultaController.lerTipoConsulta
);
router.get(
  "/tipoConsulta/:id",
  checkpermissao("consultar"),
  tipoConsultaController.lerTipoConsultaId
);
router.put(
  "/tipoConsulta/:id",
  checkpermissao("consultar"),
  tipoConsultaController.atualizarTipoConsulta
);
router.delete(
  "/tipoConsulta/:id",
  checkpermissao("consultar"),
  tipoConsultaController.excluirTipoConsulta
);

module.exports = router;
