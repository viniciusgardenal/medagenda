const InputField = ({
  label,
  name,
  type = "text",
  register, // 1. Recebe a função register
  error, // 2. Recebe o objeto de erro (opcional, mas recomendado)
  required = false,
  disabled,
  hidden,
  ...props // Pega quaisquer outras props (ex: placeholder)
}) => {
  if (hidden) return null;

  // Define as classes de estilo, aplicando uma borda vermelha se houver erro
  const className = `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
    error ? "border-red-500 ring-red-500" : "focus:ring-blue-500"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`;

  const isTextarea = type === "textarea";

  // Prepara props específicas para o input
  let inputSpecificProps = {};

  // Se o tipo for 'date', calcula a data de hoje para usar no atributo 'min'
  if (type === "date") {
    const today = new Date();
    const year = today.getFullYear();
    // getMonth() retorna 0-11, então adicionamos 1
    // padStart garante que tenhamos dois dígitos para o mês e dia (ex: 06 em vez de 6)
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    inputSpecificProps.min = `${year}-${month}-${day}`;
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {isTextarea ? (
        <textarea
          {...props}
          {...register(name, { required })} // 3. Conecta o campo ao formulário
          disabled={disabled}
          className={className}
        ></textarea>
      ) : (
        <input
          type={type}
          {...props}
          {...inputSpecificProps} // Adiciona props específicas como 'min' para data
          {...register(name, { required })} // 3. Conecta o campo ao formulário
          disabled={disabled}
          className={className}
        />
      )}

      {/* 4. Exibe a mensagem de erro, se existir */}
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputField;
