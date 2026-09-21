import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatDateTime,
  formatGender,
  formatProbability,
  formatRisk,
  getIndicatorColor,
  getRiskClass,
} from "./historyUtils";

Modal.setAppElement("#root");

const indicators = (record) => [
  { name: "Đường huyết", user: Number(record.glucose) || 0, normal: 5.5, min: 3.9, max: 7 },
  { name: "BMI", user: Number(record.bmi) || 0, normal: 22, min: 18.5, max: 24.9 },
  { name: "Huyết áp tâm thu", user: Number(record.systolic_bp) || 0, normal: 110, min: 90, max: 120 },
  { name: "Huyết áp tâm trương", user: Number(record.diastolic_bp) || 0, normal: 75, min: 60, max: 80 },
  { name: "Nhịp tim", user: Number(record.pulse_rate) || 0, normal: 80, min: 60, max: 100 },
];

const axisLabels = {
  "Đường huyết": "Đường huyết",
  BMI: "BMI",
  "Huyết áp tâm thu": "HA tâm thu",
  "Huyết áp tâm trương": "HA tâm trương",
  "Nhịp tim": "Nhịp tim",
};

function HistoryChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="history-chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => <p key={entry.dataKey}><span>{entry.dataKey === "user" ? "Chỉ số" : "Ngưỡng"}</span><b>{entry.value}</b></p>)}
      <small>Khoảng tham khảo: {data.min} - {data.max}</small>
    </div>
  );
}

function HistorySummary({ record }) {
  const fields = [
    ["Tuổi", record.age],
    ["Giới tính", formatGender(record.gender)],
    ["Nhịp tim", `${record.pulse_rate} nhịp/phút`],
    ["Huyết áp tâm thu", `${record.systolic_bp} mmHg`],
    ["Huyết áp tâm trương", `${record.diastolic_bp} mmHg`],
    ["Đường huyết", `${record.glucose} mmol/L`],
    ["Chiều cao", `${record.height} m`],
    ["Cân nặng", `${record.weight} kg`],
    ["BMI", `${record.bmi} kg/m²`],
    ["Tiền sử tiểu đường gia đình", Number(record.family_diabetes) === 1 ? "Có" : "Không"],
    ["Tăng huyết áp", Number(record.hypertensive) === 1 ? "Có" : "Không"],
    ["Tiền sử cao huyết áp gia đình", Number(record.family_hypertension) === 1 ? "Có" : "Không"],
    ["Kết quả", <strong className={getRiskClass(record.prediction_result)}>{formatRisk(record.prediction_result)}</strong>],
    ["Xác suất", formatProbability(record.prediction_probability)],
  ];

  return (
    <div className="modal-content-grid">
      {fields.map(([label, value]) => (
        <div className="history-summary-field" key={label}>
          <span>{label}</span>
          <div className="history-summary-value">{value}</div>
        </div>
      ))}
    </div>
  );
}

function HealthIndicatorsChart({ record }) {
  const data = indicators(record);

  return (
    <section className="history-chart-section" aria-label="Biểu đồ chỉ số sức khỏe">
      <div className="history-chart-heading">
        <div>
          <span>PHÂN TÍCH SỨC KHỎE</span>
          <h4>So sánh với ngưỡng tham khảo</h4>
          <p>Giúp bạn nhận biết nhanh các chỉ số đang trong vùng phù hợp.</p>
        </div>
        <div className="history-chart-legend"><i className="history-user-dot"></i> Chỉ số <i className="history-normal-dot"></i> Ngưỡng</div>
      </div>
      <div className="history-chart">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 28, right: 20, left: 0, bottom: 54 }} barCategoryGap="18%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e6e9" />
            <XAxis dataKey="name" interval={0} tickFormatter={(value) => axisLabels[value] || value} tick={{ fontSize: 14, fontWeight: 600, fill: "#243447" }} axisLine={{ stroke: "#b7cbd0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: "#526579" }} axisLine={false} tickLine={false} />
            <Tooltip content={<HistoryChartTooltip />} cursor={{ fill: "rgba(8, 127, 140, .06)" }} />
            <Bar dataKey="user" name="Người dùng">
              {data.map((item) => <Cell key={item.name} fill={getIndicatorColor(item.user, item.min, item.max)} />)}
              <LabelList dataKey="user" position="top" fill="#243447" fontSize={14} formatter={(value) => Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} />
            </Bar>
            <Bar dataKey="normal" name="Ngưỡng tham khảo" fill="#4caf50">
              <LabelList dataKey="normal" position="top" fill="#377b50" fontSize={14} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function HistoryDetailsModal({ record, onClose }) {
  return (
    <Modal
      isOpen={Boolean(record)}
      onRequestClose={onClose}
      contentLabel="Chi tiết dự đoán"
      className="history-modal"
      overlayClassName="history-overlay"
    >
      {record && (
        <>
          <button type="button" className="history-modal-close" onClick={onClose} aria-label="Đóng chi tiết" title="Đóng">
            <FiX aria-hidden="true" />
          </button>
          <h3>Chi tiết dự đoán lúc {formatDateTime(record.created_at)}</h3>
          <HistorySummary record={record} />
          <HealthIndicatorsChart record={record} />
        </>
      )}
    </Modal>
  );
}

export default HistoryDetailsModal;
