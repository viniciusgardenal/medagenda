const express = require("express");
const router = express.Router();
const ConsultaController = require("../controller/consultasController");

// **Rota para criar um novo registro de resultado de exame**
router.post("/consulta", ConsultaController.criarConsulta);
router.get("/consultas/:data", ConsultaController.listarConsultasDoDia);

module.exports = router;
