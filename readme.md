# MedAgenda - Sistema Integrado de Gestão Clínica e Consultórios Médicos

<p align="center">
  <strong>Trabalho de Conclusão de Curso (TCC) — Engenharia de Software</strong><br>
  Universidade do Oeste Paulista (UNOESTE)<br>
  Presidente Prudente – SP
</p>

---

## 📌 Sobre o Projeto

O **MedAgenda** é uma solução Full-Stack desenvolvida como projeto final de graduação em Engenharia de Software. O objetivo do sistema é modernizar e otimizar os fluxos operacionais, clínicos e administrativos de clínicas e consultórios médicos multidisciplinares.

A plataforma substitui processos manuais e fragmentados por um ambiente digital centralizado, seguro e intuitivo, integrando recepção, corpo médico e direção em um único ecossistema com controle de acesso baseado em papéis (**RBAC - Role-Based Access Control**).

---

## 🏗️ Arquitetura do Sistema

O sistema adota uma arquitetura em camadas orientada a serviços com desacoplamento total entre cliente e servidor:

```
┌────────────────────────────────────────────────────────┐
│               Frontend (SPA - React.js)               │
│      React 18 + React Router v6 + React-Bootstrap      │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST API (JSON)
                            │ Bearer JWT Authentication
┌───────────────────────────▼────────────────────────────┐
│               Backend (Node.js + Express)              │
│       Controllers + Middlewares (Auth / RBAC)          │
│       Jobs (Node-Cron) + Services (Email / PDFKit)     │
└───────────────────────────┬────────────────────────────┘
                            │ ORM (Sequelize)
┌───────────────────────────▼────────────────────────────┐
│               Banco de Dados (MySQL)                   │
│        Tabelas Relacionais + Constraints + Enums       │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Módulos e Funcionalidades

O sistema estrutura suas operações em dois grandes blocos funcionais, além do núcleo de segurança:

### 1. 🔐 Núcleo de Autenticação e Controle de Acesso (RBAC)
- **Autenticação Segura via JWT**: Geração de tokens com expiração e criptografia de senhas com `bcryptjs`.
- **Perfis de Usuário**:
  - **Diretor**: Acesso irrestrito a cadastros gerenciais, profissionais, planos de saúde, escalas e registros de óbito.
  - **Médico**: Acesso à agenda de consultas, realização de atendimentos clínicos, solicitação de exames, emissão de receitas e atestados.
  - **Atendente**: Recepção, cadastro de pacientes, agendamento de consultas e triagem (check-in).
- **Proteção de Rotas**: Validação dupla no Frontend (PrivateRoutes baseadas em permissões) e no Backend (middlewares `autenticar` e `checarPermissao`).

---

### 2. 📋 Funções Básicas (Cadastros & Parametrizações)
- **Gestão de Profissionais**: Cadastro completo com geração automática de senhas provisórias criptografadas, vínculo de tipo profissional (`Medico`, `Atendente`, `Diretor`) e notificação por e-mail.
- **Gestão de Pacientes**: Cadastro com validação de formato de CPF, dados demográficos, endereço, contato e vínculo a convênios médicos.
- **Catálogo de Medicamentos**: Registro de fármacos, descrição, interação medicamentosa, modo de uso e classificação (controlado vs. não controlado), com **exportação para relatório em Excel (`.xlsx`) via ExcelJS**.
- **Tipos de Exames**: Padronização dos exames complementares e instruções de preparo (jejum, observações).
- **Tipos de Consultas**: Configuração de especialidades e modalidades de atendimento.
- **Planos de Saúde**: Gerenciamento de convênios atendidos pela instituição.

---

### 3. 🩺 Funções Fundamentais (Operação Clínica & Atendimento)
- **Agendamento de Consultas**:
  - Marcação com prevenção de conflitos de horário para o mesmo profissional.
  - Cancelamento formal de consultas com obrigatoriedade de justificativa (`motivoCancelamento`).
  - Priorização de atendimento com ordenação visual na fila do dia.
- **Check-in e Triagem na Recepção**:
  - Registro de chegada com verificação de tolerância de atraso.
  - Triagem de sinais vitais: Pressão Arterial, Temperatura, Frequência Cardíaca, Saturação, Peso, Altura e Queixa Principal.
  - Sugestão automática de prioridade clínica baseada nos sinais vitais (ex: febre > 38°C ou crise hipertensiva).
  - **Exportação de relatório de check-ins em planilha Excel (`.xlsx`)**.
- **Registro e Realização de Atendimentos Clínicos**:
  - Fluxo de status da consulta (`agendada` ➔ `checkin_realizado` ➔ `em_atendimento` ➔ `realizada`).
  - Registro de anamnese, diagnóstico médico, prescrições e evolução clínica.
- **Emissão de Receitas Médicas**:
  - Prescrição de múltiplos medicamentos com dosagens e posologias específicas (vinculadas por `batchId`).
  - **Geração dinâmica de Receita Médica em PDF** estilizado via `PDFKit` para impressão ou download imediato.
- **Emissão de Atestados Médicos**:
  - Emissão formal de atestado com motivo/CID, período de repouso e recomendações.
  - **Geração dinâmica de Atestado em PDF** formatado com cabeçalho institucional, datação automática e espaço para assinatura/CRM do médico.
- **Solicitação e Registro de Exames**:
  - Pedido médico de exames diagnósticos com justificativa clínica e data de retorno prevista.
  - Registro e laudo dos resultados de exames realizados.
- **Grade e Escala de Horários dos Profissionais**:
  - Definição de horários de trabalho por dia da semana, turnos, intervalos de almoço e duração padrão de consulta.
  - Validações de consistência temporal (início < fim, intervalos contidos no período).
- **Registro Formal de Óbitos**:
  - Lançamento oficial de declaração de óbito com número de certidão, data/hora, causa mortis e médico responsável.
  - Atualização automática do status administrativo do paciente no sistema.
- **Notificações e Lembretes Automáticos**:
  - Rotina em segundo plano via `Node-Cron` executando a cada ciclo.
  - Envio automatizado de lembretes de consulta por e-mail aos pacientes via `Nodemailer`.

---

## 💻 Tecnologias Utilizadas

### Frontend
- **React.js 18**: Biblioteca base para a Single Page Application (SPA).
- **React Router Dom (v6)**: Gerenciamento declarativo de rotas públicas e protegidas.
- **Bootstrap 5 & React-Bootstrap**: Sistema de design, grid responsivo e modais.
- **Lucide React & React Icons**: Conjunto moderno de ícones vetoriais.
- **Axios**: Cliente HTTP com interceptors para injeção automática do Bearer Token.
- **React Hook Form & Yup**: Gerenciamento de formulários e schemas de validação.
- **Moment.js**: Manipulação e formatação localizada de datas/horas.

### Backend
- **Node.js**: Ambiente de execução JavaScript server-side.
- **Express.js (v4)**: Framework web minimalista para construção da API RESTful.
- **Sequelize ORM (v6)**: Modelagem de dados, validações a nível de entidade e relacionamentos.
- **MySQL2**: Driver de alta performance para conexão com o MySQL.
- **JSON Web Token (jsonwebtoken)**: Geração e verificação stateless de tokens de sessão.
- **BcryptJS**: Hashing seguro de senhas com sal (salt rounds).
- **PDFKit**: Geração programática de documentos PDF em stream de memória (receitas e atestados).
- **ExcelJS**: Geração e estilização de planilhas Excel para relatórios gerenciais.
- **Node-Cron**: Agendador de tarefas em background para rotinas automáticas.
- **Nodemailer**: Transporte SMTP para disparo de e-mails institucionais (Gmail API / SMTP).
- **Cross-Env**: Compatibilidade universal de variáveis de ambiente entre Windows, Linux e macOS.

### Banco de Dados
- **MySQL / MariaDB**: Banco de dados relacional compatível com XAMPP, WampServer ou MySQL Server nativo.

---

## ⚙️ Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 18 ou superior recomendada; mínimo 16)
- **NPM** (incluso no Node.js)
- **MySQL Server** (ou **XAMPP / MariaDB** em execução local)
- **Git**

---

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/viniciusgardenal/medagenda.git
cd medagenda
```

