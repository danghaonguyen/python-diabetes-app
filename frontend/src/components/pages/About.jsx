import React from 'react';
import './css/About.css';

const About = () => (
  <section id="about" className="about-section pt-100 pb-100">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="about-content">
            <div className="section-title">
              <h2>Giải Pháp Giúp Theo Dõi Sức Khỏe và Ngăn Ngừa Bệnh Tiểu Đường <br /></h2>
              <p>
                Ứng dụng giúp theo dõi và quản lý chỉ số đường huyết hiệu quả, hỗ trợ cho người bệnh và cảnh báo sớm nguy cơ biến chứng.
              </p>
            </div>
            <ul className="about-list">
              <li><i className="lni lni-checkmark-circle"></i> Theo dõi đường huyết liên tục</li>
              <li><i className="lni lni-checkmark-circle"></i> Phân tích chỉ số BMI & huyết áp</li>
              <li><i className="lni lni-checkmark-circle"></i> Tổng hợp dữ liệu sức khỏe cá nhân</li>
              <li><i className="lni lni-checkmark-circle"></i> Dự đoán sớm nguy cơ tiểu đường</li>
              <li><i className="lni lni-checkmark-circle"></i> Gợi ý chăm sóc & phòng ngừa cá nhân hóa</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="about-img">
            <img src="/assets/img/diabeties.jpg" alt="about" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
