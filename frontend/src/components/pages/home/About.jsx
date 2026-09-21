import React from "react";
import "../css/About.css";

const About = () => (
  <section id="about" className="about-section pt-100 pb-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="about-content">
            <span className="about-eyebrow">TỔNG QUAN HỆ THỐNG</span>
            <h2>Theo dõi sức khỏe mỗi ngày</h2>
            <p>Medic Diabetes giúp bạn nhìn lại các chỉ số quan trọng, nhận biết dấu hiệu rủi ro và theo dõi thay đổi sức khỏe theo thời gian.</p>
            <ul className="about-list">
              <li><i className="lni lni-checkmark-circle"></i> Theo dõi đường huyết và BMI</li>
              <li><i className="lni lni-checkmark-circle"></i> Phân tích huyết áp và tiền sử gia đình</li>
              <li><i className="lni lni-checkmark-circle"></i> Lưu kết quả để theo dõi lâu dài</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="about-data-panel">
            <div className="about-panel-heading"><span className="about-panel-dot"></span><span>Tổng quan sức khỏe</span><strong>MEDIC</strong></div>
            <div className="about-data-grid">
              <div><strong>05</strong><span>Chỉ số được phân tích</span></div>
              <div><strong>03</strong><span>Nhóm yếu tố gia đình</span></div>
              <div><strong>01</strong><span>Kết quả dự đoán rõ ràng</span></div>
              <div><strong>24/7</strong><span>Chủ động theo dõi</span></div>
            </div>
            <div className="about-panel-note"><span aria-hidden="true">✓</span><p>Dữ liệu được trình bày trực quan để bạn dễ hiểu và dễ trao đổi với nhân viên y tế.</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
