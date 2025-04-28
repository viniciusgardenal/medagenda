const { log } = require("console");
const Atestado = require("../model/gerarAtestados");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');

const criarAtestado = async (req, res) => {
  try {
    const { cpfPaciente, matriculaProfissional, tipoAtestado, motivo, observacoes, status } = req.body;

    const novoAtestado = await Atestado.create({
      cpfPaciente,
      matriculaProfissional: matriculaProfissional[0].matricula,
      tipoAtestado,
      motivo,
      observacoes,
      status: status || "Ativo",
    });

    const paciente = await Paciente.findOne({ where: { cpf: cpfPaciente } });
    const profissional = await Profissional.findOne({ where: { matricula: matriculaProfissional[0].matricula } });

    const doc = new PDFDocument();

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=atestado_${novoAtestado.idAtestado}.pdf`);
      res.setHeader('Content-Length', pdfData.length);
      res.status(200).send(pdfData);
    });

    const dataEmissao = new Date(novoAtestado.dataEmissao).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    doc.fontSize(25).text('Atestado', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Data de Emissão: ${dataEmissao}`);
    doc.moveDown();
    doc.text(`Paciente: ${paciente.nome} ${paciente.sobrenome}`);
    doc.text(`CPF: ${paciente.cpf}`);
    doc.moveDown();
    doc.text(`Profissional: ${profissional.nome}`);
    doc.text(`Matrícula: ${profissional.matricula}`);
    doc.moveDown();
    doc.text(`Tipo de Atestado: ${tipoAtestado}`);
    if (motivo) {
      doc.moveDown();
      doc.text(`Motivo: ${motivo}`);
    }
    if (observacoes) {
      doc.moveDown();
      doc.text(`Observações: ${observacoes}`);
    }
    doc.moveDown();
    doc.text(`Status: ${novoAtestado.status}`);

    doc.end();

  } catch (error) {
    console.error("Erro ao gerar atestado:", error.message, error.stack);
    res.status(400).json({ error: "Erro ao gerar atestado." });
  }
};

const lerAtestados = async (req, res) => {
  try {
    console.log("Buscando atestados...");
    const atestados = await Atestado.findAll({
      include: [
        {
          model: Paciente,
          as: "Paciente", // Certificar que o alias está correto
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          as: "Profissional", // Certificar que o alias está correto
          attributes: ["matricula", "nome"],
        },
      ],
    });

    console.log("Atestados encontrados:", JSON.stringify(atestados, null, 2));
    res.status(200).json(atestados);
  } catch (error) {
    console.error("Erro ao listar atestados:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

const lerAtestadoId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Buscando atestado com ID: ${id}`);
    const atestado = await Atestado.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: "Paciente",
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          as: "Profissional",
          attributes: ["matricula", "nome"],
        },
      ],
    });

    if (!atestado) {
      console.log(`Atestado com ID ${id} não encontrado.`);
      return res.status(404).json({ message: "Atestado não encontrado!" });
    }

    res.status(200).json(atestado);
  } catch (error) {
    console.error("Erro ao buscar atestado por ID:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

const downloadAtestado = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Iniciando download do atestado com ID: ${id}`);

    const atestado = await Atestado.findByPk(id, {
      include: [
        {
          model: Paciente,
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          attributes: ["matricula", "nome"],
        },
      ],
    });

    if (!atestado) {
      console.log(`Atestado com ID ${id} não encontrado para download.`);
      return res.status(404).json({ message: "Atestado não encontrado!" });
    }

    let conteudo = `
      Atestado
      -------------------------
      Data de Emissão: ${new Date(atestado.dataEmissao).toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })}

      Paciente:
      CPF: ${atestado.Paciente.cpf}
      Nome: ${atestado.Paciente.nome} ${atestado.Paciente.sobrenome}

      Profissional:
      Matrícula: ${atestado.Profissional.matricula}
      Nome: ${atestado.Profissional.nome}

      Tipo de Atestado: ${atestado.tipoAtestado}
      Motivo: ${atestado.motivo || "Não informado"}
      Observações: ${atestado.observacoes || "Não informado"}
      Status: ${atestado.status}
    `;

    const fileName = `atestado_${atestado.idAtestado}.txt`;
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    fs.writeFileSync(filePath, conteudo, "utf8");

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Erro ao enviar o arquivo para download:", err.message, err.stack);
        return res
          .status(500)
          .json({ error: "Erro ao fazer download do arquivo." });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao remover o arquivo:", unlinkErr.message, unlinkErr.stack);
        }
      });
    });
  } catch (error) {
    console.error("Erro no download do atestado:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarAtestado,
  lerAtestados,
  lerAtestadoId,
  downloadAtestado,
};