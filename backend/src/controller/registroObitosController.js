const { models } = require("../model/index");
const { Op } = require("sequelize");
const RegistroObitos = models.RegistroObitos;
const Paciente = models.Paciente;
const Profissional = models.Profissional;
const moment = require("moment");

// Função para formatar CPF com pontuação (opcional no controller, mais comum no frontend)
const formatarCpfComPontuacao = (cpf) => {
  const cpfLimpo = cpf ? cpf.replace(/\D/g, "") : "";
  if (cpfLimpo.length !== 11) return cpf;
  return `${cpfLimpo.slice(0, 3)}.${cpfLimpo.slice(3, 6)}.${cpfLimpo.slice(
    6,
    9
  )}-${cpfLimpo.slice(9)}`;
};

const criarRegistroObito = async (req, res) => {
  try {
    const {
      cpfPaciente,
      matriculaProfissional,
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status, // Este é o status para o NOVO REGISTRO DE ÓBITO
    } = req.body;

    console.log("Dados recebidos para criação de registro de óbito:", req.body);

    // Validação de campos obrigatórios
    if (
      !cpfPaciente ||
      !matriculaProfissional ||
      !dataObito ||
      !causaObito ||
      !localObito ||
      !numeroAtestadoObito
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    // REGRA DE NEGÓCIO: Data do Óbito não pode ser futura
    if (moment(dataObito).isAfter(moment())) {
      return res
        .status(400)
        .json({ message: "A data do óbito não pode ser no futuro." });
    }

    // REGRA DE NEGÓCIO: Validação de CPF do Paciente e seu status administrativo
    const pacienteExistente = await Paciente.findOne({
      where: { cpf: cpfPaciente },
    });

    if (!pacienteExistente) {
      return res
        .status(404)
        .json({ message: `Paciente com CPF ${cpfPaciente} não encontrado.` });
    }

    const statusPacienteAtual = pacienteExistente.status;
    if (statusPacienteAtual && statusPacienteAtual.toLowerCase() !== "ativo") {
      return res.status(400).json({
        message: `Paciente com CPF ${cpfPaciente} não está ativo (status administrativo atual: ${statusPacienteAtual}). Não é possível registrar um novo óbito.`,
      });
    }
    // Se statusPacienteAtual for null, undefined, "Ativo" ou "ativo", a execução continua.

    // REGRA DE NEGÓCIO: Validação de Matrícula do Profissional e status 'Ativo'
    const profissionalExistente = await Profissional.findOne({
      where: { matricula: matriculaProfissional },
    });
    if (!profissionalExistente) {
      return res.status(404).json({
        message: `Profissional com matrícula ${matriculaProfissional} não encontrado.`,
      });
    }
    
    // AJUSTE APLICADO AQUI:
    // Verifica o status do profissional. Se não for "Ativo" ou estiver indefinido,
    // registra um aviso no console mas permite que a criação do óbito continue.
    const statusProfissional = profissionalExistente.status;
    if (statusProfissional && statusProfissional.toLowerCase() !== "ativo") {
      console.warn(`Atenção: Profissional com matrícula ${matriculaProfissional} (status: ${statusProfissional}) está registrando um óbito, mas não está com status 'Ativo'. Verifique as regras de negócio.`);
      // Não retorna erro, permite continuar.
    } else if (!statusProfissional) {
      console.warn(`Atenção: Profissional com matrícula ${matriculaProfissional} não possui status definido, mas a criação do registro de óbito será permitida. Verifique as regras de negócio.`);
      // Não retorna erro, permite continuar.
    }
    // Se o status for 'ativo' ou 'Ativo', passa silenciosamente.


    // REGRA DE NEGÓCIO: Unicidade do Número do Atestado de Óbito
    const atestadoExistente = await RegistroObitos.findOne({
      where: { numeroAtestadoObito },
    });
    if (atestadoExistente) {
      return res
        .status(409)
        .json({ message: "Número do atestado de óbito já existe." });
    }

    // Cria o registro de óbito
    const novoRegistro = await RegistroObitos.create({
      cpfPaciente,
      matriculaProfissional,
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status: status || "Ativo", // Status do REGISTRO DE ÓBITO, default "Ativo"
    });

    // REGRA DE NEGÓCIO: Atualiza o status administrativo do Paciente para "Óbito"
    await Paciente.update(
      { status: "Óbito" }, 
      { where: { cpf: cpfPaciente } }
    );
    console.log(`Status administrativo do Paciente com CPF ${cpfPaciente} atualizado para 'Óbito'.`);

    const registroFormatado = {
      ...novoRegistro.toJSON(),
      dataObito: novoRegistro.dataObito
        ? moment.utc(novoRegistro.dataObito).local().format("YYYY-MM-DD HH:mm")
        : "Data inválida",
    };

    res.status(201).json({ data: registroFormatado, message: "Registro de óbito criado com sucesso." });
  } catch (error) {
    console.error("Erro ao criar registro de óbito:", error);
    console.error("Stack trace:", error.stack); 
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: `Erro de chave estrangeira. Verifique se o CPF do paciente ou a matrícula do profissional estão corretos e existem no sistema.`,
      });
    }
    res.status(500).json({
      error: error.message || "Erro interno do servidor ao criar registro.",
    });
  }
};

