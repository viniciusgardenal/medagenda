const SelectField = ({
  label,
  name,
  register, // Entra: a função do react-hook-form
  error, // Entra: o objeto de erro para validação
  options,
  placeholder,
  disabled,
  ...props
}) => {
  const className = `w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 ${
    error ? "border-red-500 ring-red-500" : "focus:ring-blue-500"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <select
        {...props}
        {...register(name)} // A mágica acontece aqui!
        disabled={disabled}
        className={className}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

export default SelectField;
