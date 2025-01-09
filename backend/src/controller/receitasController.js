const Receita = require("../model/receitas");
const Paciente = require("../model/paciente");
const Profissional = require("../model/profissionais");
const Medicamento = require("../model/medicamentos");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Função para criar uma nova receita
const criarReceita = async (req, res) => {
  try {
    const {
      cpfPaciente,
      matriculaProfissional,
      idMedicamento,
      dosagem,
      instrucaoUso,
    } = req.body;

    // Criação da receita
    const novaReceita = await Receita.create({
      cpfPaciente,
      matriculaProfissional,
      idMedicamento,
      dosagem,
      instrucaoUso,
    });

    // Gerar o PDF da receita
    const doc = new PDFDocument();

    // Caminho temporário para salvar o PDF
    const filePath = path.join(
      __dirname,
      "temp",
      `${novaReceita.idReceita}.pdf`
    );

    // Salvar o PDF em disco
    doc.pipe(fs.createWriteStream(filePath));

    // Adicionar conteúdo ao PDF
    doc.fontSize(18).text("Receita Médica", { align: "center" });
    doc.fontSize(12).text(`Paciente: ${novaReceita.cpfPaciente}`);
    doc.text(`Médico: ${novaReceita.matriculaProfissional}`);
    doc.text(`Medicamento: ${novaReceita.idMedicamento}`);
    doc.text(`Dosagem: ${novaReceita.dosagem}`);
    doc.text(`Instruções de uso: ${novaReceita.instrucaoUso}`);

    doc.end();

    // Após o PDF ser gerado, envie como resposta
    doc.on("finish", () => {
      res.download(filePath, `${novaReceita.id}.pdf`, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao enviar o arquivo." });
        }
      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Função para ler todas as receitas
const lerReceitas = async (req, res) => {
  try {
    const receitas = await Receita.findAll({
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          as: "profissional",
          attributes: ["matricula", "nome", "crm"],
        },
        {
          model: Medicamento,
          as: "medicamento",
          attributes: ["idMedicamento", "nome", "controlado", "interacao"],
        },
      ],
    });

    res.status(200).json(receitas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Função para ler uma receita por ID
const lerReceitaId = async (req, res) => {
  try {
    const id = req.params.id;
    const receita = await Receita.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          as: "medico",
          attributes: ["matricula", "nome"],
        },
        {
          model: Medicamento,
          as: "medicamento",
          through: {
            model: ReceitaMedicamentos,
            attributes: ["dosagem", "instrucaoUso"],
          },
          attributes: ["idMedicamento", "nome", "controlado", "interacao"],
        },
      ],
    });

    if (!receita) {
      return res.status(404).json({ message: "Receita não encontrada!" });
    }

    res.status(200).json(receita);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Função para atualizar uma receita
// const atualizarReceita = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { Paciente_matricula, Medico_matricula, medicamentos } = req.body;

//     const receita = await Receita.findByPk(id);
//     if (!receita) {
//       return res.status(404).json({ message: "Receita não encontrada!" });
//     }

//     // Atualizar os dados da receita
//     await receita.update({ Paciente_matricula, Medico_matricula });

//     // Atualizar medicamentos
//     if (medicamentos && Array.isArray(medicamentos)) {
//       // Remover associações antigas
//       await ReceitaMedicamentos.destroy({ where: { ReceitaId: id } });

//       // Adicionar novas associações
//       for (const med of medicamentos) {
//         await ReceitaMedicamentos.create({
//           ReceitaId: id,
//           MedicamentoId: med.idMedicamento,
//           dosagem: med.dosagem,
//           instrucaoUso: med.instrucaoUso,
//         });
//       }
//     }

//     const receitaAtualizada = await Receita.findByPk(id, {
//       include: [
//         {
//           model: Paciente,
//           as: "paciente",
//           attributes: ["cpf", "nome", "sobrenome"],
//         },
//         {
//           model: Profissional,
//           as: "medico",
//           attributes: ["matricula", "nome"],
//         },
//         {
//           model: Medicamento,
//           as: "medicamento",
//           through: {
//             model: ReceitaMedicamentos,
//             attributes: ["dosagem", "instrucaoUso"],
//           },
//           attributes: ["idMedicamento", "nome", "controlado", "interacao"],
//         },
//       ],
//     });

//     res.status(200).json({ message: "Receita atualizada com sucesso!", receitaAtualizada });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Função para excluir uma receita
// const excluirReceita = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const receita = await Receita.findByPk(id);

//     if (!receita) {
//       return res.status(404).json({ message: "Receita não encontrada!" });
//     }

//     await ReceitaMedicamentos.destroy({ where: { ReceitaId: id } });
//     await receita.destroy();

//     res.status(200).json({ message: "Receita excluída com sucesso!" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Função para download da receita como arquivo de texto
const downloadReceita = async (req, res) => {
  try {
    const id = req.params.id;

    // Buscar a receita com os dados necessários
    const receita = await Receita.findByPk(id, {
      include: [
        {
          model: Paciente,
          attributes: ["cpf", "nome", "sobrenome"],
        },
        {
          model: Profissional,
          attributes: ["matricula", "nome", "crm"],
        },
        {
          model: Medicamento,
          attributes: [
            "idMedicamento",
            "nomeMedicamento",
            "controlado",
            "interacao",
          ],
        },
      ],
    });

    if (!receita) {
      return res.status(404).json({ message: "Receita não encontrada!" });
    }

    // Formatar o conteúdo do arquivo
    let conteudo = `
      Receita Médica
      -------------------------
      Data de Emissão: ${new Date(receita.createdAt).toLocaleDateString()}

      Paciente:
      CPF: ${receita.Paciente.cpf}
      Nome: ${receita.Paciente.nome} ${receita.Paciente.sobrenome}

      Médico:
      CRM: ${receita.Profissional.crm}
      Nome: ${receita.Profissional.nome}

      Medicamentos:
      Nome: ${receita.Medicamento.nomeMedicamento}
      Dosagem: ${receita.dosagem}
      Instrução de Uso: ${receita.instrucao}
    `;

    // Definir o caminho e nome do arquivo
    const fileName = `receita_${receita.idReceita}.txt`;
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
    console.error("Erro no download da receita:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  criarReceita,
  lerReceitas,
  lerReceitaId,
  // atualizarReceita,
  // excluirReceita,
  downloadReceita,
};