---

### Passo 2: Configurar o Banco de Dados MySQL
1. Inicie o serviço do MySQL (pelo painel do XAMPP ou via terminal).
2. Abra seu cliente MySQL favorito (phpMyAdmin, MySQL Workbench ou terminal) e crie o banco de dados:
   ```sql
   CREATE DATABASE medagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
> [!NOTE]
> O backend está configurado com `sequelize.sync({ force: false })`. Isso significa que, na primeira inicialização, o Sequelize **criará automaticamente todas as tabelas**, índices, papéis (`Roles`), permissões (`Permissões`) e os usuários padrão.
> 
> Se desejar importar dados de demonstração pré-existentes, você pode importar opcionalmente o arquivo SQL localizado em:
> `backend/src/config/medagenda.sql`

---

### Passo 3: Configurar as Variáveis de Ambiente do Backend
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie o arquivo `.env.development` com base no arquivo de exemplo `.env.exemplo`:
   ```bash
   # No Windows (PowerShell):
   Copy-Item .env.exemplo .env.development

   # No Linux / macOS / Git Bash:
   cp .env.exemplo .env.development
   ```
3. Abra o arquivo `.env.development` e ajuste as credenciais de acordo com o seu ambiente:
   ```env
   # Servidor
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=medagenda_chave_secreta_jwt_tcc_2025

   # Banco de Dados MySQL
   DB_HOST=localhost
   DB_NAME=medagenda
   DB_USER=root
   DB_PASSWORD=sua_senha_aqui

   # Envio de E-mails (Opcional para ambiente local)
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASSWORD=sua_senha_de_aplicativo
   ```
   *(Caso esteja usando XAMPP sem senha no MySQL, mantenha `DB_PASSWORD=` em branco).*

---

### Passo 4: Instalar as Dependências

#### No Backend:
```bash
cd backend
npm install
```

#### No Frontend:
```bash
cd ../frontend
npm install
```

---

### Passo 5: Inicializar a Aplicação

Para rodar o sistema, você precisará de dois terminais abertos simultaneamente:

#### Terminal 1 — Backend:
```bash
cd backend
npm start
```
*O servidor iniciará em `http://localhost:5000` e conectará automaticamente ao MySQL, sincronizando as tabelas e inserindo os dados padrão caso não existam.*

