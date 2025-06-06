// /routes/atestadoRoutes.js

const express = require("express");
const router = express.Router();
const atestadoController = require("../controller/gerarAtestadosController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rotas para atestados
router.post(
  "/atestados",
  checkpermissao("criar"), // Permissão mais específica
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

// Rota para download do atestado como PDF
router.get(
    "/atestados/:id/download",
    checkpermissao("consultar"), // Adicionar verificação de permissão
    atestadoController.downloadAtestadoPdf
);

module.exports = router;