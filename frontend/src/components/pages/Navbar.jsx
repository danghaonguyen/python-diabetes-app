import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/Navbar.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const navItems = [
  { text: "TRANG CHỦ", path: "/", targetId: "home", icon: "lni-home" },
  { text: "HƯỚNG DẪN", path: "/", targetId: "intrust", icon: "lni-book" },
  /*   { text: "LIÊN HỆ", path: "/", targetId: "contact", icon: "lni-phone" }, */
];

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const handlePredictClick = (e) => {
    if (location.pathname === "/prediction") {
      window.location.reload(); // reload lại trang nếu đã ở prediction
    } else {
      navigate("/prediction"); // chuyển tới prediction
    }
  };

  const scrollTo = (path, targetId) => {
    if (window.location.pathname === path) {
      const section = document.getElementById(targetId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      localStorage.setItem("scrollTo", targetId);
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    navigate("/login");
  };

  /* const goToPersonalInfo = () => {
    navigate("/personal-info");
    setShowDropdown(false);
  }; */

  const goToPredictionHistory = () => {
    navigate("/history");
    setShowDropdown(false);
  };

  /*  const goResetPassword = () => {
    navigate("/reset-password");
    setShowDropdown(false);
  }; */

  return (
    <div className="navbar-area bg-white shadow-sm sticky-top">
      <div className="container">
        <nav className="navbar navbar-expand-lg align-items-center py-4">
          <a className="navbar-brand me-lg-5" href="/">
            <img src="/assets/img/logo/logo.svg" alt="Logo" />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="toggler-icon"></span>
            <span className="toggler-icon"></span>
            <span className="toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav gap-2 me-lg-3">
              {navItems.map((item, idx) => (
                <li key={idx} className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={() => scrollTo(item.path, item.targetId)}
                  >
                    <i
                      className={`lni ${item.icon}`}
                      style={{
                        fontSize: "19px",
                        position: "relative",
                        top: "-1px",
                        marginRight: "5px",
                      }}
                    ></i>
                    <span>{item.text}</span>
                  </button>
                </li>
              ))}

              {userId && (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handlePredictClick}
                    >
                      <i className="lni lni-stats-up me-1"></i> DỰ ĐOÁN
                    </button>
                  </li>

                  <li className="nav-item dropdown position-relative">
                    <button
                      className="nav-link btn btn-link"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <i className="lni lni-user"></i> {username}{" "}
                      <span className="arrow">▼</span>
                    </button>

                    {showDropdown && (
                      <div className="dropdown-user position-absolute">
                        {/*  <button
                          className="dropdown-item"
                          onClick={goToPersonalInfo}
                        >
                          <span className="icon">👤</span> Thông tin cá nhân
                        </button> */}
                        <button
                          className="dropdown-item"
                          onClick={goToPredictionHistory}
                        >
                          <span className="icon">📊</span> Lịch sử dự đoán
                        </button>
                        {/*  <button
                          className="dropdown-item"
                          onClick={goResetPassword}
                        >
                          <span className="icon">🔑</span> Đổi mật khẩu
                        </button> */}
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          <span className="icon">🚪</span> Đăng xuất
                        </button>
                      </div>
                    )}
                  </li>
                </>
              )}

              {!userId && (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={() => navigate("/login")}
                  >
                    <i className="lni lni-user"></i> Đăng nhập
                  </button>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
