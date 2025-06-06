// /controller/gerarAtestadosController.js

const Atestado = require("../model/gerarAtestados.js");
const Profissional = require("../model/profissionais.js");
const Paciente = require("../model/paciente.js")
const PDFDocument = require('pdfkit'); // Importe o PDFKit aqui

/**
 * Função auxiliar para gerar o PDF.
 * Evita a duplicação de código entre 'criar' e 'download'.
 */
const gerarPdfStream = (atestado, paciente, profissional) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // --- Cabeçalho ---
      doc.fontSize(20).text('Atestado Médico', { align: 'center' });
      doc.moveDown(2);

      // --- Corpo do Atestado ---
      const textoAtestado = `Atesto, para os devidos fins, que o(a) paciente ${paciente.nome} ${paciente.sobrenome}, portador(a) do CPF nº ${paciente.cpf}, esteve sob meus cuidados profissionais na data de hoje, necessitando de afastamento de suas atividades pelo motivo de ${atestado.motivo || 'consulta médica'}.`;

      doc.fontSize(12).text(textoAtestado, {
        align: 'justify',
        indent: 20,
        lineGap: 7,
      });
      doc.moveDown();

      if (atestado.observacoes) {
        doc.fontSize(12).text(`Observações: ${atestado.observacoes}`, {
          align: 'justify',
          lineGap: 7,
        });
        doc.moveDown();
      }

      doc.moveDown(3);

      // --- Data e Assinatura ---
      const dataEmissao = new Date(atestado.dataEmissao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      // Usando a data atual para o local
      const hoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      doc.fontSize(12).text(`Presidente Prudente, ${hoje}`, { align: 'center' });
      doc.moveDown(3);

      doc.fontSize(12).text('________________________________', { align: 'center' });
      doc.text(profissional.nome, { align: 'center' });
      // Supondo que o profissional tenha um campo crm ou conselho
      doc.text(`CRM/SP: ${profissional.crm || 'Não especificado'}`, { align: 'center' }); 
      doc.text(`Matrícula: ${profissional.matricula}`, { align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};


const criarAtestado = async (req, res) => {
  try {
    const { cpfPaciente, matriculaProfissional, tipoAtestado, motivo, observacoes } = req.body;

    if (!cpfPaciente || !matriculaProfissional || !tipoAtestado) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
    }

    const paciente = await Paciente.findOne({ where: { cpf: cpfPaciente } });
    if (!paciente) return res.status(404).json({ error: "Paciente não encontrado." });

    const profissional = await Profissional.findOne({ where: { matricula: matriculaProfissional } });
    if (!profissional) return res.status(404).json({ error: "Profissional não encontrado." });

    const novoAtestado = await Atestado.create({
      cpfPaciente,
      matriculaProfissional,
      tipoAtestado,
      motivo,
      observacoes,
      status: "Ativo",
    });

    // --- LÓGICA DO PDF INTEGRADA ---
    const pdfData = await gerarPdfStream(novoAtestado, paciente, profissional);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=atestado_${novoAtestado.idAtestado}.pdf`);
    res.status(201).send(pdfData);

  } catch (error) {
    console.error("Erro ao gerar atestado:", error);
    res.status(500).json({ error: "Erro interno ao gerar atestado." });
  }
};

const lerAtestados = async (req, res) => {
  // ... (função sem alterações)
  try {
    const atestados = await Atestado.findAll({
      include: ["paciente", "profissional"],
      order: [['dataEmissao', 'DESC']],
    });
    res.status(200).json(atestados);
  } catch (error) {
    console.error("Erro ao listar atestados:", error);
    res.status(500).json({ error: error.message });
  }
};

const lerAtestadoId = async (req, res) => {
    // ... (função sem alterações)
  try {
    const { id } = req.params;
    const atestado = await Atestado.findByPk(id, {
      include: ["paciente", "profissional"],
    });

    if (!atestado) {
      return res.status(404).json({ message: "Atestado não encontrado!" });
    }
    res.status(200).json(atestado);
  } catch (error) {
    console.error("Erro ao buscar atestado por ID:", error);
    res.status(500).json({ error: error.message });
  }
};

const downloadAtestadoPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const atestado = await Atestado.findByPk(id, {
      include: ["paciente", "profissional"],
    });

    if (!atestado) {
      return res.status(404).json({ message: "Atestado não encontrado." });
    }

    // --- LÓGICA DO PDF INTEGRADA (REUTILIZANDO A FUNÇÃO AUXILIAR) ---
    const pdfData = await gerarPdfStream(atestado, atestado.paciente, atestado.profissional);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=atestado_${atestado.idAtestado}.pdf`);
    res.status(200).send(pdfData);

  } catch (error) {
    console.error("Erro no download do atestado:", error);
    res.status(500).json({ error: "Erro interno ao gerar o PDF para download." });
  }
};

module.exports = {
  criarAtestado,
  lerAtestados,
  lerAtestadoId,
  downloadAtestadoPdf,
};