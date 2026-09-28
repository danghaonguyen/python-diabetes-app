import { useMemo } from "react";
import Select from "react-select";
import { selectStyles } from "./historyFilterStyles";

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: `Tháng ${index + 1}`,
}));

// Số ngày trong tháng, tự xử lý năm nhuận (tháng 2).
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

function HistoryFilters({ filters, onChange, years }) {
  // Chỉ tính lại khi năm/tháng đổi — tránh tạo mảng mới mỗi lần render.
  const days = useMemo(() => {
    const year = Number(filters.year?.value) || new Date().getFullYear();
    const month = Number(filters.month?.value) || 1;

    return Array.from({ length: getDaysInMonth(year, month) }, (_, index) => ({
      value: String(index + 1),
      label: `Ngày ${index + 1}`,
    }));
  }, [filters.year, filters.month]);

  const filterOptions = [
    { key: "day", placeholder: "Chọn ngày", options: days },
    { key: "month", placeholder: "Chọn tháng", options: MONTHS },
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
