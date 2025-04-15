const solicitacaoExames = require("../model/solicitacaoExames");
const tiposExames = require("../model/tiposExames");

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
          attributes: ['nomeTipoExame'],
        },
        {
          model: Profissional,
          attributes: ['nome'],
        },
        {
          model: Paciente,
          attributes: ['nome'],
        }
      ],
    });

    res.status(201).json(exameCriado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerSolicitacaoExamesId = async (req, res) => {
  try {
    const id = req.params.id;
    const exame = await solicitacaoExames.findByPk(id);

    if (exame) res.status(200).json(exame);
    else res.status(404).json({ message: "Exame não encontrado!" });
  } catch (error) {
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

    await exame.update(dadosAtualizados);
    res.status(200).json({ message: "Exame atualizado com sucesso!", exame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirSolicitacaoExames = async (req, res) => {
  try {
    const id = req.params.id;
    const exame = await solicitacaoExames.findByPk(id);
    if (!exame)
      return res.status(404).json({ message: "Exame não encontrado!" });
    await exame.destroy();
    res.status(200).json({ message: "Exame excluído com sucesso!" });
  } catch (error) {
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
