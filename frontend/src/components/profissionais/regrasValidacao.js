// regrasValidacao.js
export const RegrasProfissional = {
  nome: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome deve ter mais de 2 caracteres.",
    },
  ],
  telefone: [
    {
      regra: (valor) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(valor),
      mensagem: "*Telefone inválido. O formato correto é (DD) 99999-9999.",
    },
  ],
  email: [
    {
      regra: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
      mensagem: "*Email inválido.",
    },
  ],
  dataNascimento: [
    {
      regra: (valor) => valor !== "",
      mensagem: "*Data de nascimento é obrigatória.",
    },
  ],
  dataAdmissao: [
    {
      regra: (valor) => valor !== "",
      mensagem: "*Data de admissão é obrigatória.",
    },
  ],
  tipoProfissional: [
    {
      regra: (valor) => ["Medico", "Atendente", "Diretor"].includes(valor),
      mensagem: "*Tipo de profissional inválido.",
    },
  ],
  crm: [
    {
      regra: (valor) => (valor ? /^[0-9]{5,6}-[A-Z]{2}$/.test(valor) : true),
      mensagem: "*CRM inválido.",
    },
  ],
  setor: [
    {
      regra: (valor) => (valor ? valor.trim().length > 0 : true),
      mensagem: "*Setor é obrigatório para Atendentes.",
    },
  ],
  departamento: [
    {
      regra: (valor) => (valor ? valor.trim().length > 0 : true),
      mensagem: "*Departamento é obrigatório para Diretores.",
    },
  ],
};
