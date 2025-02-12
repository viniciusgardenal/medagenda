// regrasValidacaoPaciente.js
export const RegrasPaciente = {
  nome: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome do paciente é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome do paciente deve ter mais de 2 caracteres.",
    },
  ],
  sobrenome: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Sobrenome do paciente é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Sobrenome do paciente deve ter mais de 2 caracteres.",
    },
  ],
  cpf: [
    {
      regra: (valor) => valor.trim().length === 14, // CPF deve ter 11 caracteres
      mensagem: "*CPF deve ter 11 caracteres.",
    },
  ],
  sexo: [
    {
      regra: (valor) => valor.trim() !== "",
      mensagem: "*Sexo é obrigatório.",
    },
  ],
  dataNascimento: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Data de nascimento é obrigatória.",
    },
  ],
  email: [
    {
      regra: (valor) => /\S+@\S+\.\S+/.test(valor),
      mensagem: "*E-mail inválido.",
    },
  ],
  endereco: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Endereço é obrigatório.",
    },
  ],
  telefone: [
    {
      regra: (valor) => valor.trim().length >= 10, // Telefone deve ter no mínimo 10 caracteres
      mensagem: "*Telefone deve ter pelo menos 10 caracteres.",
    },
    {
      regra: (valor) => /^[0-9\s\(\)\-]+$/.test(valor),
      mensagem:
        "*Telefone deve conter apenas números, espaços e caracteres especiais.",
    },
  ],
};
