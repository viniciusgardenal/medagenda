// regrasValidacao.js
export const RegrasSolicitacaoExames = {
  nomeTipoExame: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A solicitação de Exame é obrigatória.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*A solicitação de exame deve ter mais de 2 caracteres.",
    },
  ],
  periodo: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*O período é obrigatório.",
    },
    {
      regra: (valor) => valor.length <= 50,
      mensagem: "*O período não pode exceder 50 caracteres.",
    },
  ],
  dataCriacao: [
    {
      regra: (valor) => !isNaN(new Date(valor).getTime()),
      mensagem: "*A data da solicitação deve ser válida.",
    },
  ],
  dataRetorno: [
    {
      regra: (valor) => !isNaN(new Date(valor).getTime()),
      mensagem: "*A data de retorno deve ser válida.",
    },
    {
      regra: (valor, dados) => new Date(valor) > new Date(dados.dataCriacao),
      mensagem: "*A data de retorno deve ser posterior à data de criação.",
    },
  ],
  medico_matricula: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A matrícula do médico é obrigatória.",
    },
    {
      regra: (valor) => /^[0-9]+$/.test(valor),
      mensagem: "*A matrícula do médico deve conter apenas números.",
    },
  ],
  paciente_cpf: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*O CPF do paciente é obrigatório.",
    },
    {
      regra: (valor) => /^[0-9]{11}$/.test(valor),
      mensagem: "*O CPF do paciente deve conter 11 números.",
    },
  ],
  status: [
    {
      regra: (valor) => ["ativo", "inativo"].includes(valor),
      mensagem: "*Status inválido. Escolha 'ativo' ou 'inativo'.",
    },
  ],
};
