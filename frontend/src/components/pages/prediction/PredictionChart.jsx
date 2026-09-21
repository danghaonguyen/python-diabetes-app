import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import "./PredictionChart.css";

Modal.setAppElement("#root");

const ageGroupLabel = (age) => {
  if (age < 18) return "<18";
  if (age <= 30) return "18-30";
  if (age <= 45) return "31-45";
  if (age <= 60) return "46-60";
  return ">=60";
};

const getColor = (value, min, max) => {
  const range = max - min;
  if (value < min - range * 0.2 || value > max + range * 0.2) return "#d94a4a";
  if (value < min || value > max) return "#e8a33d";
  return "#319b68";
};

const buildChartData = (formData) => [
  { name: "Đường huyết", user: Number(formData.glucose) || 0, normal: 5.5, normalMin: 3.9, normalMax: 7 },
  { name: "BMI", user: Number(formData.bmi) || 0, normal: 22, normalMin: 18.5, normalMax: 24.9 },
  { name: "Huyết áp tâm thu", user: Number(formData.systolic_bp) || 0, normal: 110, normalMin: 90, normalMax: 120 },
  { name: "Huyết áp tâm trương", user: Number(formData.diastolic_bp) || 0, normal: 75, normalMin: 60, normalMax: 80 },
  { name: "Nhịp tim", user: Number(formData.pulse_rate) || 0, normal: 80, normalMin: 60, normalMax: 100 },
];

const axisLabels = {
  "Đường huyết": "Đường huyết",
  BMI: "BMI",
  "Huyết áp tâm thu": "HA tâm thu",
  "Huyết áp tâm trương": "HA tâm trương",
  "Nhịp tim": "Nhịp tim",
};

function PredictionTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="prediction-tooltip">
      <p className="prediction-tooltip-title">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className={entry.dataKey === "user" ? "tooltip-user" : "tooltip-normal"}>
          <span>{entry.dataKey === "user" ? "Chỉ số của bạn" : "Ngưỡng tham khảo"}</span>
          <strong>{entry.value}</strong>
        </p>
      ))}
      <small>Khoảng tham khảo: {data.normalMin} - {data.normalMax}</small>
    </div>
  );
}

function PredictionChart({ formData, onClose }) {
  const data = buildChartData(formData);
  const age = Number(formData.age);
  const ageColor = age < 30 ? "#319b68" : age <= 50 ? "#e8a33d" : "#d94a4a";

  return (
    <Modal
      isOpen
      onRequestClose={onClose}
      contentLabel="Biểu đồ so sánh chỉ số sức khỏe"
      className="prediction-chart-modal"
      overlayClassName="prediction-chart-overlay"
    >
      <button type="button" className="prediction-chart-close" onClick={onClose} aria-label="Đóng biểu đồ" title="Đóng">
        <FiX aria-hidden="true" />
      </button>
      <section className="chart-box" aria-label="Biểu đồ so sánh chỉ số sức khỏe">
        <div className="chart-header">
          <div>
            <span className="chart-eyebrow">PHÂN TÍCH CHỈ SỐ</span>
            <h5>So sánh với ngưỡng tham khảo</h5>
            <p>Giá trị càng gần vùng tham khảo, chỉ số càng ổn định.</p>
          </div>
          <div className="age-group-badge" style={{ background: ageColor }}>
            <span>Nhóm tuổi</span>
            <strong>{ageGroupLabel(age)} tuổi</strong>
          </div>
        </div>
        <div className="chart-legend-note"><span className="legend-dot user-dot"></span> Chỉ số của bạn <span className="legend-dot normal-dot"></span> Ngưỡng tham khảo</div>
        <div className="prediction-chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 30, right: 18, left: 0, bottom: 58 }} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d9e6e9" />
              <XAxis dataKey="name" interval={0} tickFormatter={(value) => axisLabels[value] || value} height={54} tick={{ fontSize: 16, fill: "#243447", fontWeight: 600 }} axisLine={{ stroke: "#b7cbd0" }} tickLine={false} />
              <YAxis tick={{ fontSize: 15, fill: "#526579" }} axisLine={false} tickLine={false} />
              <Tooltip content={<PredictionTooltip />} cursor={{ fill: "rgba(8, 127, 140, .06)" }} />
              <Bar dataKey="user" name="Chỉ số của bạn">
                {data.map((item) => <Cell key={item.name} fill={getColor(item.user, item.normalMin, item.normalMax)} />)}
                <LabelList dataKey="user" position="top" fill="#243447" fontSize={15} />
              </Bar>
              <Bar dataKey="normal" name="Ngưỡng tham khảo" fill="#6dbd78">
                <LabelList dataKey="normal" position="top" fill="#377b50" fontSize={15} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </Modal>
  );
}

export default PredictionChart;
