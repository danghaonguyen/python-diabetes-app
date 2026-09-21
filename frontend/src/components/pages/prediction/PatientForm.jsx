import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { predictDiabetes } from "../../../services/api";
import Footer from "../layout/Footer";
import HeaderTop from "../layout/HeaderTop";
import Navbar from "../layout/Navbar";
import PredictionChart from "./PredictionChart";
import "../css/PatientForm.css";
import "../css/Navbar.css";

const initialFormData = {
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
};

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
  family_hypertension: "Tiền sử cao huyết áp trong gia đình",
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
};

const booleanFields = ["family_diabetes", "hypertensive", "family_hypertension"];

function PatientForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user_id")) {
      toast.warning("Bạn cần đăng nhập để sử dụng chức năng này!");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setShowChart(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "height" || name === "weight") {
      const height = parseFloat(updatedFormData.height.replace(",", "."));
      const weight = parseFloat(updatedFormData.weight.replace(",", "."));
      updatedFormData.bmi = !Number.isNaN(height) && !Number.isNaN(weight) && height > 0
        ? (weight / (height * height)).toFixed(2)
        : "";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

    const measurements = [numericData.age, numericData.pulse_rate, numericData.systolic_bp, numericData.diastolic_bp, numericData.glucose, numericData.height, numericData.weight];
    if (measurements.some((value) => !Number.isFinite(value) || value <= 0)) {
      toast.error("Vui lòng nhập tất cả chỉ số bằng số dương.");
      return;
    }

    try {
      const response = await predictDiabetes({
        ...numericData,
        user_id: parseInt(localStorage.getItem("user_id"), 10),
      });
      setResult(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể dự đoán. Vui lòng thử lại.");
    }
  };

  const renderField = (key) => (
    <div className="form-group" key={key}>
      <label htmlFor={key}>{labels[key]}</label>
      {key === "gender" || booleanFields.includes(key) ? (
        <select name={key} value={formData[key]} onChange={handleChange} className="form-input" required>
          <option value="">{key === "gender" ? "-- Chọn giới tính --" : "-- Chọn --"}</option>
          {key === "gender" ? <><option value="1">Nam</option><option value="0">Nữ</option></> : <><option value="0">Không</option><option value="1">Có</option></>}
        </select>
      ) : (
        <input type="text" name={key} id={key} value={formData[key]} autoComplete="off" onChange={handleChange} readOnly={key === "bmi"} className={`form-input ${key === "bmi" ? "readonly-field" : ""} ${key === "bmi" && formData.bmi ? "filled-bmi" : ""}`} placeholder={placeholders[key]} required />
      )}
    </div>
  );

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <HeaderTop />
      <Navbar />
      <div className="patient-form-container">
        <h2 className="form-title">🩺 DỰ ĐOÁN NGUY CƠ BỆNH TIỂU ĐƯỜNG</h2>
        <p className="form-subtitle">Nhập các chỉ số theo yêu cầu để bắt đầu dự đoán</p>
        <form onSubmit={handleSubmit} className="form-grid">
          {Object.keys(formData).map(renderField)}
          <div className="form-actions">
            <button type="submit" className="submit-button">🔍 Dự đoán</button>
            <button type="button" onClick={handleReset} className="reset-button">✨ Nhập lại</button>
          </div>
        </form>
        {result && (
          <div className="result-box">
            <h4>🎯 Kết quả dự đoán</h4>
            <p>🎯 Mức nguy cơ: {result.risk_level}</p>
            <p>📊 Xác suất: {(result.probability * 100).toFixed(2)}%</p>
            {!showChart && <button onClick={() => setShowChart(true)} className="compare-chart-button">📊 Xem biểu đồ so sánh</button>}
            {showChart && <PredictionChart formData={formData} onClose={() => setShowChart(false)} />}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PatientForm;
