// regrasValidacao.js
export const RegrasTipoExame = {
  nomeTipoExame: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome do exame é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome do exame deve ter mais de 2 caracteres.",
    },
  ],
  categoria: [
    {
      regra: (valor) => ["Laboratorial", "Imagem"].includes(valor),
      mensagem: "*Categoria inválida. Escolha uma opção válida.",
    },
  ],
  materialColetado: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Material coletado é obrigatório.",
    },
  ],
  tempoJejum: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Tempo de jejum é obrigatório.",
    },
    {
      regra: (valor) => Number(valor) >= 0 && Number(valor) <= 24,
      mensagem: "*Tempo de jejum deve ser entre 0 e 24 horas.",
    },
  ],
  observacao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Observação é obrigatória.",
    },
    {
      regra: (valor) => valor.length <= 200,
      mensagem: "*Observação não pode exceder 200 caracteres.",
    },
  ],
};
