const { log } = require("console");
const Atestado = require("../model/gerarAtestados");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');

const criarAtestado = async (req, res) => {
  try {
    const { cpfPaciente, matriculaProfissional, tipoAtestado } = req.body;
    console.log(cpfPaciente, matriculaProfissional[0].matricula, tipoAtestado);

    // Criação do atestado no banco de dados
    const novoAtestado = await Atestado.create({
      cpfPaciente,
      matriculaProfissional: matriculaProfissional[0].matricula,
      tipoAtestado,
    });

    // Buscar os dados do paciente e profissional
    const paciente = await Paciente.findOne({ where: { cpf: cpfPaciente } });
    const profissional = await Profissional.findOne({ where: { matricula: matriculaProfissional[0].matricula } });

    // Criar o documento PDF em memória
    const doc = new PDFDocument();

    // Criar um array para armazenar os dados do PDF
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);

      // Definir os cabeçalhos para o download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=atestado_${novoAtestado.idAtestado}.pdf`);
      res.setHeader('Content-Length', pdfData.length);

      // Enviar o PDF como resposta com código 200
      res.status(200).send(pdfData);
    });

    const dataEmissao = new Date(novoAtestado.createdAt).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Para hora no formato 24 horas
    });

    // console.log(novoAtestado,paciente,profissional);
    

    // Adicionar conteúdo ao PDF
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

    // Finalizar o documento PDF
    doc.end();

  } catch (error) {
    console.error("Erro ao gerar atestado:", error.message);
    res.status(400).json({ error: "Erro ao gerar atestado." });
  }
};


// Função para listar todos os atestados
const lerAtestados = async (req, res) => {
  try {
    const atestados = await Atestado.findAll({
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

    res.status(200).json(atestados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para ler um atestado por ID
const lerAtestadoId = async (req, res) => {
  try {
    const id = req.params.id;
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
      return res.status(404).json({ message: "Atestado não encontrado!" });
    }

    res.status(200).json(atestado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para download do atestado como arquivo de texto
const downloadAtestado = async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar o atestado com os dados necessários
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
      return res.status(404).json({ message: "Atestado não encontrado!" });
    }

    // Formatar o conteúdo do arquivo
    let conteudo = `
      Atestado
      -------------------------
      Data de Emissão: ${new Date(atestado.createdAt).toLocaleDateString()}

      Paciente:
      CPF: ${atestado.Paciente.cpf}
      Nome: ${atestado.Paciente.nome} ${atestado.Paciente.sobrenome}

      Profissional:
      Matrícula: ${atestado.Profissional.matricula}
      Nome: ${atestado.Profissional.nome}

      Tipo de Atestado: ${atestado.tipoAtestado}
    `;

    // Definir o caminho e nome do arquivo
    const fileName = `atestado_${atestado.idAtestado}.txt`;
    const filePath = path.join(__dirname, "..", "downloads", fileName);

    // Criar a pasta downloads se não existir
    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    // Escrever o arquivo
    fs.writeFileSync(filePath, conteudo, "utf8");

    // Enviar o arquivo para download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Erro ao enviar o arquivo:", err.message);
        return res
          .status(500)
          .json({ error: "Erro ao fazer download do arquivo." });
      }

      // Remover o arquivo após o download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Erro ao remover o arquivo:", unlinkErr.message);
        }
      });
    });
  } catch (error) {
    console.error("Erro no download do atestado:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarAtestado,
  lerAtestados,
  lerAtestadoId,
  downloadAtestado,
};
