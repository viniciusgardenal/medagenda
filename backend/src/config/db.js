require("dotenv").config({ path: ".env.development" }); // Carregar variáveis do .env.development

const { Sequelize } = require("sequelize");
const path = require("path");

const dbDialect = process.env.DB_DIALECT || "sqlite";

let sequelize;

if (dbDialect === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "../../database.sqlite"),
    logging: false
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME, // Nome do banco
    process.env.DB_USER, // Usuário
    process.env.DB_PASSWORD, // Senha
    {
      host: process.env.DB_HOST, // Host
      dialect: "mysql", // Dialeto do banco de dados
      logging: false // log desativado, caso queira usar no ambiente DEV, apenas passe false
    }
  );
}

// Verificar se a conexão foi estabelecida com sucesso
sequelize
  .authenticate()
  .then(() => {
    //console.log("Conexão com o banco de dados foi estabelecida com sucesso.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });



module.exports = sequelize;
