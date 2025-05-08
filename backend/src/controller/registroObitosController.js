const { models } = require("../model/index");
const RegistroObitos = models.RegistroObitos;
const Paciente = models.Paciente;
const Profissional = models.Profissional;
const moment = require("moment");

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
        status,
      } = req.body;
  
      // Verificação de campos obrigatórios
      if (!cpfPaciente || !matriculaProfissional || !dataObito || !causaObito || !localObito || !numeroAtestadoObito) {
        return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
      }
  
      // CPF - busca flexível
      let paciente = await Paciente.findOne({ where: { cpf: cpfPaciente } });
  
      if (!paciente) {
        const cpfSemPontuacao = cpfPaciente.replace(/\D/g, "");
        const pacientes = await Paciente.findAll();
        paciente = pacientes.find(p => p.cpf.replace(/\D/g, "") === cpfSemPontuacao);
      }
  
      if (!paciente) {
        return res.status(400).json({ message: `Paciente com CPF ${cpfPaciente} não encontrado` });
      }
  
      // Matrícula - validação robusta
      const matriculaInt = parseInt(matriculaProfissional, 10);
      if (isNaN(matriculaInt)) {
        return res.status(400).json({ message: "Matrícula do profissional deve ser um número válido" });
      }
  
      const profissionais = await Profissional.findAll();
      const profissional = profissionais.find(p => parseInt(p.matricula) === matriculaInt);
  
      if (!profissional) {
        return res.status(400).json({ message: `Profissional com matrícula ${matriculaProfissional} não encontrado` });
      }
  
      // Data
      const parsedDataObito = moment(dataObito).isValid() ? moment(dataObito).toDate() : null;
      if (!parsedDataObito) {
        return res.status(400).json({ message: "Formato de data inválido para dataObito" });
      }
  
      // Criação
      const registro = await RegistroObitos.create({
        cpfPaciente: paciente.cpf, // já com pontuação se veio assim
        matriculaProfissional: profissional.matricula,
        dataObito: parsedDataObito,
        causaObito,
        localObito,
        numeroAtestadoObito,
        observacoes,
        status: status || "Ativo",
      });
  
      // Retorno com joins
      const registroCriado = await RegistroObitos.findByPk(registro.idRegistroObito, {
        include: [
          { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
          { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
        ],
      });
  
      const registroFormatado = {
        ...registroCriado.dataValues,
        dataObito: moment.utc(registroCriado.dataObito).local().format("L"),
      };
  
      res.status(201).json({ data: registroFormatado });
    } catch (error) {
      console.error("Erro ao criar registro de óbito:", error);
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          message: `Erro: CPF ${req.body.cpfPaciente} ou matrícula ${req.body.matriculaProfissional} não encontrado(s)`,
        });
      }
      res.status(500).json({ message: "Erro ao criar registro", error: error.message });
    }
  };
  

const lerTodosRegistrosObitos = async (req, res) => {
  try {
    const registros = await RegistroObitos.findAll({
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
      ],
      where: {
        status: "Ativo",
      },
    });

    const registrosFormatados = registros.map((r) => ({
      ...r.dataValues,
      dataObito: moment.utc(r.dataObito).local().format("L"),
    }));

    res.status(200).json(registrosFormatados);
  } catch (error) {
    console.error("Erro ao buscar registros de óbitos:", error);
    res.status(500).json({ error: error.message });
  }
};

const lerRegistroObitoId = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito, {
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
      ],
    });

    if (registro) {
      const registroFormatado = {
        ...registro.dataValues,
        dataObito: moment.utc(registro.dataObito).local().format("L"),
      };
      res.status(200).json(registroFormatado);
    } else {
      res.status(404).json({ error: "Registro de óbito não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao buscar registro de óbito:", error);
    res.status(500).json({ error: error.message });
  }
};

const atualizarRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const {
      cpfPaciente,
      matriculaProfissional,
      dataObito,
      causaObito,
      localObito,
      numeroAtestadoObito,
      observacoes,
      status,
    } = req.body;

    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }

    // Validate if provided
    if (causaObito && causaObito.trim() === "") {
      return res.status(400).json({ message: "Causa do óbito não pode ser vazia" });
    }

    // Verify foreign keys if provided
    let cpfNormalizado = registro.cpfPaciente;
    if (cpfPaciente) {
      cpfNormalizado = cpfPaciente.replace(/\D/g, "");
      const paciente = await Paciente.findOne({ where: { cpf: cpfNormalizado } });
      if (!paciente) {
        return res.status(400).json({ message: `Paciente com CPF ${cpfPaciente} não encontrado` });
      }
    }

    let matriculaInt = registro.matriculaProfissional;
    if (matriculaProfissional) {
      matriculaInt = parseInt(matriculaProfissional, 10);
      if (isNaN(matriculaInt)) {
        return res.status(400).json({ message: "Matrícula do profissional deve ser um número válido" });
      }
      const profissional = await Profissional.findOne({ where: { matricula: matriculaInt } });
      if (!profissional) {
        return res.status(400).json({ message: `Profissional com matrícula ${matriculaProfissional} não encontrado` });
      }
    }

    // Parse dataObito if provided
    let parsedDataObito = registro.dataObito;
    if (dataObito) {
      parsedDataObito = moment(dataObito).isValid() ? moment(dataObito).toDate() : null;
      if (!parsedDataObito) {
        return res.status(400).json({ message: "Formato de data inválido para dataObito" });
      }
    }

    // Update record
    await registro.update({
      cpfPaciente: cpfNormalizado,
      matriculaProfissional: matriculaInt,
      dataObito: parsedDataObito,
      causaObito: causaObito || registro.causaObito,
      localObito: localObito || registro.localObito,
      numeroAtestadoObito: numeroAtestadoObito || registro.numeroAtestadoObito,
      observacoes: observacoes !== undefined ? observacoes : registro.observacoes,
      status: status || registro.status,
    });

    // Fetch updated record
    const registroAtualizado = await RegistroObitos.findByPk(idRegistroObito, {
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
      ],
    });

    const registroFormatado = {
      ...registroAtualizado.dataValues,
      dataObito: moment.utc(registroAtualizado.dataObito).local().format("L"),
    };

    res.status(200).json({ message: "Registro de óbito atualizado com sucesso!", registro: registroFormatado });
  } catch (error) {
    console.error("Erro ao atualizar registro de óbito:", error);
    res.status(500).json({ error: error.message });
  }
};

const excluirRegistroObito = async (req, res) => {
  try {
    const idRegistroObito = req.params.id;
    const registro = await RegistroObitos.findByPk(idRegistroObito);
    if (!registro) {
      return res.status(404).json({ message: "Registro de óbito não encontrado!" });
    }
    await registro.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Erro ao deletar registro de óbito:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarRegistroObito,
  lerTodosRegistrosObitos,
  lerRegistroObitoId,
  atualizarRegistroObito,
  excluirRegistroObito,
};