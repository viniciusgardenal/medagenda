const express = require("express");
const router = express.Router();
const receitaController = require("../controller/receitasController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rota para CRIAR uma receita (com múltiplos medicamentos)
router.post(
  "/receitas",
  checkpermissao("consultar"),
  receitaController.criarReceita
);

// Rota para LER todas as receitas (agrupadas)
router.get(
  "/receitas",
  checkpermissao("consultar"),
  receitaController.lerReceitas
);

// Rota para DOWNLOAD de uma receita específica (usando batchId)
router.get(
  "/receitas/download/:batchId",
  // checkpermissao("consultar"), // Download pode ser público ou restrito
  receitaController.downloadReceita
);

module.exports = router;