const express = require("express");
const { models } = require("../model/index");
const TiposExame = models.TiposExames;
const Paciente = models.Paciente;
const Profissional = models.Profissional;
const RegistroResultadoExames = models.RegistroResultadoExames;
const SolicitacaoExames = models.SolicitacaoExames; // Modelo com 'S' maiúsculo
const router = express.Router();
// O 'moment' não é mais necessário neste arquivo
// const moment = require("moment");

// Rota para buscar todas as solicitações de exames
router.get("/solicitacaoExames", async (req, res) => {
  try {
    const exames = await SolicitacaoExames.findAll({
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "profissional" },
        { model: TiposExame, as: "tipoExame" },
      ],
      where: {
        status: "Ativo",
      },
    });

    // Não é mais necessário formatar as datas aqui. O frontend fará isso.
    res.status(200).json(exames);
  } catch (error) {
    console.error("Erro ao buscar exames:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar uma solicitação de exame por ID
router.get("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    const exame = await SolicitacaoExames.findByPk(idSolicitacaoExame, {
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "profissional" },
        { model: TiposExame, as: "tipoExame" },
      ],
    });

    if (exame) {
      // Retorna o objeto diretamente, sem formatação de data
      res.status(200).json(exame);
    } else {
      res.status(404).json({ error: "Exame não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para adicionar um novo exame
router.post("/solicitacaoExames", async (req, res) => {
  try {
    const novoExame = await SolicitacaoExames.create(req.body);
    // Para consistência, busca o exame recém-criado com os 'includes'
    const exameComDados = await SolicitacaoExames.findByPk(novoExame.idSolicitacaoExame, {
        include: [
            { model: Paciente, as: "paciente" },
            { model: Profissional, as: "profissional" },
            { model: TiposExame, as: "tipoExame" },
        ]
    });
    res.status(201).json(exameComDados);
  } catch (error) {
    console.error("Erro ao adicionar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um exame
router.put("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    const dadosAtualizado = req.body;

    // --- ADICIONE ESTAS LINHAS PARA DEPURAÇÃO ---
    console.log("ID recebido para atualização:", idSolicitacaoExame);
    console.log("DADOS recebidos no corpo da requisição:", dadosAtualizado);
    // -----------------------------------------

    const exame = await SolicitacaoExames.findByPk(idSolicitacaoExame);
    if (!exame) {
      return res.status(404).json({ message: "Exame não Encontrado!" });
    }

    await exame.update(dadosAtualizado);
    
    // ... resto da sua lógica ...
    
    // Busca novamente para retornar o dado completo e atualizado
    const exameAtualizado = await SolicitacaoExames.findByPk(idSolicitacaoExame, {
        include: [
            { model: Paciente, as: "paciente" },
            { model: Profissional, as: "profissional" },
            { model: TiposExame, as: "tipoExame" },
        ]
    });

    res.status(200).json({ message: "Exame atualizado com Sucesso!", exame: exameAtualizado });

  } catch (error) {
    // ESTE CONSOLE.ERROR É MUITO IMPORTANTE!
    console.error("Erro completo ao atualizar exame:", error); 
    res.status(500).json({ error: error.message });
  }
});

// Rota para deletar um exame
router.delete("/solicitacaoExames/:id", async (req, res) => {
  try {
    const idSolicitacaoExame = req.params.id;
    
    // CORREÇÃO: Usando o modelo 'SolicitacaoExames' com 'S' maiúsculo
    const resultado = await SolicitacaoExames.destroy({ where: { idSolicitacaoExame } });

    if (resultado === 0) {
        return res.status(404).json({ message: "Exame não encontrado para exclusão." });
    }

    res.status(200).json({ message: "Exame excluído com sucesso!" }); // Enviando uma resposta de sucesso com mensagem
  } catch (error) {
    console.error("Erro ao deletar exame:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;