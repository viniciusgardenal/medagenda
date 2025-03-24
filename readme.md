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

O sistema está em **andamento**, com as principais funcionalidades de cadastro de pacientes, agendamento e interface básica já implementadas. O foco atual é a integração de lembretes automáticos e a finalização do módulo de receitas digitais.

## Próximos Passos

- Implementar o sistema de notificações (e-mail/SMS) para lembretes de consultas.
- Adicionar autenticação de usuários (login para médicos e recepcionistas).
- Finalizar o módulo de receitas digitais com exportação em PDF.
- Realizar testes de usabilidade e otimizar a performance.

## Instalação

Siga os passos abaixo para rodar o projeto localmente:

### Pré-requisitos:
- Node.js (versão 16 ou superior)
- MySQL (ou XAMPP para ambiente local)
- Git

### Passos:

1. Clone o repositório:
   ```bash
   git clone https://github.com/viniciusgardenal/medagenda.git
   cd medagenda

2. Instale as dependências do backend:
    ```bash
    cd backend
    npm install

3. Configure o banco de dados:
    
    - Crie um banco de dados MySQL chamado medagenda.
    - Importe o arquivo database.sql (disponível no diretório /backend) para criar as tabelas necessárias.
    - Atualize as credenciais no arquivo  com suas configurações locais
    ```bash
    DB_HOST=localhost
    DB_USER=seu_usuario
    DB_PASS=sua_senha
    DB_NAME=medagenda
    
4. Instale as dependências do front-end:
    ```bash
    cd ../frontend
    npm install

5. Inicie o Backend:
    ```bash
    cd backend
    npm start

6. Inicie o Front-end:
    ```bash
    cd frontend
    npm start

7. Acesse o sistema em http://localhost:3000 no seu navegador.

8. Use o login e senha abaixo para acessar o sistema:
    ```bash
    E-mail: diretor@medagenda.com
    Senha: abc123