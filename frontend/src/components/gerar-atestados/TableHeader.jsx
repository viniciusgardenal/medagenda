import SortIcon from "./SortIcon";

const TableHeader = ({ label, field, sortField, sortDirection, onSort }) => (
  <th
    onClick={() => onSort(field)}
    className="py-3 px-2 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer select-none"
  >
    <div className="flex items-center">
      {label}{" "}
      <SortIcon
        field={field}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </div>
  </th>
);

export default TableHeader;
