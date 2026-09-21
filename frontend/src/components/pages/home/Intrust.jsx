import React from "react";
import "../css/Intrust.css";

const instructions = [
  { icon: "lni-user", title: "Tạo tài khoản", desc: "Đăng ký hoặc đăng nhập để lưu lại dữ liệu sức khỏe." },
  { icon: "lni-pointer", title: "Mở mục Dự đoán", desc: "Chọn Dự đoán trên thanh điều hướng để bắt đầu." },
  { icon: "lni-pencil-alt", title: "Nhập chỉ số", desc: "Điền đường huyết, BMI, huyết áp và các thông tin liên quan." },
  { icon: "lni-control-panel", title: "Nhận kết quả", desc: "Hệ thống phân tích dữ liệu và đưa ra mức nguy cơ tham khảo." },
  { icon: "lni-bar-chart", title: "Xem so sánh", desc: "Đối chiếu chỉ số cá nhân với ngưỡng tham khảo trên biểu đồ." },
  { icon: "lni-folder", title: "Theo dõi lịch sử", desc: "Xem lại các lần dự đoán để quan sát thay đổi theo thời gian." },
];

const Intrust = () => (
  <section id="intrust" className="intrust-section pt-100 pb-100">
    <div className="container">
      <div className="section-title text-center"><h2>Quy trình sử dụng</h2><p>Thực hiện theo các bước đơn giản để bắt đầu theo dõi sức khỏe.</p></div>
      <div className="row instruction-grid">{instructions.map((item, index) => <div className="col-lg-4 col-md-6" key={item.title}><div className="single-intrust"><span className="instruction-number">{String(index + 1).padStart(2, "0")}</span><i className={`lni ${item.icon}`} aria-hidden="true"></i><h4>{item.title}</h4><p>{item.desc}</p></div></div>)}</div>
    </div>
  </section>
);

export default Intrust;
