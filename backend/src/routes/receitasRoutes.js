const express = require("express");
const router = express.Router();
const receitaController = require("../controller/receitasController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rotas para receitas
router.post(
  "/receitas",
  checkpermissao("consultar"),
  receitaController.criarReceita
);
router.get(
  "/receitas",
  checkpermissao("consultar"),
  receitaController.lerReceitas
);
router.get(
  "/receitas/:id",
  checkpermissao("consultar"),
  receitaController.lerReceitaId
);
// router.put(
//   "/receitas/:id",
//   checkpermissao("consultar"),
//   receitaController.atualizarReceita
// );
// router.delete(
//   "/receitas/:id",
//   checkpermissao("consultar"),
//   receitaController.excluirReceita
// );

// Rota para download da receita como arquivo de texto
router.get("/receitas/:id/download", receitaController.downloadReceita);

module.exports = router;