#### Terminal 2 — Frontend:
```bash
cd frontend
npm start
```
*A interface web será aberta automaticamente em `http://localhost:3000` no seu navegador.*

---

## 🔑 Credenciais de Acesso Pré-Cadastradas

O sistema já inicializa automaticamente com 3 contas pré-configuradas para permitir a demonstração e avaliação completa de todos os perfis e níveis de permissão do sistema:

| Perfil | E-mail de Acesso | Senha Padrão | Nível de Acesso e Finalidade |
| :--- | :--- | :--- | :--- |
| **Diretor** | `diretor@medagenda.com` | `abc123` | **Acesso Total**: Gerenciamento de profissionais, planos de saúde, horários, relatórios e registros de óbito. |
| **Médico** | `medico@medagenda.com` | `abc123` | **Acesso Clínico**: Agenda médica do dia, realização de consultas, solicitação de exames, prescrição de receitas e emissão de atestados em PDF. |
| **Atendente** | `atendente@medagenda.com` | `abc123` | **Recepção**: Cadastro e gestão de pacientes, agendamento de consultas e triagem/check-in na chegada. |

---

## 📁 Estrutura do Repositório

```text
medagenda/
├── backend/
│   ├── config/              # Configuração do Sequelize CLI
│   ├── migrations/          # Migrações versionadas do banco de dados
│   ├── models/              # Inicializador do Sequelize CLI
│   ├── src/
│   │   ├── config/          # Conexão do Sequelize (`db.js`) e dump SQL (`medagenda.sql`)
│   │   ├── controller/      # Controladores com regras de negócio e geração de relatórios/PDFs
│   │   ├── jobs/            # Rotinas agendadas (Node-Cron para lembretes de consulta)
│   │   ├── middlewares/     # Middlewares de autenticação JWT e autorização RBAC
│   │   ├── model/           # Modelos Sequelize (Paciente, Consulta, Profissional, etc.)
│   │   ├── routes/          # Definição e proteção de endpoints RESTful
│   │   ├── services/        # Serviços auxiliares (Email, Seed inicial de Roles e Usuários)
│   │   └── app.js           # Ponto de entrada da aplicação Express
│   ├── .env.exemplo         # Template oficial de variáveis de ambiente
│   └── package.json         # Dependências e scripts do servidor
│
├── frontend/
│   ├── public/              # Arquivos estáticos e HTML base
│   ├── src/
│   │   ├── components/      # Telas, modais, formulários e tabelas dos módulos do sistema
│   │   ├── config/          # Instância do Axios (`axiosConfig.js`) e chamadas de API (`apiServices.js`)
│   │   ├── context/         # React Context de autenticação (`authContext.js`)
│   │   ├── hooks/           # Custom hooks (`useAuth`, `useConsultas`)
│   │   ├── utils/           # Formatadores, máscaras e verificadores de permissão
│   │   ├── app.js           # Configuração de rotas protegidas
│   │   └── index.js         # Ponto de entrada da aplicação React
│   └── package.json         # Dependências e scripts do cliente
│
├── npmi.sh                  # Script utilitário em shell para instalação em lote
└── readme.md                # Documentação técnica do projeto
```

---

## 🎓 Informações Acadêmicas

- **Instituição**: Universidade do Oeste Paulista (UNOESTE)
- **Curso**: Bacharelado em Engenharia de Software
- **Trabalho**: Trabalho de Conclusão de Curso (TCC)
- **Tema**: Sistema Informatizado para Gestão e Otimização de Processos em Clínicas Médicas
- **Licença**: Este projeto é disponibilizado para fins educacionais e de pesquisa acadêmica.
