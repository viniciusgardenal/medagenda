const express = require("express");
const router = express.Router();
const ConsultaController = require("../controller/consultasController");
const checkpermissao = require("../middlewares/checarPermissao");

router.post(
  "/consultas",
  checkpermissao("consultar"),
  ConsultaController.criarConsulta
);
router.get(
  "/consultas/:data",
  checkpermissao("consultar"),
  ConsultaController.listarConsultasDoDia
);
router.get(
  "/consultas/:medicoId/:dataConsulta",
  checkpermissao("consultar"),
  ConsultaController.getHorariosDisponiveis
);
router.get(
  "/consultas",
  checkpermissao("consultar"),
  ConsultaController.listarConsultas
);
router.put(
  "/consultas/:id/cancelar",
  checkpermissao("consultar"),
  ConsultaController.cancelarConsulta
);

router.put(
  "/consutas/:id",
  checkpermissao("consultar"),
  ConsultaController.alterarConsultaEhAtendimentoCancelado
);

module.exports = router;
