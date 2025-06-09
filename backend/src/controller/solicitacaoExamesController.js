const solicitacaoExames = require("../model/solicitacaoExames");
const tiposExames = require("../model/tiposExames");
const Profissional = require("../model/profissional"); // Adjust path as needed
const Paciente = require("../model/paciente"); // Adjust path as needed
const { models } = require("../model/index");
const RegistroResultadoExames = models.RegistroResultadoExames;

const criarSolicitacaoExames = async (req, res) => {
  try {
    const { 
      idTipoExame, 
      matriculaProfissional, 
      cpfPaciente, 
      periodo, 
      justificativa, 
      status, 
      dataSolicitacao, 
      dataRetorno 
    } = req.body;

    const tipoExame = await tiposExames.findByPk(idTipoExame);
    if (!tipoExame) {
      return res.status(400).json({ error: "Tipo de exame não encontrado!" });
    }

    const nomeTipoExameValido = tipoExame.nomeTipoExame && tipoExame.nomeTipoExame.trim() !== ""
      ? tipoExame.nomeTipoExame
      : `Exame ${idTipoExame}`; // Valor padrão

    const novaSolicitacaoExame = await solicitacaoExames.create({
      idTipoExame,
      nomeTipoExame: nomeTipoExameValido,
      matriculaProfissional,
      cpfPaciente,
      periodo,
      justificativa,
      status,
      dataSolicitacao,
      dataRetorno
    });

    const exameCriado = await solicitacaoExames.findByPk(novaSolicitacaoExame.idSolicitacaoExame, {
      include: [
        {
          model: tiposExames,
          as: 'tipoExame',
          attributes: ['nomeTipoExame'],
        },
        {
          model: Profissional,
          as: 'profissional',
          attributes: ['nome', 'crm'],
        },
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['nome', 'sobrenome'],
        }
      ],
    });

    res.status(201).json(exameCriado);
  } catch (error) {
    console.error("Erro ao criar solicitação:", error);
    res.status(400).json({ error: error.message });
  }
};

const lerSolicitacaoExames = async (req, res) => {
  try {
    const exames = await solicitacaoExames.findAll({
      include: [
        {
          model: tiposExames,
          as: 'tipoExame',
          attributes: ['nomeTipoExame'],
        },
        {
          model: Profissional,
          as: 'profissional',
          attributes: ['nome', 'crm'],
        },
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['nome', 'sobrenome'],
        }
      ],
    });
    res.status(200).json(exames);
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    res.status(500).json({ error: error.message });
  }
};

const lerSolicitacaoExamesId = async (req, res) => {
  try {
    const id = req.params.id;
    const exame = await solicitacaoExames.findByPk(id, {
      include: [
        {
          model: tiposExames,
          as: 'tipoExame',
          attributes: ['nomeTipoExame'],
        },
        {
          model: Profissional,
          as: 'profissional',
          attributes: ['nome', 'crm'],
        },
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['nome', 'sobrenome'],
        }
      ],
    });
    if (exame) {
      res.status(200).json(exame);
    } else {
      res.status(404).json({ message: "Exame não encontrado!" });
    }
  } catch (error) {
    console.error("Erro ao buscar solicitação ID:", id, error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarSolicitacaoExames = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    const exame = await solicitacaoExames.findByPk(id);

    if (!exame) {
      return res.status(404).json({ message: "Exame não encontrado!" });
    }

    // Validar nomeTipoExame, se fornecido
    if (dadosAtualizados.nomeTipoExame && dadosAtualizados.nomeTipoExame.trim() === "") {
      return res.status(400).json({ error: "Nome do tipo de exame não pode ser vazio!" });
    }

    // Atualiza o exame com os novos dados
    await exame.update(dadosAtualizados);

    // *** INÍCIO DA LÓGICA ADICIONADA ***
    // Se o status for atualizado para "Inativo", cria um registro de resultado
    if (dadosAtualizados.status === "Inativo") {
      // Verifica se já não existe um resultado para evitar duplicatas
      const resultadoExistente = await RegistroResultadoExames.findOne({
        where: { idSolicitacaoExame: exame.idSolicitacaoExame },
      });

      if (!resultadoExistente) {
        await RegistroResultadoExames.create({
          idSolicitacaoExame: exame.idSolicitacaoExame,
          matriculaProfissional: exame.matriculaProfissional,
          cpfPaciente: exame.cpfPaciente,
          status: "Inativo", // O resultado também inicia como "Inativo"
          observacoes: "", // Inicia com observações vazias
        });
      }
    }
    // *** FIM DA LÓGICA ADICIONADA ***

    const exameAtualizado = await solicitacaoExames.findByPk(id, {
      include: [
        {
          model: tiposExames,
          as: 'tipoExame',
          attributes: ['nomeTipoExame'],
        },
        {
          model: Profissional,
          as: 'profissional',
          attributes: ['nome', 'crm'],
        },
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['nome', 'sobrenome'],
        }
      ],
    });
    res.status(200).json({ message: "Exame atualizado com sucesso!", exame: exameAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar solicitação ID:", id, error);
    res.status(500).json({ error: error.message });
  }
};

const excluirSolicitacaoExames = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Tentando excluir solicitação ID:", id);
    const exame = await solicitacaoExames.findByPk(id);
    if (!exame) {
      console.warn("Solicitação não encontrada para ID:", id);
      return res.status(404).json({ message: "Exame não encontrado!" });
    }
    await exame.destroy();
    console.log("Solicitação excluída com sucesso, ID:", id);
    res.status(200).json({ message: "Exame excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir solicitação ID:", id, error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarSolicitacaoExames,
  lerSolicitacaoExames,
  lerSolicitacaoExamesId,
  atualizarSolicitacaoExames,
  excluirSolicitacaoExames,
};