const RegistroResultadoExames = require('../model/registroResultadoExames');

// **Criar um novo RegistroResultadoExame**
const createRegistroResultadoExame = async (req, res) => {
  const { idSolicitacaoExame, matriculaProfissional, cpfPaciente, observacoes, status } = req.body;

  try {
    const registro = await RegistroResultadoExames.create({
      idSolicitacaoExame,
      matriculaProfissional,
      cpfPaciente,
      observacoes,
      status: status || "Inativo", // Se não fornecer o status, será "inativo" por padrão
    });

    return res.status(201).json({
      message: 'Registro de resultado de exame criado com sucesso',
      data: registro,
    });
  } catch (error) {
    console.error("Erro ao criar o registro:", error);
    return res.status(500).json({
      message: 'Erro ao criar o registro',
      error: error.message,
    });
  }
};

// **Buscar todos os registros inativos**
const getRegistrosInativos = async (req, res) => {
  try {
    const registrosInativos = await RegistroResultadoExames.findInativos();
    return res.status(200).json({
      message: 'Registros inativos encontrados com sucesso',
      data: registrosInativos,
    });
  } catch (error) {
    console.error("Erro ao buscar registros inativos:", error);
    return res.status(500).json({
      message: 'Erro ao buscar registros inativos',
      error: error.message,
    });
  }
};


// **Buscar um registro específico por ID**
const getRegistroPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroResultadoExames.findByPk(id, {
      include: [
        {
          model: require('../model/solicitacaoExames'),
          as: 'solicitacaoExame',
        },
        {
          model: require('../model/profissionais'),
          as: 'profissional',
        },
        {
          model: require('../model/paciente'),
          as: 'paciente',
        },
      ],
    });

    if (!registro) {
      return res.status(404).json({
        message: 'Registro não encontrado',
      });
    }

    return res.status(200).json({
      message: 'Registro encontrado com sucesso',
      data: registro,
    });
  } catch (error) {
    console.error("Erro ao buscar o registro:", error);
    return res.status(500).json({
      message: 'Erro ao buscar o registro',
      error: error.message,
    });
  }
};

// **Atualizar um RegistroResultadoExame**
const updateRegistroResultadoExame = async (req, res) => {
  const { id } = req.params;
  const { idSolicitacaoExame, matriculaProfissional, cpfPaciente, observacoes, status } = req.body;

  try {
    const registro = await RegistroResultadoExames.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        message: 'Registro não encontrado',
      });
    }

    // Atualizando os campos do registro
    registro.idSolicitacaoExame = idSolicitacaoExame || registro.idSolicitacaoExame;
    registro.matriculaProfissional = matriculaProfissional || registro.matriculaProfissional;
    registro.cpfPaciente = cpfPaciente || registro.cpfPaciente;
    registro.observacoes = observacoes || registro.observacoes;
    registro.status = status || registro.status;

    await registro.save();

    return res.status(200).json({
      message: 'Registro atualizado com sucesso',
      data: registro,
    });
  } catch (error) {
    console.error("Erro ao atualizar o registro:", error);
    return res.status(500).json({
      message: 'Erro ao atualizar o registro',
      error: error.message,
    });
  }
};

// **Deletar um RegistroResultadoExame**
const deleteRegistroResultadoExame = async (req, res) => {
  const { id } = req.params;

  try {
    const registro = await RegistroResultadoExames.findByPk(id);

    if (!registro) {
      return res.status(404).json({
        message: 'Registro não encontrado',
      });
    }

    await registro.destroy();

    return res.status(200).json({
      message: 'Registro deletado com sucesso',
    });
  } catch (error) {
    console.error("Erro ao deletar o registro:", error);
    return res.status(500).json({
      message: 'Erro ao deletar o registro',
      error: error.message,
    });
  }
};

module.exports = {
  createRegistroResultadoExame,
  getRegistrosInativos,
  getRegistroPorId,
  updateRegistroResultadoExame,
  deleteRegistroResultadoExame,
};
