const express = require("express");
const router = express.Router();
const checkInController = require("../controller/checkInController");
const checkpermissao = require("../middlewares/checarPermissao");

// Rota para realizar check-in
router.post(
  "/checkin",
  checkpermissao("consultar"),
  checkInController.realizarCheckIn
);

// Rota para listar fila de atendimento
router.get(
  "/getCheckIn",
  checkpermissao("consultar"),
  checkInController.getCheckIn
);

// Rota para chamar próximo paciente
router.get(
  "/checkIn/consulta/:consultaId",
  checkpermissao("consultar"),
  checkInController.getCheckInConsultas
);

router.get(
  "/relatorio/excel",
  checkInController.gerarRelatorioCheckIns
);

router.put(
  "/checkIn/:id", // <-- Rota com ID do check-in
  checkpermissao("consultar"), // Considere qual permissão é necessária para editar
  checkInController.atualizarCheckIn
);

// // Rota para finalizar atendimento
// router.put('/:checkInId/finalizar', checkInController.finalizarAtendimento);

// // Rota para buscar estatísticas
// router.get('/estatisticas', checkInController.estatisticasCheckIn);

module.exports = router;
