const express = require("express");
const router = express.Router();
const registroObitosController = require("../controller/registroObitosController");
const checkpermissao = require("../middlewares/checarPermissao");

// Criar um novo registro de óbito
router.post(
  "/registro-obitos",
  checkpermissao("criar"), // Permissão para criar
  registroObitosController.criarRegistroObito
);

// Listar todos os registros de óbitos
router.get(
  "/registro-obitos",
  checkpermissao("consultar"), // Permissão para consultar
  registroObitosController.lerTodosRegistrosObitos
);

// Consultar um registro de óbito específico por ID
router.get(
  "/registro-obitos/:id",
  checkpermissao("consultar"), // Permissão para consultar
  registroObitosController.lerRegistroObitoId
);

// Atualizar um registro de óbito existente
router.put(
  "/registro-obitos/:id",
  checkpermissao("consultar"), // Permissão para alterar
  registroObitosController.atualizarRegistroObito
);

// Excluir um registro de óbito
router.delete(
  "/registro-obitos/:id",
  checkpermissao("consultar"), // Permissão para excluir
  registroObitosController.excluirRegistroObito
);

module.exports = router;