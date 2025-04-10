const express = require("express");
const router = express.Router();
const checkInController = require("../controller/checkInController");

// Rota para realizar check-in
router.post("/checkin", checkInController.realizarCheckIn);

// Rota para listar fila de atendimento
router.get("/getCheckIn", checkInController.getCheckIn);

// Rota para chamar próximo paciente
router.get('/checkIn/consulta/:consultaId', checkInController.getCheckInConsultas);

// // Rota para finalizar atendimento
// router.put('/:checkInId/finalizar', checkInController.finalizarAtendimento);

// // Rota para buscar estatísticas
// router.get('/estatisticas', checkInController.estatisticasCheckIn);

module.exports = router;
