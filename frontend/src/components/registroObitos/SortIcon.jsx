// Componente para ícone de ordenação
const SortIcon = ({ field, sortField, sortDirection }) => {
  // Se não for o campo atual de ordenação, mostra ícone neutro
  if (field !== sortField) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 inline-block ml-1 text-gray-400"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
      </svg>
    );
  }

  // Seta para cima ou para baixo dependendo da direção
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 inline-block ml-1 text-blue-600"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d={sortDirection === "asc" ? "M7 14l5-5 5 5H7z" : "M7 10l5 5 5-5H7z"}
      />
    </svg>
  );
};

export default SortIcon;
