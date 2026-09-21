import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { tns } from "tiny-slider";
import "tiny-slider/dist/tiny-slider.css";
import "../css/Slider.css";

const slides = [
  { eyebrow: "MEDIC DIABETES · THEO DÕI SỨC KHỎE", title: "ỨNG DỤNG DỰ ĐOÁN NGUY CƠ BỆNH TIỂU ĐƯỜNG", description: "Giải pháp theo dõi sức khỏe toàn diện, cảnh báo sớm và hỗ trợ ngăn ngừa biến chứng từ bệnh tiểu đường.", image: "/assets/img/slider/slider-1.jpg" },
  { eyebrow: "PHÂN TÍCH DỮ LIỆU CÁ NHÂN", title: "PHÂN TÍCH CHỈ SỐ VÀ ĐƯA RA KẾT QUẢ", description: "Hệ thống sử dụng trí tuệ nhân tạo để phân tích chỉ số đường huyết, BMI, huyết áp... và đưa ra dự đoán nguy cơ cá nhân.", image: "/assets/img/slider/slider-2.jpg" },
  { eyebrow: "CHỦ ĐỘNG TỪ HÔM NAY", title: "PHÁT HIỆN SỚM VÀ NGĂN NGỪA PHÒNG BỆNH", description: "Chủ động kiểm soát tình trạng sức khỏe, theo dõi diễn biến chỉ số và phòng ngừa từ giai đoạn sớm.", image: "/assets/img/slider/slider-3.jpg" },
];

const Slider = () => {
  useEffect(() => {
    let slider = null;
    const timer = setTimeout(() => {
      slider = tns({ container: ".slider-active", items: 1, slideBy: "page", autoplay: true, autoplayTimeout: 3000, autoplayButtonOutput: false, controls: false, nav: true, loop: true, rewind: false, mouseDrag: true });
    }, 100);
    return () => { clearTimeout(timer); if (slider && typeof slider.destroy === "function") slider.destroy(); };
  }, []);

  return (
    <section className="slider-section" aria-label="Giới thiệu Medic Diabetes">
      <div className="slider-active">
        {slides.map((slide) => (
          <div key={slide.title} className="single-slider">
            <img src={slide.image} alt="" className="slider-bg-img" />
            <div className="container">
              <div className="slider-content">
                <span className="slider-eyebrow">{slide.eyebrow}</span>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <div className="slider-actions">
                  <Link to="/prediction" className="slider-action-primary">Bắt đầu dự đoán <span aria-hidden="true">→</span></Link>
                  <a href="#intrust" className="slider-action-secondary">Xem hướng dẫn</a>
                </div>
                <div className="slider-trust-line"><span>✓ Phân tích chỉ số</span><span>✓ Theo dõi lịch sử</span><span>✓ Chủ động phòng ngừa</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Slider;
