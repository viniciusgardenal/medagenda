const express = require("express");
const router = express.Router();
const medicamentoController = require("../controller/medicamentosController");
const checkpermissao = require("../middlewares/checarPermissao");

router.post(
  "/medicamentos",
  checkpermissao("consultar"),
  medicamentoController.cadastrarMedicamento
);
router.get(
  "/medicamentos",
  checkpermissao("consultar"),
  medicamentoController.lerMedicamentos
);
router.get(
  "/medicamentos/:id",
  checkpermissao("consultar"),
  medicamentoController.lerMedicamentosId
);
router.put(
  "/medicamentos/:id",
  checkpermissao("consultar"),
  medicamentoController.updateMedicamentos
);
router.delete(
  "/medicamentos/:id",
  checkpermissao("consultar"),
  medicamentoController.excluirMedicamentos
);

module.exports = router;
