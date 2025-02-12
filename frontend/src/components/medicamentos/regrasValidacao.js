// regrasValidacaoMedicamento.js
export const RegrasMedicamento = {
  nomeMedicamento: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome do Medicamento é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome do Medicamento deve ter mais de 2 caracteres.",
    },
  ],
  // dosagem: [
  //   {
  //     regra: (valor) => valor.trim().length > 0,
  //     mensagem: "*Dosagem é obrigatória.",
  //   },
  // ],
  nomeFabricante: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*Nome do Fabricante é obrigatório.",
    },
    {
      regra: (valor) => valor.length > 2,
      mensagem: "*Nome do Fabricante deve ter mais de 2 caracteres.",
    },
  ],
  descricao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Descrição é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 1000,
      mensagem: "*Descrição não pode exceder 1000 caracteres.",
    },
  ],
  instrucaoUso: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Instrução de Uso é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 1000,
      mensagem: "*Instrução de uso não pode exceder 1000 caracteres.",
    },
  ],
  interacao: [
    {
      regra: (valor) => valor.trim().length > 0,
      mensagem: "*A Interação é obrigatório.",
    },
    {
      regra: (valor) => valor.trim().length <= 1000,
      mensagem: "*Interações não podem exceder 1000 caracteres.",
    },
  ],
};
