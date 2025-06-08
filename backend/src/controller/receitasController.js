const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit'); // Importa o PDFKit
const Receita = require("../model/receitas");
const Paciente =require("../model/paciente");
const Profissional = require("../model/profissionais");
const Medicamento = require("../model/medicamentos");
const sequelize = require('../config/db');

// Função para criar a receita (sem alterações)
const criarReceita = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cpfPaciente, matriculaProfissional, medicamentos } = req.body;

    if (!cpfPaciente || !matriculaProfissional || !Array.isArray(medicamentos) || medicamentos.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: "Dados insuficientes para criar a receita." });
    }

    const batchId = uuidv4();

    const receitasParaCriar = medicamentos.map(med => {
      if (!med.idMedicamento || !med.dosagem || !med.instrucaoUso) {
        throw new Error('Cada medicamento deve conter id, dosagem e instrução de uso.');
      }
      return {
        cpfPaciente,
        matriculaProfissional,
        idMedicamento: med.idMedicamento,
        dosagem: med.dosagem,
        instrucaoUso: med.instrucaoUso,
        batchId,
      };
    });

    await Receita.bulkCreate(receitasParaCriar, { transaction: t });

    await t.commit();
    res.status(201).json({ message: "Receita criada com sucesso!", batchId });

  } catch (error) {
    await t.rollback();
    console.error("Erro ao criar receita:", error.message);
    res.status(500).json({ error: "Ocorreu um erro inesperado ao criar a receita." });
  }
};

// Função para ler as receitas (sem alterações)
const lerReceitas = async (req, res) => {
  try {
    const todosItens = await Receita.findAll({
      include: [
        { model: Paciente, as: "paciente", attributes: ["cpf", "nome", "sobrenome"] },
        { model: Profissional, as: "profissional", attributes: ["matricula", "nome", "crm"] },
        { model: Medicamento, as: "medicamento", attributes: ["idMedicamento", "nomeMedicamento"] },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!todosItens.length) {
      return res.status(200).json([]);
    }

    const receitasAgrupadas = todosItens.reduce((acc, item) => {
      if (!acc[item.batchId]) {
        acc[item.batchId] = {
          batchId: item.batchId,
          paciente: item.paciente,
          profissional: item.profissional,
          createdAt: item.createdAt,
          medicamentos: [],
        };
      }
      acc[item.batchId].medicamentos.push({
        idMedicamento: item.medicamento.idMedicamento,
        nomeMedicamento: item.medicamento.nomeMedicamento,
        dosagem: item.dosagem,
        instrucaoUso: item.instrucaoUso,
      });
      return acc;
    }, {});

    res.status(200).json(Object.values(receitasAgrupadas));
  } catch (error) {
    console.error("Erro ao ler receitas:", error.message);
    res.status(500).json({ error: "Erro ao carregar receitas." });
  }
};

// **FUNÇÃO DE DOWNLOAD ATUALIZADA PARA GERAR PDF**
const downloadReceita = async (req, res) => {
  try {
    const { batchId } = req.params;
    const itens = await Receita.findAll({
      where: { batchId },
      include: [
        { model: Paciente, as: "paciente" },
        { model: Profissional, as: "profissional" },
        { model: Medicamento, as: "medicamento" },
      ],
    });

    if (itens.length === 0) {
      return res.status(404).json({ message: "Receita não encontrada!" });
    }

    // Inicia a criação do documento PDF
    const doc = new PDFDocument({ size: 'A5', margin: 40 });

    const { paciente, profissional, createdAt } = itens[0];
    const fileName = `receita_${paciente.nome.split(' ')[0]}_${batchId.substring(0, 8)}.pdf`;

    // Configura os headers da resposta para indicar que é um arquivo PDF para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Conecta o PDF diretamente à resposta. Não cria arquivo no servidor.
    doc.pipe(res);

    // --- Montagem do Conteúdo do PDF ---

    // Cabeçalho
    doc.font('Helvetica-Bold').fontSize(16).text('RECEITUÁRIO MÉDICO', { align: 'center' });
    doc.moveDown(2);

    // Informações do Paciente
    doc.fontSize(11).font('Helvetica-Bold').text('Paciente:');
    doc.font('Helvetica').text(`${paciente.nome} ${paciente.sobrenome}`);
    doc.font('Helvetica-Bold').text('CPF:').font('Helvetica').text(paciente.cpf);
    doc.moveDown();

    // Prescrição
    doc.fontSize(12).font('Helvetica-Bold').text('Prescrição:', { underline: true });
    doc.moveDown(0.5);

    // Lista de medicamentos
    itens.forEach((item, index) => {
        doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${item.medicamento.nomeMedicamento}`);
        
        doc.fontSize(10).font('Helvetica').text(`Dosagem: ${item.dosagem}`, { indent: 20 });
        doc.fontSize(10).font('Helvetica').text(`Instruções: ${item.instrucaoUso}`, { indent: 20 });
        doc.moveDown(1);
    });
    
    // Rodapé e Assinatura (posicionado mais abaixo na página)
    const pageBottom = doc.page.height - 100;
    doc.fontSize(10).font('Helvetica').text(`Data de Emissão: ${new Date(createdAt).toLocaleDateString('pt-BR')}`, 40, pageBottom - 20, { align: 'left' });

    doc.fontSize(10).font('Helvetica').text('_________________________', { align: 'center' });
    doc.font('Helvetica-Bold').text(profissional.nome, { align: 'center' });
    doc.font('Helvetica').text(`CRM: ${profissional.crm}`, { align: 'center' });
    
    // Finaliza o PDF e o envio
    doc.end();

  } catch (error) {
    console.error("Erro no download da receita em PDF:", error.message);
    res.status(500).json({ error: "Erro interno ao gerar o PDF da receita." });
  }
};


module.exports = {
  criarReceita,
  lerReceitas,
  downloadReceita,
};