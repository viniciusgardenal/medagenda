const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const sequelize = require("./config/db");

// Carregar as variáveis de ambiente com base no ambiente
const env = process.env.NODE_ENV || "development";
const envFilePath = path.join(__dirname, `../.env.${env}`);
dotenv.config({ path: envFilePath });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Habilitar CORS
app.use(express.json());

// 1. Importar as rotas
const authRoutes = require("./routes/authRoutes");

// 2. importação Rotas
//Funções Basicas
const profissionalRoutes = require("./routes/profissionalRoutes");
const Roles = require("./model/roles");
const Permissao = require("./model/permissao");
const tiposExames = require("./routes/tiposExamesRoutes");
const medicamentoRoutes = require("./routes/medicamentosRoutes");
const pacienteRoutes = require("./routes/pacienteRoutes");
const planoDeSaudeRoutes = require("./routes/planoDeSaudeRoutes");
const autenticar = require("./middlewares/autenticar");

// 3. Funções Fundamentais
const solicitacaoExamesRoutes = require("./routes/solicitacaoExamesRoutes");
const receitasRoutes = require("./routes/receitasRoutes");
const tipoConsulta = require("./routes/tipoConsultaRoutes");
const gerarAtestados = require("./routes/gerarAtestadosRoutes");
const registroResultadoExames = require("./routes/registroResultadoExamesRoutes");

// 2. Usar as rotas
app.use("/auth", authRoutes);

// 2. Usar as rotas
app.use("/", autenticar, profissionalRoutes);
app.use("/", autenticar, tiposExames);
app.use("/", autenticar, tipoConsulta);
app.use("/", autenticar, pacienteRoutes);

app.use("/", autenticar, medicamentoRoutes);
app.use("/", autenticar, planoDeSaudeRoutes);

//Funções Fundamentais
app.use("/", medicamentoRoutes);
app.use("/", autenticar, solicitacaoExamesRoutes);
app.use("/", autenticar, receitasRoutes);
app.use("/", autenticar, gerarAtestados);
app.use("/", autenticar, registroResultadoExames);

// Configurar relação many-to-many
Roles.belongsToMany(Permissao, {
  through: "rolePermissao", // Nome da tabela intermediária
  as: "permissoes", // Alias para facilitar acesso às permissões do role
  foreignKey: "roleId", // Chave estrangeira em role_permissions que referencia Role
});

Permissao.belongsToMany(Roles, {
  through: "rolePermissao", // Nome da tabela intermediária
  as: "roles", // Alias para facilitar acesso aos roles da permission
  foreignKey: "permissionId", // Chave estrangeira em role_permissions que referencia Permission
});

// Sincronização do banco de dados com o Sequelize
const inicializarDados = require("./services/iniciarlizarPermissaoRoles");
const inicializarFuncionarioPadrao = require("./services/inicializarFuncionarioPadrao ");
sequelize
  .sync({ force: false })
  .then(async () => {
    //console.log("Banco de dados sincronizado");

    await inicializarDados();
    await inicializarFuncionarioPadrao();
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco de dados:", error);
  });

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
