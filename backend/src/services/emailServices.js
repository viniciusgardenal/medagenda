// emailService.js
const nodemailer = require("nodemailer");

// //console.log("Email:", process.env.EMAIL_USER);
// //console.log("Senha:", process.env.EMAIL_PASSWORD);

const transporter = nodemailer.createTransport({
  service: "gmail", // Use o serviço de e-mail desejado, como Gmail, Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // Defina no .env o e-mail do remetente
    pass: process.env.EMAIL_PASSWORD, // Defina no .env a senha do e-mail
  },
});

const enviarSenhaProvisoria = async (email, senhaProvisoria) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Sua senha provisória",
      text: `Bem-vindo! Sua senha provisória é: ${senhaProvisoria}`,
    };

    await transporter.sendMail(mailOptions);
    //console.log("E-mail enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
  }
};

module.exports = { enviarSenhaProvisoria };
