const express = require("express");
const router = express.Router();
const profissionalController = require("../controller/profissionalController");
const checkpermissao = require("../middlewares/checarPermissao");


router.post(
  "/profissionais",
  checkpermissao("consultar"),
  profissionalController.criarProfissional
);
router.get(
  "/profissionais",
  checkpermissao("consultar"),
  profissionalController.lerProfissionais
);
router.get(
  "/profissionais/:id",
  checkpermissao("consultar"),
  profissionalController.lerProfissionalId
);
router.put(
  "/profissionais/:id",
  checkpermissao("consultar"),
  profissionalController.atualizarProfissional
);
router.delete(
  "/profissionais/:id",
  checkpermissao("consultar"),
  profissionalController.excluirProfissional
);

module.exports = router;
