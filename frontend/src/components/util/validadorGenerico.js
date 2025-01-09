// validadorGenerico.js

const ValidadorGenerico = (dados, regras) => {
  const erros = {};

  Object.keys(regras).forEach((campo) => {
    const valor = dados[campo];
    const validacoes = regras[campo];

    validacoes.forEach((validacao) => {
      const { regra, mensagem } = validacao;

      if (typeof regra === "function" && !regra(valor)) {
        erros[campo] = mensagem;
      }
    });
  });

  return Object.keys(erros).length ? erros : null;
};

export default ValidadorGenerico;
