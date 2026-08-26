import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import PatientForm from './components/pages/PatientForm';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import History from "./components/pages/History";
import ScrollToTop from "./ScrollToTop";

// src/index.js hoặc src/App.js


/* function App() {
  return (
    <div>
      <HomePage />
    </div>
  );
} */

//   // 🔹 1. Component bảo vệ trang CẦN ĐĂNG NHẬP (History, Prediction...)
// const ProtectedRoute = () => {
//   const isAuthenticated = !!localStorage.getItem("user_id");
//   // Chưa đăng nhập -> Đá về trang /login
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// 🔹 2. Component bảo vệ trang DÀNH CHO GUEST (Login, Register...)
const GuestRoute = () => {
  const isAuthenticated = !!localStorage.getItem("user_id");
  // Đã đăng nhập -> Đá về trang chủ /
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

  function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/prediction" element={<PatientForm />} />
        <Route path="/history" element={<History />} />

        {/* Trang BẮT BUỘC ĐĂNG NHẬP mới vào được
        <Route element={<ProtectedRoute />}>
          <Route path="/prediction" element={<PatientForm />} />
          <Route path="/history" element={<History />} />
        </Route> */}

        {/* Trang CHỈ DÀNH CHO KHÁCH (Chưa đăng nhập) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        </Route>
        {/* Route mặc định khi nhập sai URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;
