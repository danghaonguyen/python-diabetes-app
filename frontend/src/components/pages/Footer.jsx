import React from "react";
import "./css/Footer.css";

const Footer = () => {
  return (
    <footer
      className="footer-section"
      style={{ backgroundColor: "#1e293b", color: "#cbd5e1" }}
    >
      <div
        className="container footer-content"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "40px 20px",
          flexWrap: "wrap",
        }}
      >
        <div
          className="footer-col"
          style={{ flex: "1 1 280px", marginBottom: "30px" }}
        >
          <img
            src="/assets/img/logo/logo.svg"
            alt="Logo"
            className="footer-logo"
            style={{ width: "180px", height: "auto", marginBottom: "15px" }}
          />
          <p style={{ lineHeight: "1.6", fontSize: "16px", maxWidth: "320px" }}>
            Ứng dụng tiên phong trong việc dự đoán nguy cơ mắc bệnh tiểu đường,
            hỗ trợ theo dõi và cải thiện sức khỏe của bạn mỗi ngày.
          </p>
          <div className="footer-socials" style={{ marginTop: "20px" }}>
            <a
              href="#facebook"
              style={{
                marginRight: "15px",
                color: "#cbd5e1",
                fontSize: "20px",
              }}
            >
              <i className="lni lni-facebook-filled" />
            </a>
            <a
              href="#github"
              style={{
                marginRight: "15px",
                color: "#cbd5e1",
                fontSize: "20px",
              }}
            >
              <i className="lni lni-github-original" />
            </a>
            <a href="#instagram" style={{ color: "#cbd5e1", fontSize: "20px" }}>
              <i className="lni lni-instagram-filled" />
            </a>
          </div>
        </div>

        

        

        <div
          className="footer-col"
          style={{ flex: "1 1 250px", marginBottom: "30px" }}
        >
          <h4
            style={{
              borderBottom: "2px solid #00aabb",
              paddingBottom: "8px",
              marginBottom: "15px",
            }}
          >
            Địa Chỉ Y Tế
          </h4>
          <iframe
            title="Google map of medical location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1260734411057!2d106.3439443758779!3d9.92345687434543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a019e205ae8969%3A0xddb4876985fbda25!2zQuG7h25oIHZp4buHbiBUcsaw4budbmcgxJDhuqFpIEjhu41jIFRyw6AgVmluaA!5e0!3m2!1svi!2sus!4v1748882750290!5m2!1svi!2sus"
            width="600"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div
        className="footer-bottom"
        style={{
          backgroundColor: "#15212b",
          padding: "15px 0",
          textAlign: "center",
          color: "#718096",
          fontSize: "14px",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          boxSizing: "border-box",
        }}
      >
        <p>ỨNG DỤNG DỰ ĐOÁN NGUY CƠ BỆNH TIỂU ĐƯỜNG</p>
      </div>
    </footer>
  );
};

export default Footer;
