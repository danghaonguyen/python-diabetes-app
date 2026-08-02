import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth";
import "./css/Auth.css";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
  const [step, setStep] = useState("form");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔥 tách password toggle riêng (fix UX bug)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ================= SEND CODE =================
  const handleSendCode = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return toast.warning("Vui lòng nhập đầy đủ thông tin");
    }

    const emailClean = email.trim();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return toast.warning("Mật khẩu phải >= 8 ký tự, gồm chữ + số");
    }

    if (password !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp");
    }

    try {
      await fetch("http://127.0.0.1:5000/api/send_verification_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailClean }),
      });

      toast.success("Đã gửi mã xác thực");

      setVerificationCode(""); // 🔥 reset tránh lỗi cũ
      setStep("verify");
    } catch (err) {
      toast.error("Không thể gửi mã xác thực");
    }
  };

  // ================= VERIFY + REGISTER =================
  const handleVerifyAndRegister = async () => {
    if (!verificationCode.trim()) {
      return toast.warning("Nhập mã xác thực");
    }

    try {
      const res = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
        code: verificationCode.trim(),
      });

      toast.success(res.data.message);

      if (res.status === 201) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  // ================= UI =================
  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">Đăng Ký</h2>

        {step === "form" ? (
          <>
            <input
              type="text"
              placeholder="Họ tên"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="input-with-toggle">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "ẨN" : "HIỆN"}
              </button>
            </div>

            <div className="input-with-toggle">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "ẨN" : "HIỆN"}
              </button>
            </div>

            <button className="auth-button" onClick={handleSendCode}>
              Gửi mã xác thực
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nhập mã xác thực đã gửi email"
              className="auth-input"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />

            <button className="auth-button" onClick={handleVerifyAndRegister}>
              Xác nhận & Đăng ký
            </button>

            <p
              style={{ cursor: "pointer", color: "#007bff", marginTop: 10 }}
              onClick={() => setStep("form")}
            >
              ← Quay lại
            </p>
          </>
        )}

        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>

        <Link to="/" className="back-home">
          ← Quay về Trang chủ
        </Link>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Register;