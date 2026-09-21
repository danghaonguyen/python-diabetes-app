export const getRiskClass = (level) => {
  const value = String(level || "").toLowerCase();
  if (value.includes("cao")) return "risk-high";
  if (value.includes("trung")) return "risk-medium";
  return "risk-low";
};

export const formatRisk = (value) => value || "Không rõ";

export const formatGender = (value) => (Number(value) === 1 ? "Nam" : "Nữ");

export const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number)
    ? number.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
    : "—";
};

export const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export const formatProbability = (value) => {
  const probability = Number(value);
  return Number.isFinite(probability) ? `${(probability * 100).toFixed(1)}%` : "—";
};

export const getIndicatorColor = (value, min, max) => {
  const range = max - min;
  if (value < min - range * 0.2 || value > max + range * 0.2) return "#f44336";
  if (value < min || value > max) return "#ff9800";
  return "#4caf50";
};
