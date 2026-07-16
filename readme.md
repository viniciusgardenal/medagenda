# MedAgenda

Bem-vindo ao repositório da **MedAgenda**, uma solução Full-Stack projetada para otimizar a gestão de clínicas e consultórios médicos. Este sistema foi desenvolvido como projeto final do curso de Engenharia de Software na UNOESTE, com o objetivo de simplificar processos administrativos e melhorar a experiência de pacientes e profissionais de saúde.

## Sobre o Projeto

A **MedAgenda** é um sistema web que oferece ferramentas para o gerenciamento eficiente de clínicas. Ele permite o cadastro de pacientes, agendamento de consultas com lembretes automáticos, registro de exames e histórico médico, além da emissão de receitas digitais. O foco é aumentar a eficiência operacional, reduzindo o tempo gasto em tarefas manuais e proporcionando uma interface intuitiva para os usuários.

## Funcionalidades

- **Cadastro de Pacientes**: Registro e gerenciamento de informações pessoais e médicas dos pacientes.
- **Agendamento de Consultas**: Sistema de marcação de consultas com lembretes automáticos via e-mail ou notificações.
- **Histórico Médico**: Armazenamento seguro de exames e informações clínicas para consulta rápida.
- **Receitas Digitais**: Geração e envio de prescrições médicas em formato digital.
- **Interface Intuitiva**: Design responsivo e fácil de usar, pensado para médicos, recepcionistas e pacientes.

## Tecnologias Utilizadas

Este projeto foi construído com um stack moderno e amplamente utilizado no desenvolvimento web:

### Frontend:
- **JavaScript e React.js**: Para uma interface dinâmica e responsiva.
- **Tailwind CSS**: Estilização moderna e eficiente.

### Backend:
- **Node.js e Express**: Gerenciamento de rotas e lógica do servidor.
- **API REST**: Comunicação eficiente entre frontend e backend.

### Banco de Dados:
- **MySQL**: Armazenamento seguro e estruturado dos dados.

### Ferramentas Adicionais:
- **Git e GitHub**: Controle de versão e hospedagem do código.
- **XAMPP**: Ambiente local para desenvolvimento e testes do banco de dados.

## Status do Projeto

O sistema está **finalizado**, com as principais funcionalidades de cadastro de pacientes, agendamento e interface básica já implementadas.

## Instalação e Execução

### Pré-requisito:
- Node.js (versão 16 ou superior) instalado.

---

### Método Rápido (Recomendado para Windows)

Criamos um script automatizador `iniciar.bat` na raiz do projeto que realiza toda a instalação de dependências, cria a base de dados SQLite local e inicia a aplicação de forma unificada.

1. Baixe/clone o projeto em seu computador.
2. Dê um duplo clique no arquivo **`iniciar.bat`** na raiz do projeto.
3. Pronto! O script instalará as dependências, gerará o banco SQLite local (`backend/database.sqlite`), criará os dados de demonstração automaticamente e abrirá a aplicação em seu navegador.

---

### Método Manual (Passo a Passo)

Caso queira executar os comandos manualmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/viniciusgardenal/medagenda.git
   cd medagenda
   ```

2. **Configure o arquivo de ambiente do Backend:**
   - Acesse a pasta `backend/` e crie um arquivo chamado **`.env.development`**.
   - Defina o SQLite como banco de dados:
     ```env
     JWT_SECRET=medagenda_secret_key_123
     PORT=5000
     DB_DIALECT=sqlite
     ```

3. **Instale e rode o Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Instale e rode o Frontend:**
   - Em uma nova aba/janela do terminal:
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Acesso ao Sistema:**
   - Acesse **`http://localhost:3000`** no seu navegador.
   - **E-mail de acesso:** `diretor@medagenda.com`
   - **Senha de acesso:** `abc123`

---

### Método Avançado (Usando MySQL/XAMPP se desejado)

Se possuir o MySQL/XAMPP configurado e desejar usá-lo em vez do SQLite, basta atualizar o arquivo `backend/.env.development` para:
```env
JWT_SECRET=sua_chave_secreta
PORT=5000
DB_DIALECT=mysql
DB_HOST=localhost
DB_NAME=medagenda
DB_USER=root
DB_PASSWORD=sua_senha
```
Em seguida, crie o banco de dados `medagenda` no phpMyAdmin e importe o script `backend/src/config/medagenda.sql`.

