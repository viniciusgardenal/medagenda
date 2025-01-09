-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06/12/2024 às 21:03
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `medagenda`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `medicamentos`
--

CREATE TABLE `medicamentos` (
  `idMedicamento` int(11) NOT NULL,
  `nomeMedicamento` varchar(255) NOT NULL,
  `controlado` varchar(255) NOT NULL,
  `nomeFabricante` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `instrucaoUso` varchar(255) NOT NULL,
  `interacao` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `medicamentos`
--

INSERT INTO `medicamentos` (`idMedicamento`, `nomeMedicamento`, `controlado`, `nomeFabricante`, `descricao`, `instrucaoUso`, `interacao`, `createdAt`, `updatedAt`) VALUES
(1, 'Parecetamol', 'Medicamento Não Controlado', 'Parecetamol LTDA', '123', '456', '789', '2024-12-05 19:21:14', '2024-12-05 19:21:14');

-- --------------------------------------------------------

--
-- Estrutura para tabela `paciente`
--

CREATE TABLE `paciente` (
  `cpf` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `sexo` char(1) NOT NULL,
  `dataNascimento` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `telefone` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `paciente`
--

INSERT INTO `paciente` (`cpf`, `nome`, `sobrenome`, `sexo`, `dataNascimento`, `email`, `endereco`, `telefone`, `createdAt`, `updatedAt`) VALUES
('398.141.398-90', 'Pedro', 'Castelao', 'M', '0000-00-00 00:00:00', 'castelao.pedro2@gmail.com', 'av Manoel Guirado Segura, 647', '(18) 98822-0819', '2024-12-05 19:20:38', '2024-12-05 19:20:38');

-- --------------------------------------------------------

--
-- Estrutura para tabela `permissao`
--

CREATE TABLE `permissao` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `permissao`
--

INSERT INTO `permissao` (`id`, `nome`, `createdAt`, `updatedAt`) VALUES
(1, 'consultar', '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(2, 'criar', '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(3, 'alterar', '2024-12-05 16:07:07', '2024-12-05 16:07:07');

-- --------------------------------------------------------

--
-- Estrutura para tabela `planodesaude`
--

CREATE TABLE `planodesaude` (
  `idPlanoDeSaude` int(11) NOT NULL,
  `nomePlanoDeSaude` varchar(255) DEFAULT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `tipoPlanoDeSaude` varchar(255) DEFAULT NULL,
  `dataInicio` datetime DEFAULT NULL,
  `dataFim` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `profissionais`
--

CREATE TABLE `profissionais` (
  `matricula` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `tipoProfissional` enum('Medico','Atendente','Diretor') NOT NULL,
  `dataNascimento` datetime NOT NULL,
  `crm` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `setor` varchar(255) DEFAULT NULL,
  `dataAdmissao` datetime NOT NULL,
  `password` varchar(255) NOT NULL,
  `sendEmail` int(11) DEFAULT 0,
  `roleId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `profissionais`
--

INSERT INTO `profissionais` (`matricula`, `nome`, `email`, `telefone`, `tipoProfissional`, `dataNascimento`, `crm`, `departamento`, `setor`, `dataAdmissao`, `password`, `sendEmail`, `roleId`, `createdAt`, `updatedAt`) VALUES
(1, 'Diretor', 'diretor@medagenda.com', NULL, 'Diretor', '2024-12-05 00:00:00', NULL, NULL, NULL, '2024-12-05 00:00:00', '$2a$10$HNPJctnddgHqbfhYhTDtO.I5kNW4TnGlxA0uNKJBMvNhzUxpMe35O', 0, 1, '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(2, 'Atendente', 'atendente@medagenda.com', NULL, 'Atendente', '2024-12-05 00:00:00', NULL, NULL, NULL, '2024-12-05 00:00:00', '$2a$10$HNPJctnddgHqbfhYhTDtO.I5kNW4TnGlxA0uNKJBMvNhzUxpMe35O', 0, 2, '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(3, 'Medico', 'medico@medagenda.com', NULL, 'Medico', '2024-12-05 00:00:00', NULL, NULL, NULL, '2024-12-05 00:00:00', '$2a$10$HNPJctnddgHqbfhYhTDtO.I5kNW4TnGlxA0uNKJBMvNhzUxpMe35O', 0, 3, '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(4, 'Testes', 'pedro@testse.com.br', '(88) 88888-8888', 'Atendente', '2020-02-24 00:00:00', NULL, NULL, 'Recepção', '2023-12-02 00:00:00', '$2a$10$DWZFSE8Y6z8sV7edqEpMAucOAGarPv4kBPV4UAZYB63xxUvD9Nc7O', 0, 2, '2024-12-06 02:05:50', '2024-12-06 02:05:50');

-- --------------------------------------------------------

--
-- Estrutura para tabela `receitas`
--

CREATE TABLE `receitas` (
  `idReceita` int(11) NOT NULL,
  `dosagem` varchar(255) DEFAULT NULL,
  `instrucaoUso` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `matriculaProfissional` int(11) DEFAULT NULL,
  `cpfPaciente` varchar(255) DEFAULT NULL,
  `idMedicamento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `receitas`
--

INSERT INTO `receitas` (`idReceita`, `dosagem`, `instrucaoUso`, `createdAt`, `updatedAt`, `matriculaProfissional`, `cpfPaciente`, `idMedicamento`) VALUES
(11, 'testes', 'tsetse', '2024-12-06 00:02:50', '2024-12-06 00:02:50', 1, '398.141.398-90', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `rolepermissao`
--

CREATE TABLE `rolepermissao` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `rolepermissao`
--

INSERT INTO `rolepermissao` (`createdAt`, `updatedAt`, `roleId`, `permissionId`) VALUES
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 1, 1),
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 1, 2),
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 1, 3),
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 2, 1),
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 3, 1),
('2024-12-05 16:07:07', '2024-12-05 16:07:07', 3, 3);

-- --------------------------------------------------------

--
-- Estrutura para tabela `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `roles`
--

INSERT INTO `roles` (`id`, `nome`, `createdAt`, `updatedAt`) VALUES
(1, 'Diretor', '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(2, 'Atendente', '2024-12-05 16:07:07', '2024-12-05 16:07:07'),
(3, 'Médico', '2024-12-05 16:07:07', '2024-12-05 16:07:07');

-- --------------------------------------------------------

--
-- Estrutura para tabela `solicitacaoexames`
--

CREATE TABLE `solicitacaoexames` (
  `idSolicitacaoExame` int(11) NOT NULL,
  `periodo` varchar(255) DEFAULT NULL,
  `dataRetorno` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `matriculaProfissional` int(11) DEFAULT NULL,
  `cpfPaciente` varchar(255) DEFAULT NULL,
  `idTipoExame` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `solicitacaoexames`
--

INSERT INTO `solicitacaoexames` (`idSolicitacaoExame`, `periodo`, `dataRetorno`, `status`, `createdAt`, `updatedAt`, `matriculaProfissional`, `cpfPaciente`, `idTipoExame`) VALUES
(2, 'Noite', '2024-12-26 00:00:00', 'ativo', '2024-12-06 01:25:38', '2024-12-06 01:25:38', 1, '398.141.398-90', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipoconsulta`
--

CREATE TABLE `tipoconsulta` (
  `idTipoConsulta` int(11) NOT NULL,
  `nomeTipoConsulta` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `especialidade` varchar(255) DEFAULT NULL,
  `duracaoEstimada` varchar(255) DEFAULT NULL,
  `requisitosEspecificos` text DEFAULT NULL,
  `prioridade` varchar(255) DEFAULT NULL,
  `dataCriacao` datetime NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'ativo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tiposexames`
--

CREATE TABLE `tiposexames` (
  `idTipoExame` int(11) NOT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `nomeTipoExame` varchar(255) DEFAULT NULL,
  `materialColetado` varchar(255) DEFAULT NULL,
  `tempoJejum` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `observacao` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tiposexames`
--

INSERT INTO `tiposexames` (`idTipoExame`, `codigo`, `nomeTipoExame`, `materialColetado`, `tempoJejum`, `categoria`, `observacao`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'Teste', 'testes', '1', 'Laboratorial', 'testt', '2024-12-06 00:08:14', '2024-12-06 00:08:14');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`idMedicamento`);

--
-- Índices de tabela `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`cpf`);

--
-- Índices de tabela `permissao`
--
ALTER TABLE `permissao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `planodesaude`
--
ALTER TABLE `planodesaude`
  ADD PRIMARY KEY (`idPlanoDeSaude`);

--
-- Índices de tabela `profissionais`
--
ALTER TABLE `profissionais`
  ADD PRIMARY KEY (`matricula`),
  ADD KEY `roleId` (`roleId`);

--
-- Índices de tabela `receitas`
--
ALTER TABLE `receitas`
  ADD PRIMARY KEY (`idReceita`),
  ADD KEY `matriculaProfissional` (`matriculaProfissional`),
  ADD KEY `cpfPaciente` (`cpfPaciente`),
  ADD KEY `idMedicamento` (`idMedicamento`);

--
-- Índices de tabela `rolepermissao`
--
ALTER TABLE `rolepermissao`
  ADD PRIMARY KEY (`roleId`,`permissionId`),
  ADD KEY `permissionId` (`permissionId`);

--
-- Índices de tabela `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `solicitacaoexames`
--
ALTER TABLE `solicitacaoexames`
  ADD PRIMARY KEY (`idSolicitacaoExame`),
  ADD KEY `matriculaProfissional` (`matriculaProfissional`),
  ADD KEY `cpfPaciente` (`cpfPaciente`),
  ADD KEY `idTipoExame` (`idTipoExame`);

--
-- Índices de tabela `tipoconsulta`
--
ALTER TABLE `tipoconsulta`
  ADD PRIMARY KEY (`idTipoConsulta`);

--
-- Índices de tabela `tiposexames`
--
ALTER TABLE `tiposexames`
  ADD PRIMARY KEY (`idTipoExame`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `idMedicamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `permissao`
--
ALTER TABLE `permissao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `planodesaude`
--
ALTER TABLE `planodesaude`
  MODIFY `idPlanoDeSaude` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `profissionais`
--
ALTER TABLE `profissionais`
  MODIFY `matricula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `receitas`
--
ALTER TABLE `receitas`
  MODIFY `idReceita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `solicitacaoexames`
--
ALTER TABLE `solicitacaoexames`
  MODIFY `idSolicitacaoExame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tipoconsulta`
--
ALTER TABLE `tipoconsulta`
  MODIFY `idTipoConsulta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tiposexames`
--
ALTER TABLE `tiposexames`
  MODIFY `idTipoExame` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `profissionais`
--
ALTER TABLE `profissionais`
  ADD CONSTRAINT `profissionais_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `receitas`
--
ALTER TABLE `receitas`
  ADD CONSTRAINT `receitas_ibfk_1` FOREIGN KEY (`matriculaProfissional`) REFERENCES `profissionais` (`matricula`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `receitas_ibfk_2` FOREIGN KEY (`cpfPaciente`) REFERENCES `paciente` (`cpf`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `receitas_ibfk_3` FOREIGN KEY (`idMedicamento`) REFERENCES `medicamentos` (`idMedicamento`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `rolepermissao`
--
ALTER TABLE `rolepermissao`
  ADD CONSTRAINT `rolepermissao_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rolepermissao_ibfk_2` FOREIGN KEY (`permissionId`) REFERENCES `permissao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `solicitacaoexames`
--
ALTER TABLE `solicitacaoexames`
  ADD CONSTRAINT `solicitacaoexames_ibfk_1` FOREIGN KEY (`matriculaProfissional`) REFERENCES `profissionais` (`matricula`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitacaoexames_ibfk_2` FOREIGN KEY (`cpfPaciente`) REFERENCES `paciente` (`cpf`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `solicitacaoexames_ibfk_3` FOREIGN KEY (`idTipoExame`) REFERENCES `tiposexames` (`idTipoExame`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
