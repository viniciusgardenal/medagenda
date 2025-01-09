// utils/mascaras.js

// Máscara para o campo Telefone
export function aplicarMascaraTelefone(telefone) {
  // Remove qualquer caractere que não seja número
  telefone = telefone.replace(/\D/g, "");

  // Aplica a máscara de telefone no padrão (XX) XXXXX-XXXX
  if (telefone.length <= 2) {
    telefone = `(${telefone}`;
  } else if (telefone.length <= 6) {
    telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
  } else if (telefone.length <= 10) {
    telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(
      2,
      7
    )}-${telefone.slice(7)}`;
  } else {
    telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(
      2,
      7
    )}-${telefone.slice(7, 11)}`;
  }

  return telefone;
}

// Máscara para o campo CRM
export function aplicarMascaraCRM(crm) {
  // Remove caracteres que não são numéricos ou letras
  crm = crm.replace(/[^0-9A-Z]/gi, "");

  // Adiciona o hífen após os primeiros 5 ou 6 dígitos e limita a entrada a 9 caracteres
  if (crm.length > 5) {
    crm = crm.slice(0, 6) + "-" + crm.slice(6, 8);
  }

  return crm.toUpperCase();
}

export function mascaraCPF(cpf) {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Aplica a máscara
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return cpf;
}

// mascaras.js
export function aplicarMascaraCPF(value) {
  return mascaraCPF(value);
}
