import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import HeaderTop from "./HeaderTop";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./css/History.css";
import "./css/Footer.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

Modal.setAppElement("#root");

const formatDateTime = (value) => {
  if (!value || typeof value !== "string") return "";
  const [datePart, timePart] = value.split(" ");
  if (!datePart || !timePart) return "";
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");
  return `${hour}:${minute} ${day}/${month}/${year}`;
};

function History() {
  const [history, setHistory] = useState([]);

  const formatRisk = (value) => {
    if (value === "Cao") return "Cao";
    if (value === "Trung bình") return "Trung bình";
    if (value === "Thấp") return "Thấp";
    return "Không rõ";
  };

  const [selected, setSelected] = useState(null);
  const userId = localStorage.getItem("user_id");

  const [filterDate, setFilterDate] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterYear, setFilterYear] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://127.0.0.1:5000/api/history/${userId}`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Lỗi khi lấy lịch sử:", err));
    }
  }, [userId]);

  // 🔐 Kiểm tra đăng nhập
  useEffect(() => {
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để sử dụng chức năng này!");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate, userId]);

  const getDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    return new Date(parseInt(year), parseInt(month), 0).getDate();
  };

  const formatGender = (g) => (g === 1 ? "Nam" : "Nữ");
  const formatNumber = (num) =>
    typeof num !== "number"
      ? num
      : num.toLocaleString("vi-VN", { maximumFractionDigits: 2 });

  const getRiskClass = (level) => {
    if (!level) return "risk-low";

    const value = level.toString().toLowerCase();

    if (value.includes("cao")) return "risk-high";
    if (value.includes("trung")) return "risk-medium";
    if (value.includes("thấp")) return "risk-low";

    return "risk-low";
  };

  const getColor = (value, min, max) => {
    const range = max - min;

    if (value < min - range * 0.2 || value > max + range * 0.2) {
      return "#f44336";
    }

    if (value < min || value > max) {
      return "#ff9800";
    }

    return "#4caf50";
  };

  const handleRowClick = (item) => setSelected(item);
  const closeModal = () => setSelected(null);

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <div>Bạn có muốn xóa dự đoán này?</div>
          <div style={{ marginTop: 10, display: "flex", gap: "10px" }}>
            <button
              style={{
                padding: "5px 10px",
                background: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: 4,
              }}
              onClick={() => {
                axios
                  .delete(`http://127.0.0.1:5000/api/history/${id}`)
                  .then(() => {
                    setHistory((prev) => prev.filter((item) => item.id !== id));
                    toast.success("Đã xóa dự đoán thành công!");
                  })
                  .catch((err) => toast.error("Xóa thất bại: " + err.message));
                closeToast(); // đóng hộp thoại lại sau khi xác nhận
              }}
            >
              Có
            </button>
            <button
              style={{
                padding: "5px 10px",
                background: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: 4,
              }}
              onClick={closeToast}
            >
              Không
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      },
    );
  };

  const selectedDay = filterDate?.value || "";
  const selectedMonth = filterMonth?.value || "";
  const selectedYear = filterYear?.value || "";

  const filteredHistory = history.filter((item) => {
    const date = new Date(item.created_at);
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();

    const matchDay = selectedDay ? day === selectedDay : true;
    const matchMonth = selectedMonth ? month === selectedMonth : true;
    const matchYear = selectedYear ? year === selectedYear : true;

    return matchDay && matchMonth && matchYear;
  });

  const currentYear = new Date().getFullYear(); // Luôn cập nhật mỗi năm
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - 5 + i;
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Tháng ${(i + 1).toString()}`, // Tháng
  }));

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Ngày ${(i + 1).toString()}`, // Ngày
  }));

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <HeaderTop />
        <Navbar />
        <main style={{ flex: 1 }}>
          <div className="history-container">
            <h2 style={{ marginBottom: "24px" }}>📋 Lịch sử dự đoán</h2>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "end",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <div style={{ minWidth: "160px" }}>
                <Select
                  placeholder="Chọn ngày"
                  options={days}
                  value={filterDate}
                  onChange={setFilterDate}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontWeight: "600",
                      fontSize: "16px",
                      borderColor: "#007bff",
                      boxShadow: "none",
                      minHeight: "38px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontWeight: "500",
                      color: "#555",
                    }),
                  }}
                />
              </div>
              <div style={{ minWidth: "160px" }}>
                <Select
                  placeholder="Chọn tháng"
                  options={months}
                  value={filterMonth}
                  onChange={setFilterMonth}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontWeight: "600",
                      fontSize: "16px",
                      borderColor: "#007bff",
                      boxShadow: "none",
                      minHeight: "38px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontWeight: "500",
                      color: "#555",
                    }),
                  }}
                />
              </div>
              <div style={{ minWidth: "160px" }}>
                <Select
                  placeholder="Chọn năm"
                  options={years}
                  value={filterYear}
                  onChange={setFilterYear}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontWeight: "600",
                      fontSize: "16px",
                      borderColor: "#007bff",
                      boxShadow: "none",
                      minHeight: "38px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      fontWeight: "500",
                      color: "#555",
                    }),
                  }}
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="no-data-center">
                Không có lịch sử bản ghi dự đoán nào 🔍
              </div>
            ) : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>🗓 Ngày</th>
                    <th>Tuổi</th>
                    <th>Giới tính</th>
                    <th>Đường huyết</th>
                    <th>BMI</th>
                    <th>Nhịp tim</th>
                    <th>Nguy cơ</th>
                    <th>Xác suất</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {formatDateTime(item.created_at)}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {item.age}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {formatGender(item.gender)}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {formatNumber(item.glucose)}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {formatNumber(item.bmi)}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {formatNumber(item.pulse_rate)}
                      </td>
                      <td className={getRiskClass(item.prediction_result)}>
                        {formatRisk(item.prediction_result)}
                      </td>
                      <td style={{ fontWeight: "600", color: "#2c3e50" }}>
                        {(item.prediction_probability * 100).toFixed(1)}%
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleRowClick(item)}
                            style={{
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            📝 Chi tiết
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              backgroundColor: "#e74c3c",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
        <Footer />

        <Modal
          isOpen={!!selected}
          onRequestClose={closeModal}
          contentLabel="Chi tiết dự đoán"
          className="modal"
          overlayClassName="overlay"
        >
          {selected && (
            <div>
              <h3>
                📌 Chi tiết dự đoán lúc {formatDateTime(selected.created_at)}
              </h3>

              <div className="modal-content-grid">
                <div>Tuổi: {selected.age}</div>
                <div>Giới tính: {formatGender(selected.gender)}</div>
                <div>Nhịp tim: {selected.pulse_rate} nhịp/phút</div>
                <div>Huyết áp tâm thu: {selected.systolic_bp} mmHg</div>
                <div>Huyết áp tâm trương: {selected.diastolic_bp} mmHg</div>
                <div>Đường huyết: {selected.glucose} mmol/L</div>
                <div>Chiều cao: {selected.height} m</div>
                <div>Cân nặng: {selected.weight} kg</div>
                <div>BMI: {selected.bmi} kg/m²</div>
                <div>
                  Tiền sử tiểu đường GĐ:{" "}
                  {Number(selected.family_diabetes) === 1 ? "Có" : "Không"}
                </div>
                <div>
                  Tăng huyết áp:{" "}
                  {Number(selected.hypertensive) === 1 ? "Có" : "Không"}
                </div>
                <div>
                  Tiền sử cao huyết áp GĐ:{" "}
                  {Number(selected.family_hypertension) === 1 ? "Có" : "Không"}
                </div>
                <div>
                  Kết quả:{" "}
                  <strong className={getRiskClass(selected.prediction_result)}>
                    {formatRisk(selected.prediction_result)}
                  </strong>
                </div>
                <div>
                  Xác suất: {(selected.prediction_probability * 100).toFixed(1)}
                  %
                </div>
              </div>

              <h4 className="chart-title">
                📊 So sánh chỉ số sức khỏe với ngưỡng y khoa tiêu chuẩn
              </h4>
              <div
                style={{ width: "100%", height: "500px", marginTop: "20px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Đường huyết",
                        user: Number(selected.glucose) || 0,
                        normalMin: 3.9,
                        normalMax: 7,
                        normal: 5.5,
                      },
                      {
                        name: "BMI",
                        user: Number(selected.bmi) || 0,
                        normalMin: 18.5,
                        normalMax: 24.9,
                        normal: 22,
                      },
                      {
                        name: "Huyết áp tâm thu",
                        user: Number(selected.systolic_bp) || 0,
                        normalMin: 90,
                        normalMax: 120,
                        normal: 110,
                      },
                      {
                        name: "Huyết áp tâm trương",
                        user: Number(selected.diastolic_bp) || 0,
                        normalMin: 60,
                        normalMax: 80,
                        normal: 75,
                      },
                      {
                        name: "Nhịp tim",
                        user: Number(selected.pulse_rate) || 0,
                        normalMin: 60,
                        normalMax: 100,
                        normal: 80,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (!payload || payload.length === 0) return null;

                        return (
                          <div
                            style={{
                              background: "#fff",
                              padding: "12px",
                              borderRadius: "10px",
                              border: "1px solid #ccc",
                              minWidth: "140px",
                            }}
                          >
                            <p
                              style={{
                                fontWeight: "bold",
                                textAlign: "center",
                                marginBottom: "6px",
                              }}
                            >
                              {label}
                            </p>

                            {payload.map((entry, index) => {
                              const isUser = entry.dataKey === "user";
                              const data = entry.payload;

                              let color = "#4caf50";

                              if (isUser) {
                                color = getColor(
                                  data.user,
                                  data.normalMin,
                                  data.normalMax,
                                );
                              }

                              return (
                                <p
                                  key={index}
                                  style={{
                                    color,
                                    margin: 0,
                                    textAlign: "center",
                                  }}
                                >
                                  {isUser ? "Người dùng" : "Ngưỡng bình thường"}
                                  : {entry.value}
                                </p>
                              );
                            })}
                          </div>
                        );
                      }}
                    />
                    <Legend />

                    {/* NGƯỜI DÙNG */}
                    <Bar
                      dataKey="user"
                      name="Người dùng"
                      fill="#3650df"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;

                        let color = "#4caf50";

                        color = getColor(
                          payload.user,
                          payload.normalMin,
                          payload.normalMax,
                        );

                        return (
                          <g>
                            <rect
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              fill={color}
                            />
                            <text
                              x={x + width / 2}
                              y={y - 10}
                              textAnchor="middle"
                              fontSize={12}
                              fill="#000000"
                            >
                              {payload.user}
                            </text>
                          </g>
                        );
                      }}
                    />

                    {/* NGƯỠNG Y KHOA (MIN - MAX) */}
                    <Bar
                      dataKey="normal"
                      name="Ngưỡng bình thường"
                      fill="#2ca530"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;

                        return (
                          <g>
                            <rect
                              x={x}
                              y={y}
                              width={width}
                              height={height}
                              fill="#4caf50"
                            />
                            <text
                              x={x + width / 2}
                              y={y - 10}
                              textAnchor="middle"
                              fontSize={12}
                              fill="#000000"
                            >
                              {payload.normal}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ textAlign: "right", marginTop: "24px" }}>
                <button className="modal-close-btn" onClick={closeModal}>
                  Đóng
                </button>
              </div>
            </div>
          )}
        </Modal>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  );
}

export default History;
