const express = require("express");
const router = express.Router();
const atestadoController = require("../controller/gerarAtestadosController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rotas para atestados
router.post(
  "/atestados",
  checkpermissao("consultar"),
  atestadoController.criarAtestado
);

router.get(
  "/atestados",
  checkpermissao("consultar"),
  atestadoController.lerAtestados
);

router.get(
  "/atestados/:id",
  checkpermissao("consultar"),
  atestadoController.lerAtestadoId
);

// Rota para download do atestado como arquivo de texto
router.get("/atestados/:id/download", atestadoController.downloadAtestado);

module.exports = router;
