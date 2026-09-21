import React from "react";
import "../css/Features.css";

const features = [
  { icon: "/assets/img/we-do/glucose-logo.png", title: "Đường huyết", description: "Theo dõi mức glucose trong máu." },
  { icon: "/assets/img/we-do/bmi-logo.png", title: "BMI", description: "Đánh giá tương quan chiều cao và cân nặng." },
  { icon: "/assets/img/we-do/hypertensive-logo.png", title: "Huyết áp", description: "Quan sát sức khỏe tim mạch hằng ngày." },
  { icon: "/assets/img/we-do/family-logo.png", title: "Tiền sử gia đình", description: "Bổ sung yếu tố nguy cơ di truyền." },
];

const Features = () => (
  <section className="features-section">
    <div className="container text-center">
      <p className="section-subtitle">CÁC CHỈ SỐ CỐT LÕI</p>
      <h2 className="section-title">Theo dõi những chỉ số quan trọng</h2>
      <p className="section-desc">Cung cấp thông tin cần thiết để bạn hiểu kết quả dự đoán và theo dõi sức khỏe đều đặn hơn.</p>
      <div className="heartbeat-img"><img src="/assets/img/we-do/graph-img.svg" alt="heartbeat" /></div>
      <div className="features-wrapper">
        {features.map((item) => <div key={item.title} className="feature-box"><div className="feature-icon"><img src={item.icon} alt="" /></div><h3>{item.title}</h3><p>{item.description}</p></div>)}
      </div>
    </div>
  </section>
);

export default Features;
