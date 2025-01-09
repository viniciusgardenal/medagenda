// regrasValidacao.js
export const RegrasPlanoDeSaude = {
  nomePlanoDeSaude: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome do plano de saude é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome do plano de saude deve ter mais de 2 caracteres.",
    },
  ],
  descricao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Observação é obrigatória.",
    },
  ],
  tipoPlanoDeSaude: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Tipo Plano de Saude é obrigatório.",
    },
  ],
  dataInicio: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Data de nascimento é obrigatória.",
    },
  ],
  dataFim: [
    {
      regra: (valor) => valor !== "",
      mensagem: "*Data de Fim é obrigatória.",
    },
  ],
  status: [
    {
      regra: (valor) => ["Ativo", "Inativo", "Cancelado"].includes(valor),
      mensagem: "*Categoria inválida. Escolha uma opção válida.",
    },
  ],
};
