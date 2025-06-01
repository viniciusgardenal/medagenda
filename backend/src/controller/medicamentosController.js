const Medicamento = require("../model/medicamentos.js");
const ExcelJS = require("exceljs"); // Import exceljs

const cadastrarMedicamento = async (req, res) => {
  try {
    const novoMedicamento = await Medicamento.create(req.body);
    res.status(201).json(novoMedicamento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const lerMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      order: [['nomeMedicamento', 'ASC'], ['descricao', 'ASC']],
    });
    res.status(200).json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const lerMedicamentosId = async (req, res) => {
  try {
    const id = req.params.id;
    const medicamento = await Medicamento.findByPk(id);

    if (medicamento) res.status(200).json(medicamento);
    else res.status(404).json({ message: "Medicamento não encontrado!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMedicamentos = async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizado = req.body;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento)
      return res.status(404).json({ message: "Medicamento não encontrado!" });

    await medicamento.update(dadosAtualizado);
    res
      .status(200)
      .json({ message: "Medicamento atualizado com sucesso!", medicamento });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const excluirMedicamentos = async (req, res) => {
  try {
    const id = req.params.id;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento)
      res.status(404).json({ message: "Medicamento não encontrado!" });

    await medicamento.destroy();
    res.status(200).json({ message: "Medicamento excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateMedicamentosReport = async (req, res) => {
  try {
    // Fetch all medications, ordered by nomeMedicamento
    const medicamentos = await Medicamento.findAll({
      order: [['nomeMedicamento', 'ASC'], ['descricao', 'ASC']],
    });

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medicamentos");

    // Define columns with headers and keys matching the Medicamento model
    worksheet.columns = [
      { header: "ID", key: "idMedicamento", width: 10 },
      { header: "Nome do Medicamento", key: "nomeMedicamento", width: 30 },
      { header: "Controlado", key: "controlado", width: 15 },
      { header: "Fabricante", key: "nomeFabricante", width: 25 },
      { header: "Descrição", key: "descricao", width: 40 },
      { header: "Instruções de Uso", key: "instrucaoUso", width: 40 },
      { header: "Interações", key: "interacao", width: 40 },
      { header: "Criado Em", key: "createdAt", width: 20 },
      { header: "Atualizado Em", key: "updatedAt", width: 20 },
    ];

    // Apply styling to header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D3D3D3" }, // Light gray background
    };
    worksheet.getRow(1).alignment = { horizontal: "center" };

    // Add borders to header row
    const borderStyle = { style: "thin", color: { argb: "000000" } };
    worksheet.getRow(1).eachCell((cell) => {
      cell.border = {
        top: borderStyle,
        left: borderStyle,
        bottom: borderStyle,
        right: borderStyle,
      };
    });

    // Add data rows
    medicamentos.forEach((medicamento) => {
      worksheet.addRow({
        idMedicamento: medicamento.idMedicamento,
        nomeMedicamento: medicamento.nomeMedicamento,
        controlado: medicamento.controlado,
        nomeFabricante: medicamento.nomeFabricante,
        descricao: medicamento.descricao,
        instrucaoUso: medicamento.instrucaoUso,
        interacao: medicamento.interacao,
        createdAt: medicamento.createdAt.toLocaleString(),
        updatedAt: medicamento.updatedAt.toLocaleString(),
      });
    });

    // Apply borders to data cells
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle,
          };
        });
      }
    });

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Relatorio_Medicamentos.xlsx"
    );

    // Stream the Excel file to the response
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  cadastrarMedicamento,
  lerMedicamentos,
  lerMedicamentosId,
  updateMedicamentos,
  excluirMedicamentos,
  generateMedicamentosReport,
};
