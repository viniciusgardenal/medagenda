import React from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled,
  hidden,
}) => {
  if (hidden) return null;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;