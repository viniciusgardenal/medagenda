const bcrypt = require("bcryptjs");
const Profissional = require("../model/profissionais");
const Paciente = require("../model/paciente");
const Medicamento = require("../model/medicamentos");
const TiposExames = require("../model/tiposExames");
const PlanoDeSaude = require("../model/planoDeSaude");
const TipoConsulta = require("../model/tipoConsulta");
const Consulta = require("../model/consulta");
const CheckIn = require("../model/checkin");
const Atendimento = require("../model/atendimentos");
const Receita = require("../model/receitas");
const Atestado = require("../model/gerarAtestados");
const SolicitacaoExames = require("../model/solicitacaoExames");
const moment = require("moment");

const inicializarFuncionariosPadrao = async () => {
  try {
    const funcionariosPadrao = [
      {
        nome: "Diretor",
        email: "diretor@medagenda.com",
        tipoProfissional: "Diretor",
        roleId: 1, // Role para Diretor
      },
      {
        nome: "Atendente",
        email: "atendente@medagenda.com",
        tipoProfissional: "Atendente",
        roleId: 2, // Role para Atendente
      },
      {
        nome: "Medico",
        email: "medico@medagenda.com",
        tipoProfissional: "Medico",
        roleId: 3, // Role para Médico
      },
    ];

    const senhaProvisoria = "abc123";
    const hashedPassword = await bcrypt.hash(senhaProvisoria, 10);
    const dataHoje = moment().format("YYYY-MM-DD"); // Formato adequado ao banco de dados

    for (const funcionario of funcionariosPadrao) {
      const funcionarioExistente = await Profissional.findOne({
        where: { email: funcionario.email },
      });

      if (!funcionarioExistente) {
        await Profissional.create({
          nome: funcionario.nome,
          email: funcionario.email,
          tipoProfissional: funcionario.tipoProfissional,
          dataNascimento: dataHoje,
          dataAdmissao: dataHoje,
          roleId: funcionario.roleId,
          password: hashedPassword,
        });
      }
    }

    // Inicializar Paciente Padrão
    const pacienteExistente = await Paciente.findOne({ where: { cpf: "398.141.398-90" } });
    if (!pacienteExistente) {
      await Paciente.create({
        cpf: "398.141.398-90",
        nome: "Pedro",
        sobrenome: "Castelão",
        sexo: "M",
        dataNascimento: "1995-05-15",
        email: "castelao.pedro2@gmail.com",
        endereco: "Av Manoel Guirado Segura, 647",
        telefone: "(18) 98822-0819"
      });
    }

    // Inicializar Medicamento Padrão
    const medicamentoExistente = await Medicamento.findOne({ where: { nomeMedicamento: "Paracetamol" } });
    if (!medicamentoExistente) {
      await Medicamento.create({
        nomeMedicamento: "Paracetamol",
        controlado: "Medicamento Não Controlado",
        nomeFabricante: "Paracetamol S.A.",
        descricao: "Analgésico e antitérmico",
        instrucaoUso: "Tomar 1 comprimido a cada 6 horas se houver febre ou dor.",
        interacao: "Evitar consumo de álcool durante o uso."
      });
    }

    // Inicializar Tipo de Exame Padrão
    const exameExistente = await TiposExames.findOne({ where: { nomeTipoExame: "Hemograma Completo" } });
    if (!exameExistente) {
      await TiposExames.create({
        codigo: "EX01",
        nomeTipoExame: "Hemograma Completo",
        materialColetado: "Sangue total",
        tempoJejum: "4 horas",
        categoria: "Laboratorial",
        observacao: "Não realizar esforço físico antes da coleta."
      });
    }

    // 1. Inicializar Plano de Saúde se vazio
    const planoCount = await PlanoDeSaude.count();
    if (planoCount === 0) {
      await PlanoDeSaude.create({
        nomeOperadora: "Unimed",
        codigoPlano: "UNIMED-001",
        tipoPlano: "Empresarial",
        status: "Ativo"
      });
      await PlanoDeSaude.create({
        nomeOperadora: "Bradesco Saúde",
        codigoPlano: "BRAD-002",
        tipoPlano: "Familiar",
        status: "Ativo"
      });
    }

    // 2. Inicializar Tipo de Consulta se vazio
    const tipoConsultaCount = await TipoConsulta.count();
    if (tipoConsultaCount === 0) {
      await TipoConsulta.create({
        nomeTipoConsulta: "Consulta de Rotina",
        descricao: "Consulta médica periódica para avaliação geral de saúde",
        especialidade: "Clínica Geral",
        duracaoEstimada: "30 minutos",
        requisitosEspecificos: "Nenhum",
        prioridade: "Baixa",
        dataCriacao: new Date(),
        status: "ativo"
      });
      await TipoConsulta.create({
        nomeTipoConsulta: "Consulta de Retorno",
        descricao: "Retorno do paciente para avaliação de exames ou acompanhamento",
        especialidade: "Clínica Geral",
        duracaoEstimada: "15 minutos",
        requisitosEspecificos: "Trazer exames anteriores",
        prioridade: "Média",
        dataCriacao: new Date(),
        status: "ativo"
      });
    }

    // Recupera referências para ligar dados fundamental
    const paciente = await Paciente.findOne({ where: { cpf: "398.141.398-90" } });
    const medico = await Profissional.findOne({ where: { email: "medico@medagenda.com" } });
    const tipoConsultaRotina = await TipoConsulta.findOne({ where: { nomeTipoConsulta: "Consulta de Rotina" } });
    const medicamentoParacetamol = await Medicamento.findOne({ where: { nomeMedicamento: "Paracetamol" } });
    const tipoExameHemograma = await TiposExames.findOne({ where: { nomeTipoExame: "Hemograma Completo" } });

    // 3. Inicializar Consultas, Checkins e Atendimentos se não houver consultas cadastros
    const consultaCount = await Consulta.count();
    if (consultaCount === 0 && paciente && medico && tipoConsultaRotina) {
      const dataAmanha = moment().add(1, "day").format("YYYY-MM-DD");
      const dataHoje = moment().format("YYYY-MM-DD");
      const dataOntem = moment().subtract(1, "day").format("YYYY-MM-DD");

      // Consulta Agendada (Amanhã)
      await Consulta.create({
        cpfPaciente: paciente.cpf,
        medicoId: medico.matricula,
        idTipoConsulta: tipoConsultaRotina.idTipoConsulta,
        dataConsulta: dataAmanha,
        horaConsulta: "10:00",
        prioridade: 1,
        motivo: "Consulta preventiva anual",
        responsavelAgendamento: "Atendente Padrão",
        status: "agendada"
      });

      // Consulta Check-in Realizado (Hoje)
      const consultaCheckin = await Consulta.create({
        cpfPaciente: paciente.cpf,
        medicoId: medico.matricula,
        idTipoConsulta: tipoConsultaRotina.idTipoConsulta,
        dataConsulta: dataHoje,
        horaConsulta: "14:30",
        prioridade: 2,
        motivo: "Febre constante e dor de garganta",
        responsavelAgendamento: "Atendente Padrão",
        status: "checkin_realizado"
      });

      if (consultaCheckin) {
        await CheckIn.create({
          consultaId: consultaCheckin.id,
          matriculaProfissional: medico.matricula,
          pressaoArterial: "12/8",
          temperatura: 38.3,
          peso: 75.0,
          altura: 1.78,
          observacoes: "Paciente relata calafrios.",
          prioridade: 1
        });
      }

      // Consulta Realizada (Ontem)
      const consultaRealizada = await Consulta.create({
        cpfPaciente: paciente.cpf,
        medicoId: medico.matricula,
        idTipoConsulta: tipoConsultaRotina.idTipoConsulta,
        dataConsulta: dataOntem,
        horaConsulta: "09:15",
        prioridade: 1,
        motivo: "Check-up de rotina trimestral",
        responsavelAgendamento: "Atendente Padrão",
        status: "realizada"
      });

      if (consultaRealizada) {
        await Atendimento.create({
          consultaId: consultaRealizada.id,
          diagnostico: "Amigdalite Bacteriana",
          prescricao: "Paracetamol 500mg de 6/6h por 3 dias se febre.",
          observacoes: "Solicitado hemograma completo."
        });
      }
    }

    // 4. Inicializar Receitas se vazio
    const receitaCount = await Receita.count();
    if (receitaCount === 0 && paciente && medico && medicamentoParacetamol) {
      const crypto = require("crypto");
      const batchId = crypto.randomUUID ? crypto.randomUUID() : "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d";
      await Receita.create({
        batchId,
        dosagem: "500mg",
        instrucaoUso: "Tomar 1 comprimido a cada 6 horas se houver febre ou dor de cabeça.",
        matriculaProfissional: medico.matricula,
        cpfPaciente: paciente.cpf,
        idMedicamento: medicamentoParacetamol.idMedicamento
      });
    }

    // 5. Inicializar Atestados se vazio
    const atestadoCount = await Atestado.count();
    if (atestadoCount === 0 && paciente && medico) {
      await Atestado.create({
        tipoAtestado: "Médico",
        motivo: "Afastamento temporário devido a sintomas gripais intensos",
        observacoes: "Paciente necessita de 2 dias de repouso absoluto.",
        status: "Ativo",
        cpfPaciente: paciente.cpf,
        matriculaProfissional: medico.matricula
      });
    }

    // 6. Inicializar Solicitação de Exames se vazio
    const solicitacaoCount = await SolicitacaoExames.count();
    if (solicitacaoCount === 0 && paciente && medico && tipoExameHemograma) {
      await SolicitacaoExames.create({
        nomeTipoExame: tipoExameHemograma.nomeTipoExame,
        periodo: "Urgente",
        dataRetorno: moment().add(3, "days").toDate(),
        dataSolicitacao: new Date(),
        justificativa: "Paciente com febre alta a esclarecer.",
        status: "Solicitado",
        matriculaProfissional: medico.matricula,
        cpfPaciente: paciente.cpf,
        idTipoExame: tipoExameHemograma.idTipoExame
      });
    }

  } catch (error) {
    console.error("Erro ao inicializar funcionários e dados padrão:", error);
  }
};

module.exports = inicializarFuncionariosPadrao;
