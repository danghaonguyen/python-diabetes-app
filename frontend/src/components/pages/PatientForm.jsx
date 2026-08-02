import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { predictDiabetes } from "../../services/api";
import Navbar from "./Navbar";
import HeaderTop from "./HeaderTop";
import Footer from "./Footer";
import "./css/PatientForm.css";
import "./css/Navbar.css";
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

function PatientForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    pulse_rate: "",
    systolic_bp: "",
    diastolic_bp: "",
    glucose: "",
    height: "",
    weight: "",
    bmi: "",
    family_diabetes: "",
    hypertensive: "",
    family_hypertension: "",
    // cardiovascular_disease: "",
    // stroke: "",
  });

  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.warning("Bạn cần đăng nhập để sử dụng chức năng này!");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  const labels = {
    age: "Tuổi",
    gender: "Giới tính",
    pulse_rate: "Nhịp tim (nhịp/phút - bpm)",
    systolic_bp: "Huyết áp tâm thu (mmHg)",
    diastolic_bp: "Huyết áp tâm trương (mmHg)",
    glucose: "Chỉ số đường huyết (mmol/L)",
    height: "Chiều cao (m) - ví dụ: 1.68",
    weight: "Cân nặng (kg)",
    bmi: "Chỉ số BMI (kg/m²)",
    family_diabetes: "Tiền sử gia đình",
    hypertensive: "Tăng huyết áp",
    family_hypertension: "Tiền sử huyết áp cao trong gia đình",
    // cardiovascular_disease: "Bệnh tim mạch",
    // stroke: "Tiền sử đột quỵ",
  };

  const ageGroupLabel = (age) => {
    if (age < 18) return "Nhóm tuổi: <18";
    if (age <= 30) return "Nhóm tuổi: 18–30";
    if (age <= 45) return "Nhóm tuổi: 31–45";
    if (age <= 60) return "Nhóm tuổi: 46–60";
    return "Nhóm tuổi: ≥60";
  }

