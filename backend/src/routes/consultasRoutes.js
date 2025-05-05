const express = require("express");
const router = express.Router();
const ConsultaController = require("../controller/consultasController");
const checkpermissao = require("../middlewares/checarPermissao");

// **Rota para criar um novo registro de resultado de exame**
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

module.exports = router;
