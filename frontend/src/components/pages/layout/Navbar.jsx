import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { logoutUser } from "../../../services/auth";
import "../css/Navbar.css";

const navItems = [
  { text: "TRANG CHỦ", path: "/", targetId: "home", icon: "lni-home" },
  { text: "HƯỚNG DẪN", path: "/", targetId: "intrust", icon: "lni-book" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handlePredictClick = () => {
    closeMenus();
    if (location.pathname === "/prediction") window.location.reload();
    else navigate("/prediction");
  };

  const scrollTo = (path, targetId) => {
    closeMenus();
    if (window.location.pathname === path) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      localStorage.setItem("scrollTo", targetId);
      navigate(path);
    }
  };

  const handleLogout = () => {
    closeMenus();
    logoutUser().catch(() => {});
    navigate("/login");
  };

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <a className="site-navbar-brand" href="/" aria-label="Medic Diabetes - Trang chủ">
          <img src="/assets/img/logo/logo.svg" alt="Medic Diabetes" />
        </a>
        <button type="button" className="nav-toggle" aria-label="Mở menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen((open) => !open)}>
          <span></span><span></span><span></span>
        </button>
        <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} aria-label="Điều hướng chính">
          <div className="site-nav-links">
            {navItems.map((item) => (
              <button type="button" className="site-nav-link" key={item.text} onClick={() => scrollTo(item.path, item.targetId)}>
                <i className={`lni ${item.icon}`} aria-hidden="true"></i><span>{item.text}</span>
              </button>
            ))}
            {userId && <button type="button" className="site-nav-link" onClick={handlePredictClick}><i className="lni lni-stats-up" aria-hidden="true"></i><span>DỰ ĐOÁN</span></button>}
            {userId ? (
              <div className="user-menu">
                <button type="button" className="site-nav-link user-menu-trigger" aria-expanded={isUserMenuOpen} onClick={() => setIsUserMenuOpen((open) => !open)}>
                  <i className="lni lni-user" aria-hidden="true"></i><span>{username}</span><FiChevronDown className="user-menu-arrow" aria-hidden="true" />
                </button>
                {isUserMenuOpen && <div className="user-menu-panel"><button type="button" onClick={() => { closeMenus(); navigate("/history"); }}>📊 Lịch sử dự đoán</button><button type="button" onClick={handleLogout}>🚪 Đăng xuất</button></div>}
              </div>
            ) : <button type="button" className="site-nav-link" onClick={() => { closeMenus(); navigate("/login"); }}><i className="lni lni-user" aria-hidden="true"></i><span>ĐĂNG NHẬP</span></button>}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
