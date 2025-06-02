const CheckIn = require("../model/checkin");
const Consulta = require("../model/consulta");
const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");

exports.realizarCheckIn = async (req, res) => {
  try {
    const {
      consultaId,
      horaChegada,
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade,
      matriculaProfissional,
    } = req.body;

    // Validar consulta
    const consulta = await Consulta.findByPk(consultaId);
    if (!consulta) {
      return res.status(404).json({ message: "Consulta não encontrada" });
    }

    // Verificar atraso (>30 minutos)
    const horaConsulta = new Date(
      `${consulta.dataConsulta}T${consulta.horaConsulta}`
    );
    const horaChegadaDate = new Date(horaChegada || Date.now());
    const diffMinutes = (horaChegadaDate - horaConsulta) / 1000 / 60;
    if (diffMinutes > 30) {
      return res.status(400).json({
        message:
          "Atraso superior a 30 minutos. Consulta deve ser cancelada ou autorizada manualmente.",
      });
    }

    // Sugerir prioridade com base em sinais vitais
    let suggestedPriority = prioridade || 0;
    if (temperatura && temperatura > 38) {
      suggestedPriority = 2; // Alta prioridade para febre alta
    } else if (
      pressaoArterial &&
      /1[8-9][0-9]\/1[0-1][0-9]/.test(pressaoArterial)
    ) {
      suggestedPriority = Math.max(suggestedPriority, 1); // Média prioridade para pressão alta
    }

    // Criar check-in
    const checkIn = await CheckIn.create({
      consultaId,
      horaChegada: horaChegada || Date.now(),
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade: suggestedPriority,
      matriculaProfissional,
    });

    // Atualizar status da consulta
    consulta.status = "checkin_realizado";
    await consulta.save();

    res.status(201).json({
      message: "Check-in realizado com sucesso",
      checkIn,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erro ao realizar check-in", error: error.message });
  }
};

exports.getCheckIn = async (req, res) => {
  try {
    const medicoId = req.user.id; // ID do médico logado
    const data = new Date().toISOString().split("T")[0]; // Data atual

    const checkIns = await CheckIn.findAll({
      include: [
        {
          model: Consulta,
          as: "consulta",
          where: { medicoId, dataConsulta: data, status: "checkin_realizado" },
        },
      ],
      order: [
        ["prioridade", "DESC"],
        ["horaChegada", "ASC"],
      ],
    });

    res.status(200).json(checkIns);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao listar fila de atendimento",
      error: error.message,
    });
  }
};

exports.getCheckInConsultas = async (req, res) => {
  try {
    const { consultaId } = req.params;

    const checkIn = await CheckIn.findOne({
      where: { consultaId },
      include: [{ model: Consulta, as: "consulta" }],
    });

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in não encontrado" });
    }

    // Verificar permissão do médico
    if (req.user.id !== checkIn.consulta.medicoId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    res.status(200).json(checkIn);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao listar check-in",
      error: error.message,
    });
  }
};

exports.gerarRelatorioCheckIns = async (req, res) => {
 try {
    const checkIns = await CheckIn.findAll({
      include: [
        {
          model: Consulta,
          as: "consulta",
          include: [
            { model: Paciente, as: "paciente" },
            { model: Profissional, as: "medico" },
          ],
        },
        { model: Profissional, as: "profissional" },
      ],
      order: [["horaChegada", "ASC"]],
    });

    // Criar planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório de Check-Ins");

    // Definir colunas
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Paciente", key: "paciente", width: 30 },
      { header: "Médico", key: "medico", width: 30 },
      { header: "Data Consulta", key: "dataConsulta", width: 15 },
      { header: "Hora Consulta", key: "horaConsulta", width: 12 },
      { header: "Hora Chegada", key: "horaChegada", width: 20 },
      { header: "Pressão Arterial", key: "pressaoArterial", width: 15 },
      { header: "Temperatura (°C)", key: "temperatura", width: 12 },
      { header: "Peso (kg)", key: "peso", width: 10 },
      { header: "Altura (m)", key: "altura", width: 10 },
      { header: "Prioridade", key: "prioridade", width: 12 },
      { header: "Observações", key: "observacoes", width: 40 },
      { header: "Profissional", key: "profissional", width: 30 },
    ];

    // Estilizar cabeçalhos
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFADD8E6" }, // Azul claro
    };

    // Adicionar dados
    checkIns.forEach((checkIn) => {
      const prioridade = checkIn.prioridade === 0 ? "Normal" : checkIn.prioridade === 1 ? "Média" : "Alta";
      worksheet.addRow({
        id: checkIn.id,
        paciente: checkIn.consulta?.paciente ? `${checkIn.consulta.paciente.nome} ${checkIn.consulta.paciente.sobrenome}` : "N/A",
        medico: checkIn.consulta?.medico ? `${checkIn.consulta.medico.nome} (${checkIn.consulta.medico.crm})` : "N/A",
        dataConsulta: checkIn.consulta?.dataConsulta || "N/A",
        horaConsulta: checkIn.consulta?.horaConsulta?.slice(0, 5) || "N/A",
        horaChegada: checkIn.horaChegada ? new Date(checkIn.horaChegada).toLocaleString("pt-BR") : "N/A",
        pressaoArterial: checkIn.pressaoArterial || "N/A",
        temperatura: checkIn.temperatura || "N/A",
        peso: checkIn.peso || "N/A",
        altura: checkIn.altura || "N/A",
        prioridade,
        observacoes: checkIn.observacoes || "N/A",
        profissional: checkIn.profissional?.nome || "N/A",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=relatorio_checkins.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Erro ao gerar relatório de check-ins:", error);
    res.status(500).json({
      message: "Erro ao gerar relatório de check-ins",
      error: error.message,
    });
  }
};

exports.atualizarCheckIn = async (req, res) => {
  try {
    const { id } = req.params; // ID do check-in a ser atualizado
    const {
      pressaoArterial,
      temperatura,
      peso,
      altura,
      observacoes,
      prioridade,
      // Você pode querer permitir a atualização de outros campos, mas horaChegada
      // e consultaId provavelmente não devem ser alterados em uma edição
    } = req.body;

    const checkIn = await CheckIn.findByPk(id);

    if (!checkIn) {
      return res.status(404).json({ message: "Check-in não encontrado." });
    }

    // Atualiza os campos do check-in
    checkIn.pressaoArterial = pressaoArterial;
    checkIn.temperatura = temperatura;
    checkIn.peso = peso;
    checkIn.altura = altura;
    checkIn.observacoes = observacoes;
    checkIn.prioridade = prioridade;
    // Se você adicionou o campo 'status' no CheckIn, pode atualizá-lo aqui também, se necessário.
    // checkIn.status = 'atualizado'; // Exemplo

    await checkIn.save(); // Salva as alterações no banco de dados

    res.status(200).json({ message: "Check-in atualizado com sucesso.", checkIn });
  } catch (error) {
    console.error("Erro ao atualizar check-in:", error);
    res.status(500).json({ message: "Erro ao atualizar check-in", error: error.message });
  }
};