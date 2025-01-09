// regrasValidacao.js
export const RegrasTipoConsulta = {
  nomeTipoConsulta: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome da consulta é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome da consulta deve ter mais de 2 caracteres.",
    },
  ],
  descricao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Descrição é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 1000, // Limite de 1000 caracteres, podendo ser ajustado conforme necessário
      mensagem: "*Descrição não pode exceder 1000 caracteres.",
    },
  ],
  duracaoEstimada: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Duração é obrigatório.",
    },
  ],
  especialidade: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Especialidade é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 100, // Limite de 100 caracteres
      mensagem: "*Especialidade não pode exceder 100 caracteres.",
    },
  ],
  requisitosEspecificos: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*O Requisito Especifico é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 1000, // Limite de 1000 caracteres
      mensagem: "*Requisitos específicos não podem exceder 1000 caracteres.",
    },
  ],
  prioridade: [
    {
      regra: (valor) => ["Alta", "Média", "Baixa"].includes(valor),
      mensagem:
        "*Prioridade inválida. Escolha uma opção válida (Alta, Média, Baixa).",
    },
  ],
  dataCriacao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Data de Criação é obrigatória.",
    },
  ],
  status: [
    {
      regra: (valor) => ["Ativo", "Inativo"].includes(valor),
      mensagem: "*Status inválido. Escolha 'Ativo' ou 'Inativo'.",
    },
  ],
};
