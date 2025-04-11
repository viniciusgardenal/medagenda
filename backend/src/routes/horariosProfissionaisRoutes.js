const express = require("express");
const router = express.Router();
const horariosProfissionaisController = require("../controller/horariosProfissionaisController");
const checkpermissao = require("../middlewares/checarPermissao");

// Criar um novo horário
router.post(
  "/horarios-profissionais",
  checkpermissao("criar"), // Permissão para criar
  horariosProfissionaisController.criarHorario
);

// Listar todos os horários
router.get(
  "/horarios-profissionais",
  checkpermissao("consultar"), // Permissão para consultar
  horariosProfissionaisController.lerHorarios
);

// Consultar um horário específico por ID
router.get(
  "/horarios-profissionais/:id",
  checkpermissao("consultar"), // Permissão para consultar
  horariosProfissionaisController.lerHorarioId
);

// Atualizar um horário existente
router.put(
  "/horarios-profissionais/:id",
  checkpermissao("alterar"), // Permissão para alterar
  horariosProfissionaisController.atualizarHorario
);

// Excluir um horário
router.delete(
  "/horarios-profissionais/:id",
  checkpermissao("excluir"), // Permissão para excluir (assumido, ajustar conforme necessário)
  horariosProfissionaisController.excluirHorario
);

module.exports = router;