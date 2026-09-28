// Style tuỳ chỉnh cho react-select dùng ở bộ lọc lịch sử.
// Tách riêng để không tạo object mới mỗi lần component re-render.
export const selectStyles = {
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
