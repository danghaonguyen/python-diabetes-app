import React from 'react';
import './css/Intrust.css'; 

const instructions = [
  { icon: 'lni-user', title: 'Bước 1: Đăng nhập / Đăng ký', desc: 'Tạo tài khoản hoặc đăng nhập để có thể sử dụng ứng dụng.' },
  { icon: 'lni-pointer', title: 'Bước 2: Chọn mục Dự đoán', desc: 'Truy cập vào mục "Dự đoán bệnh tiểu đường" trên thanh menu.' },
  { icon: 'lni-pencil-alt', title: 'Bước 3: Nhập các chỉ số yêu cầu', desc: 'Điền đầy đủ các chỉ số sức khỏe như đường huyết, BMI, huyết áp...' },
  { icon: 'lni-control-panel', title: 'Bước 4: Bấm Dự đoán', desc: 'Ứng dụng sẽ phân tích và đưa ra kết quả nguy cơ mắc bệnh.' },
  { icon: 'lni-bar-chart', title: 'Bước 5: Xem Biểu đồ so sánh', desc: 'Biểu đồ hiển thị so sánh chỉ số của bạn với ngưỡng an toàn.' },
  { icon: 'lni-folder', title: 'Bước 6: Có thể xem lại lịch sử ', desc: 'Lưu lại các lần dự đoán để theo dõi và đánh giá sức khỏe lâu dài.' },
];

const Intrust = () => (
  <section id="intrust" className="intrust-section pt-100 pb-100">
    <div className="container">
      <div className="section-title text-center">
        <h2>Hướng dẫn sử dụng</h2>
        <p>Ứng dụng dự đoán nguy cơ bệnh tiểu đường.</p>
      </div>
      <div className="row">
        {instructions.map((item, index) => (
          <div className="col-lg-4 col-md-6" key={index}>
            <div className="single-intrust text-center">
              <i className={`lni ${item.icon}`}></i>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Intrust;
