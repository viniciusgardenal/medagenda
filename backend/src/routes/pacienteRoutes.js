const express = require("express");
const router = express.Router();
const pacienteController = require("../controller/pacientesControllers");
const checkpermissao = require("../middlewares/checarPermissao");


router.post(
  "/pacientes",
  checkpermissao("consultar"),
  pacienteController.cadastrarPaciente
);
router.get(
  "/pacientes",
  checkpermissao("consultar"),
  pacienteController.lerPaciente
);
router.get(
  "/pacientes/:id",
  checkpermissao("consultar"),
  pacienteController.lerPacienteId
);
router.put(
  "/pacientes/:id",
  checkpermissao("consultar"),
  pacienteController.atualizarPaciente
);
router.delete(
  "/pacientes/:id",
  checkpermissao("consultar"),
  pacienteController.excluirPaciente
);

module.exports = router;
