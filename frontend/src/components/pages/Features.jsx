import React from "react";
import "./css/Features.css";

const features = [
  {
    icon: "/assets/img/we-do/glucose-logo.png",
    title: "Đường huyết",
  },
  {
    icon: "/assets/img/we-do/bmi-logo.png",
    title: "BMI",
  },
  {
    icon: "/assets/img/we-do/hypertensive-logo.png",
    title: "Huyết áp",
  },
  {
    icon: "/assets/img/we-do/family-logo.png",
    title: "Tiền sử gia đình",
  },
  
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="container text-center">
        <p className="section-subtitle">Hiểu Rõ Cơ Thể Bạn Qua Các Chỉ Số Sinh Học</p>
        <h2 className="section-title">Các Chỉ Số Sức Khỏe Quan Trọng</h2>
        <p className="section-desc">
          Tổng hợp và phân tích các chỉ số sức khỏe để đưa ra kết quả dự đoán sớm và giải pháp chủ động phòng ngừa cá nhân hóa.
        </p>

        <div className="heartbeat-img">
          <img src="/assets/img/we-do/graph-img.svg" alt="heartbeat" />
        </div>

    <div className="features-wrapper">
          {features.map((item, index) => (
            <div key={index} className="feature-box">
              <div className="feature-icon">
                <img src={item.icon} alt={item.title} />
              </div>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
