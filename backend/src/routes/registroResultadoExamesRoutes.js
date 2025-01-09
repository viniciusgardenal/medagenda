const express = require('express');
const router = express.Router();
const RegistroResultadoExamesController = require('../controller/registroResultadoExamesController');

// **Rota para criar um novo registro de resultado de exame**
router.post('/registroResultadoExames', RegistroResultadoExamesController.createRegistroResultadoExame);

// **Rota para obter todos os registros inativos**
router.get('/registroResultadoExames/inativos', RegistroResultadoExamesController.getRegistrosInativos);

// **Rota para obter um registro específico por ID**
router.get('/registroResultadoExames/:id', RegistroResultadoExamesController.getRegistroPorId);

// **Rota para atualizar um registro de resultado de exame**
router.put('/registroResultadoExames/:id', RegistroResultadoExamesController.updateRegistroResultadoExame);

// **Rota para deletar um registro de resultado de exame**
router.delete('/registroResultadoExames/:id', RegistroResultadoExamesController.deleteRegistroResultadoExame);

module.exports = router;
