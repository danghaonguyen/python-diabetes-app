import Select from "react-select";

const selectStyles = {
  control: (base) => ({
    ...base,
    borderColor: "#cbd5e1",
    boxShadow: "none",
    fontSize: "17px",
    fontWeight: 600,
    minHeight: "44px",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
  }),
  placeholder: (base) => ({ ...base, color: "#64748b" }),
  singleValue: (base) => ({ ...base, color: "#1e293b" }),
  dropdownIndicator: (base) => ({ ...base, color: "#1677d2" }),
  clearIndicator: (base) => ({ ...base, color: "#64748b" }),
};

function HistoryFilters({ filters, onChange, years }) {
  const daysInMonth = new Date(
    Number(filters.year?.value) || new Date().getFullYear(),
    Number(filters.month?.value) || 1,
    0,
  ).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => ({
    value: String(index + 1),
    label: `Ngày ${index + 1}`,
  }));
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: `Tháng ${index + 1}`,
  }));
  const filterOptions = [
    { key: "day", placeholder: "Chọn ngày", options: days },
    { key: "month", placeholder: "Chọn tháng", options: months },
    { key: "year", placeholder: "Chọn năm", options: years },
  ];

  return (
    <div className="filter-row">
      {filterOptions.map(({ key, placeholder, options }) => (
        <div className="filter-select" key={key}>
          <Select
            classNamePrefix="history-filter"
            placeholder={placeholder}
            options={options}
            value={filters[key]}
            onChange={(value) => onChange(key, value)}
            isClearable
            styles={selectStyles}
          />
        </div>
      ))}
    </div>
  );
}

export default HistoryFilters;