const lerTodosRegistrosObitos = async (req, res) => {
  try {
    const registros = await RegistroObitos.findAll({
      order: [['idRegistroObito', 'ASC']]
    });
    const registrosFormatados = registros.map((registro) => ({
      ...registro.toJSON(),
      dataObito: registro.dataObito
        ? moment.utc(registro.dataObito).local().format("YYYY-MM-DD HH:mm")
        : "Data inválida",
    }));
    res.status(200).json({ data: registrosFormatados });
  } catch (error) {
    console.error("Erro ao buscar registros de óbitos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const lerRegistroObitoId = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }
    const registroFormatado = {
      ...registro.toJSON(),
      dataObito: registro.dataObito
        ? moment.utc(registro.dataObito).local().format("YYYY-MM-DD HH:mm")
        : "Data inválida",
    };
    res.status(200).json({ data: registroFormatado });
  } catch (error) {
    console.error("Erro ao buscar registro de óbito por ID:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const atualizarRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const {
      cpfPaciente,
      matriculaProfissional, // Esta é a matrícula original vinda do frontend (não editável lá)
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status,
    } = req.body;

    const registroExistente = await RegistroObitos.findByPk(idRegistroObito);
    if (!registroExistente) {
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }

    // O CPF do paciente não pode ser alterado em um registro de óbito existente.
    if (cpfPaciente && cpfPaciente !== registroExistente.cpfPaciente) {
      return res.status(400).json({
        message: "O CPF do paciente não pode ser alterado em um registro de óbito existente.",
      });
    }

    if (dataObito && moment(dataObito).isAfter(moment())) {
      return res
        .status(400)
        .json({ message: "A data do óbito não pode ser no futuro." });
    }

    // MODIFICAÇÃO AQUI: Compara as matrículas como strings para evitar problemas com tipos (número vs string)
    // Este bloco só será relevante se houver uma tentativa REAL de mudar o profissional (o que a UI atual não faz).
    // Se a matrícula enviada (matriculaProfissional) for diferente da existente no banco,
    // então valida o novo profissional.
    const matriculaEnviadaString = matriculaProfissional ? String(matriculaProfissional) : null;
    const matriculaExistenteString = registroExistente.matriculaProfissional ? String(registroExistente.matriculaProfissional) : null;

    if (matriculaEnviadaString && matriculaEnviadaString !== matriculaExistenteString) {
      const profissionalExistente = await Profissional.findOne({
        where: { matricula: matriculaEnviadaString }, // Busca pelo valor enviado
      });
      if (!profissionalExistente) {
        return res.status(404).json({
          message: `Ao tentar alterar, o profissional com matrícula ${matriculaEnviadaString} não foi encontrado.`,
        });
      }
      // Mantendo a verificação estrita para atualização SE o profissional estiver sendo ALTERADO.
      if (profissionalExistente.status !== "Ativo") {
        return res.status(400).json({
          message: `Ao tentar alterar, o profissional com matrícula ${matriculaEnviadaString} está inativo. Não pode ser associado à atualização.`,
        });
      }
    }
    // Se matriculaProfissional não foi enviada no corpo da requisição, ou se é a mesma já existente (após conversão para string),
    // nenhuma validação de status do profissional é necessária para bloquear a edição de *outros* campos.

    if (numeroAtestadoObito && numeroAtestadoObito !== registroExistente.numeroAtestadoObito) {
      const atestadoExistente = await RegistroObitos.findOne({
        where: {
          numeroAtestadoObito,
          idRegistroObito: { [Op.ne]: idRegistroObito },
        },
      });
      if (atestadoExistente) {
        return res.status(409).json({
          message: "Número do atestado de óbito já existe para outro registro.",
        });
      }
    }

    // Atualiza os campos.
    // A matriculaProfissional só será atualizada se for diferente e válida (conforme lógica acima),
    // ou se for explicitamente enviada no payload (mesmo sendo igual).
    // Se não for enviada no payload, não será alterada.
    const updateData = {
        // cpfPaciente não é alterado aqui.
        dataObito: dataObito !== undefined ? dataObito : registroExistente.dataObito,
        causaObito: causaObito !== undefined ? causaObito : registroExistente.causaObito,
        localObito: localObito !== undefined ? localObito : registroExistente.localObito,
        numeroAtestadoObito: numeroAtestadoObito !== undefined ? numeroAtestadoObito : registroExistente.numeroAtestadoObito,
        observacoes: observacoes !== undefined ? observacoes : registroExistente.observacoes,
        status: status !== undefined ? status : registroExistente.status,
    };

    // Adiciona matriculaProfissional ao payload de atualização somente se foi fornecida.
    // Se for a mesma, apenas reafirma o valor. Se for diferente, já passou pela validação acima.
    if (matriculaProfissional !== undefined) {
        updateData.matriculaProfissional = matriculaEnviadaString; // Usa a string normalizada
    }


    await registroExistente.update(updateData);

    // Lógica de atualização do status do paciente (Óbito/Ativo)
    if (status) {
        if (status.toLowerCase() === 'inativo') {
            const outrosRegistrosAtivos = await RegistroObitos.findOne({
                where: {
                    cpfPaciente: registroExistente.cpfPaciente,
                    status: 'Ativo',
                    idRegistroObito: { [Op.ne]: idRegistroObito }
                }
            });
            if (!outrosRegistrosAtivos) {
                await Paciente.update(
                    { status: 'Ativo' },
                    { where: { cpf: registroExistente.cpfPaciente, status: 'Óbito' } }
                );
                console.log(`Paciente ${registroExistente.cpfPaciente} reativado pois seu único registro de óbito ativo foi inativado.`);
            }
        } else if (status.toLowerCase() === 'ativo') {
            await Paciente.update(
                { status: 'Óbito' },
                { where: { cpf: registroExistente.cpfPaciente } }
            );
            console.log(`Status do Paciente ${registroExistente.cpfPaciente} definido para 'Óbito' pois seu registro de óbito foi ativado.`);
        }
    }

    const registroAtualizadoAposUpdate = await RegistroObitos.findByPk(idRegistroObito);
    const registroFormatado = {
      ...registroAtualizadoAposUpdate.toJSON(),
      dataObito: registroAtualizadoAposUpdate.dataObito
        ? moment
            .utc(registroAtualizadoAposUpdate.dataObito)
            .local()
            .format("YYYY-MM-DD HH:mm")
        : "Data inválida",
       // Garante que a matricula do profissional seja string para consistência, se existir
      matriculaProfissional: registroAtualizadoAposUpdate.matriculaProfissional 
        ? String(registroAtualizadoAposUpdate.matriculaProfissional) 
        : null,
    };

    res
      .status(200)
      .json({
        message: "Registro de óbito atualizado com sucesso!",
        registro: registroFormatado,
      });
  } catch (error) {
    console.error("Erro ao atualizar registro de óbito:", error);
    console.error("Stack trace:", error.stack);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: `Erro: Matrícula do profissional não encontrada ou inválida.`,
      });
    }
    res.status(500).json({ error: error.message || "Erro interno do servidor" });
  }
};

const excluirRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }

    const cpfPacienteDoRegistroExcluido = registro.cpfPaciente;
    const statusDoRegistroExcluido = registro.status;

    await registro.destroy();

    if (statusDoRegistroExcluido && statusDoRegistroExcluido.toLowerCase() === 'ativo') {
        const outrosRegistrosObitoAtivosParaPaciente = await RegistroObitos.findOne({
          where: { 
            cpfPaciente: cpfPacienteDoRegistroExcluido,
            status: 'Ativo'
          },
        });

        if (!outrosRegistrosObitoAtivosParaPaciente) {
          const paciente = await Paciente.findOne({ where: { cpf: cpfPacienteDoRegistroExcluido } });
          if (paciente && paciente.status === "Óbito") { 
            await Paciente.update(
              { status: "Ativo" },
              { where: { cpf: cpfPacienteDoRegistroExcluido } }
            );
            console.log(
              `Paciente com CPF ${cpfPacienteDoRegistroExcluido} teve seu status administrativo revertido para 'Ativo' após exclusão do seu último registro de óbito ativo (${idRegistroObito}).`
            );
          }
        } else {
          console.log(
            `Registro de óbito ${idRegistroObito} excluído. Paciente com CPF ${cpfPacienteDoRegistroExcluido} ainda possui outros registros de óbito ativos. Status administrativo do paciente não alterado.`
          );
        }
    } else {
        console.log(`Registro de óbito ${idRegistroObito} (status: ${statusDoRegistroExcluido}) excluído. Nenhuma alteração no status do paciente pois o registro excluído não estava ativo.`);
    }

    res.status(200).json({ message: "Registro de óbito excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar registro de óbito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  criarRegistroObito,
  lerTodosRegistrosObitos,
  lerRegistroObitoId,
  atualizarRegistroObito,
  excluirRegistroObito,
};