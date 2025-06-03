// emailServices.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Carrega as variáveis do .env

// Sua configuração de transporte existente. Não precisa mudar nada aqui.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Defina no .env o e-mail do remetente
    pass: process.env.EMAIL_PASSWORD, // Defina no .env a senha do e-mail
  },
});

// Sua função existente para senha provisória.
const enviarSenhaProvisoria = async (email, senhaProvisoria) => {
  try {
    const mailOptions = {
      from: `"MedAgenda" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Sua senha provisória",
      text: `Bem-vindo! Sua senha provisória é: ${senhaProvisoria}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar o e-mail de senha:", error);
  }
};

// --- ADICIONE ESTA NOVA FUNÇÃO ABAIXO ---

/**
 * Envia um e-mail de lembrete de consulta.
 * @param {object} consulta - O objeto de consulta do Sequelize com includes (paciente, medico, tipoConsulta).
 */
const enviarEmailDeLembrete = async (consulta) => {
  // Verifica se o paciente tem um e-mail cadastrado
  if (!consulta.paciente?.email) {
    console.log(`Paciente ${consulta.paciente?.nome} não possui e-mail.`);
    return;
  }

  // Formata a data para o padrão brasileiro
  const dataFormatada = new Date(consulta.dataConsulta).toLocaleDateString(
    "pt-BR",
    { timeZone: "America/Sao_Paulo" }
  );

  const mailOptions = {
    from: `"MedAgenda" <${process.env.EMAIL_USER}>`,
    to: consulta.paciente.email,
    subject: `Lembrete de Consulta - ${dataFormatada} às ${consulta.horaConsulta}`,
    html: `
      <h1>Olá, ${consulta.paciente.nome}!</h1>
      <p>Este é um lembrete para a sua consulta agendada.</p>
      <hr>
      <p><strong>Médico(a):</strong> ${consulta.medico.nome}</p>
      <p><strong>Tipo da Consulta:</strong> ${consulta.tipoConsulta.nomeTipoConsulta}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Hora:</strong> ${consulta.horaConsulta}</p>
      <hr>
      <p>Por favor, não se atrase. Se precisar cancelar ou reagendar, entre em contato.</p>
      <p>Atenciosamente,<br>Equipe MedAgenda</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail de lembrete enviado para: ${consulta.paciente.email}`);
  } catch (error) {
    console.error(
      `Erro ao enviar e-mail de lembrete para ${consulta.paciente.email}:`,
      error
    );
  }
};

// CORREÇÃO: Exporte ambas as funções
module.exports = {
  enviarSenhaProvisoria,
  enviarEmailDeLembrete,
};
