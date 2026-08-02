import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  sendPasswordResetEmail,
  verifyResetCode,
  resetPassword,
} from "../../services/auth";
import "./css/Auth.css";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotStep, setForgotStep] = useState(null);

  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await loginUser({
        email: email.trim(),
        password,
      });

      toast.success(res.data.message);

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("username", res.data.username);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  // ================= SEND RESET EMAIL =================
  const handleSendResetEmail = async () => {
    if (!resetEmail.trim()) {
      toast.warning("Vui lòng nhập email");
      return;
    }

    try {
      await sendPasswordResetEmail({ email: resetEmail.trim() });

      toast.success("Mã xác thực đã gửi tới email");

      setResetCode(""); // 🔥 reset code cũ tránh lỗi
      setForgotStep("verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi mã thất bại");
    }
  };

  // ================= VERIFY CODE =================
  const handleVerifyResetCode = async () => {
    if (!resetCode.trim()) {
      toast.warning("Vui lòng nhập mã xác thực");
      return;
    }

    try {
      await verifyResetCode({
        email: resetEmail.trim(),
        code: resetCode.trim(),
      });

      toast.success("Xác thực thành công");

      setForgotStep("reset");
    } catch (err) {
      console.log("VERIFY ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Mã xác thực không đúng");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      toast.warning("Vui lòng nhập đầy đủ mật khẩu");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    try {
      await resetPassword({
        email: resetEmail.trim(),
        code: resetCode.trim(),
        new_password: newPassword,
      });

      toast.success("Đổi mật khẩu thành công");

      setTimeout(() => {
        setForgotStep(null);
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* LOGIN */}
        {forgotStep === null && (
          <>
            <h2 className="auth-title">Đăng Nhập</h2>

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

            <button className="auth-button" onClick={handleLogin}>
              Đăng Nhập
            </button>

            <p
              style={{ cursor: "pointer", color: "#007bff", marginTop: 10 }}
              onClick={() => setForgotStep("email")}
            >
              Quên mật khẩu?
            </p>

            <p className="auth-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </p>

            <Link to="/" className="back-home">
              ← Quay về Trang chủ
            </Link>
          </>
        )}

        {/* EMAIL */}
        {forgotStep === "email" && (
          <>
            <h2 className="auth-title">Đặt Lại Mật Khẩu</h2>

            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="auth-input"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button className="auth-button" onClick={handleSendResetEmail}>
              Gửi mã xác thực
            </button>

            <p
              style={{ cursor: "pointer", color: "#007bff", marginTop: 10 }}
              onClick={() => setForgotStep(null)}
            >
              ← Quay lại đăng nhập
            </p>
          </>
        )}

        {/* VERIFY */}
        {forgotStep === "verify" && (
          <>
            <h2 className="auth-title">Xác Thực Mã</h2>

            <input
              type="text"
              placeholder="Nhập mã xác thực"
              className="auth-input"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />

            <button className="auth-button" onClick={handleVerifyResetCode}>
              Xác thực
            </button>

            <p
              style={{ cursor: "pointer", color: "#007bff", marginTop: 10 }}
              onClick={() => setForgotStep("email")}
            >
              ← Quay lại nhập email
            </p>
          </>
        )}

        {/* RESET */}
        {forgotStep === "reset" && (
          <>
            <h2 className="auth-title">Đổi Mật Khẩu Mới</h2>

            <div className="input-with-toggle">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                className="auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
              className="auth-input"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <button className="auth-button" onClick={handleResetPassword}>
              Đổi mật khẩu
            </button>

            <p
              style={{ cursor: "pointer", color: "#007bff", marginTop: 10 }}
              onClick={() => setForgotStep("email")}
            >
              ← Quay lại nhập email
            </p>
          </>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Login;