const getColor = (value, min, max) => {
      const range = max - min;

      if (value < min - range * 0.2 || value > max + range * 0.2) {
        return "#f44336"; // 🔴 lệch nhiều
      }

      if (value < min || value > max) {
        return "#ff9800"; // 🟡 lệch nhẹ
      }

      return "#4caf50"; // 🟢 bình thường
    };
  

  const placeholders = {
    age: "Nhập tuổi",
    gender: "",
    pulse_rate: "Nhập nhịp tim",
    systolic_bp: "Nhập huyết áp tâm thu",
    diastolic_bp: "Nhập huyết áp tâm trương",
    glucose: "Nhập chỉ số đường huyết",
    height: "Nhập chiều cao (m) ví dụ 1.70",
    weight: "Nhập cân nặng (kg)",
    bmi: "",
    family_diabetes: "",
    hypertensive: "",
    family_hypertension: "",
    // cardiovascular_disease: "",
    // stroke: "",
  };

  const booleanFields = [
    "family_diabetes",
    "hypertensive",
    "family_hypertension",
    // "cardiovascular_disease",
    // "stroke",
  ];

  const handleReset = () => {
    setFormData({
      age: "",
      gender: "",
      pulse_rate: "",
      systolic_bp: "",
      diastolic_bp: "",
      glucose: "",
      height: "",
      weight: "",
      bmi: "",
      family_diabetes: "",
      hypertensive: "",
      family_hypertension: "",
      // cardiovascular_disease: "",
      // stroke: "",
    });
    setResult(null);
    setShowChart(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "height" || name === "weight") {
      const height = parseFloat(updatedFormData.height.replace(",", "."));
      const weight = parseFloat(updatedFormData.weight.replace(",", "."));
      if (!isNaN(height) && !isNaN(weight) && height > 0) {
        const bmi = weight / (height * height);
        updatedFormData.bmi = bmi.toFixed(2);
      } else {
        updatedFormData.bmi = "";
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowChart(false);

    const numericData = {
      age: Number(formData.age || 0),
      gender: Number(formData.gender || 0),
      pulse_rate: Number(formData.pulse_rate || 0),
      systolic_bp: Number(formData.systolic_bp || 0),
      diastolic_bp: Number(formData.diastolic_bp || 0),
      glucose: Number(formData.glucose || 0),
      height: Number(formData.height || 0),
      weight: Number(formData.weight || 0),

      family_diabetes: Number(formData.family_diabetes ?? 0),
      hypertensive: Number(formData.hypertensive ?? 0),
      family_hypertension: Number(formData.family_hypertension ?? 0),
    };

    const userId = localStorage.getItem("user_id");
    const response = await predictDiabetes({
      ...numericData,
      user_id: parseInt(userId),
    });
    setResult(response);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <HeaderTop />
      <Navbar />
      <div className="patient-form-container">
        <h2 className="form-title">🩺 DỰ ĐOÁN NGUY CƠ BỆNH TIỂU ĐƯỜNG</h2>
        <p className="form-subtitle">
          Nhập các chỉ số theo yêu cầu để bắt đầu dự đoán
        </p>
        <form onSubmit={handleSubmit} className="form-grid">
          {Object.keys(formData).map((key) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{labels[key]}</label>

              {key === "gender" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
              ) : booleanFields.includes(key) ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Chọn --</option>
                  <option value="0">Không</option>
                  <option value="1">Có</option>
                </select>
              ) : (
                <input
                  type="text"
                  name={key}
                  id={key}
                  value={formData[key]}
                  autoComplete="off"
                  onChange={handleChange}
                  readOnly={key === "bmi"}
                  className={`form-input ${
                    key === "bmi" ? "readonly-field" : ""
                  } ${key === "bmi" && formData.bmi ? "filled-bmi" : ""}`}
                  placeholder={placeholders[key]}
                  required
                />
              )}
            </div>
          ))}
          {/* <div className="form-actions">
            <button type="submit" className="submit-button">
              🔍 Dự đoán
            </button>
          </div> */}
          <div className="form-actions">
            <button type="submit" className="submit-button">
              🔍 Dự đoán
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
            >
              ✨ Nhập lại
            </button>
          </div>
        </form>

        {result && (
          <div className="result-box">
            <h4>🎯 Kết quả dự đoán</h4>
            <p>🎯 Mức nguy cơ: {result.risk_level}</p>

            <p>📊 Xác suất: {(result.probability * 100).toFixed(2)}%</p>

            {!showChart && (
              <button
                onClick={() => setShowChart(!showChart)}
                className="compare-chart-button"
              >
                📊 {showChart ? "Ẩn biểu đồ so sánh" : "Xem biểu đồ so sánh"}
              </button>
            )}

            {showChart && (
              <div className="chart-box" style={{ marginTop: "24px" }}>
                <h5>📊 So sánh chỉ số sức khỏe với ngưỡng y khoa tiêu chuẩn</h5>
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      background:
                        Number(formData.age) < 30
                          ? "#4caf50"
                          : Number(formData.age) <= 50
                            ? "#ff9800"
                            : "#f44336",
                      color: "#fff",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {ageGroupLabel(Number(formData.age))} ({formData.age} tuổi)
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={800}>
                  <BarChart
                    data={[
                      {
                        name: "Đường huyết",
                        user: Number(formData.glucose) || 0,
                        normal: 5.5,
                        normalMin: 3.9,
                        normalMax: 7,
                      },
                      {
                        name: "BMI",
                        user: Number(formData.bmi) || 0,
                        normal: 22,
                        normalMin: 18.5,
                        normalMax: 24.9,
                      },
                      {
                        name: "Huyết áp tâm thu",
                        user: Number(formData.systolic_bp) || 0,
                        normal: 110,
                        normalMin: 90,
                        normalMax: 120,
                      },
                      {
                        name: "Huyết áp tâm trương",
                        user: Number(formData.diastolic_bp) || 0,
                        normal: 75,
                        normalMin: 60,
                        normalMax: 80,
                      },
                      {
                        name: "Nhịp tim",
                        user: Number(formData.pulse_rate) || 0,
                        normal: 80,
                        normalMin: 60,
                        normalMax: 100,
                      },
                      /* {
                        name: "Nhóm tuổi",
                        user: Number(formData.age),
                        isAge: true,
                      }, */
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 20 }} />
                    <YAxis tick={{ fontSize: 20 }} />
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
                                  {isUser ? "Người dùng" : "Ngưỡng"}:{" "}
                                  {entry.value}
                                </p>
                              );
                            })}
                          </div>
                        );
                      }}
                    />
                    <Legend />

                    {/* 🔵 NGƯỜI DÙNG */}
                    <Bar
                      dataKey="user"
                      name="Người dùng"
                      fill="#3650df"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;

                        let color = "#4caf50"; // mặc định xanh

                        // 🎯 TUỔI
                        if (payload.isAge) {
                          const age = payload.user;

                          if (age < 30)
                            color = "#4caf50"; // xanh
                          else if (age <= 50)
                            color = "#ff9800"; // vàng
                          else color = "#f44336"; // đỏ

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
                                fontSize={14}
                                fill="#000"
                              >
                                {ageGroupLabel(age)} ({age})
                              </text>
                            </g>
                          );
                        }

                        // 🎯 CÁC CHỈ SỐ KHÁC
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
                              fontSize={14}
                              fill="#000"
                            >
                              {payload.isAge
                                ? `${ageGroupLabel(payload.user)} (${payload.user})`
                                : payload.user}
                            </text>
                          </g>
                        );
                      }}
                    />

                    {/* 🟢 NGƯỠNG BÌNH THƯỜNG */}
                    <Bar
                      dataKey="normal"
                      name="Ngưỡng bình thường"
                      fill="#2ca530"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;

                        // ❌ bỏ tuổi
                        if (payload.isAge) return null;

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
                              fontSize={14}
                              fill="#000"
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
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PatientForm;
