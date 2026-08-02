// Introduction.jsx
import React from "react";
import "./css/Introduction.css"; // giữ nguyên nếu vẫn dùng style này

const systems = [
  {
    icon: "lni lni-cog",
    title: "Trí Tuệ Nhân Tạo",
    desc: "Phân tích dữ liệu sức khỏe bằng mô hình học máy hiện đại.",
  },
  {
    icon: "lni lni-bar-chart",
    title: "Dự Đoán Nguy Cơ",
    desc: "Ước tính nguy cơ mắc tiểu đường theo chỉ số cá nhân.",
  },
  {
    icon: "lni lni-cloud-upload",
    title: "Sử Dụng Nhanh Chóng",
    desc: "Không cần cài đặt, truy cập dễ dàng qua trình duyệt.",
  },
];

const Introduction = () => {
  return (
    <section className="doctor-section" id="introduction">
      <div className="container text-center">
        <h2 className="section-title">Ứng dụng Phân tích Sức Khỏe</h2>
        <p className="section-desc">
          Ứng dụng sử dụng công nghệ trí tuệ nhân tạo để hỗ trợ theo dõi và dự đoán nguy cơ tiểu đường.
        </p>
        <div className="row justify-content-center">
          {systems.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="doctor-card p-4">
                <div className="icon mb-3">
                  <i
                    className={item.icon}
                    style={{ fontSize: "40px", color: "#00AABB" }}
                  ></i>
                </div>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
