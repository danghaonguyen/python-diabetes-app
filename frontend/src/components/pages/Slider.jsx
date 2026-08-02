import React, { useEffect } from "react";
import { tns } from "tiny-slider/src/tiny-slider";
import "tiny-slider/dist/tiny-slider.css";
import "./css/Slider.css"; // Bạn cần đảm bảo file này chứa CSS như bên dưới

const slides = [
  {
    title: "ỨNG DỤNG DỰ ĐOÁN NGUY CƠ BỆNH TIỂU ĐƯỜNG",
    description:
      "Giải pháp theo dõi sức khỏe toàn diện, cảnh báo sớm và hỗ trợ ngăn ngừa biến chứng từ bệnh tiểu đường.",
    image: "/assets/img/slider/slider-1.jpg",
  },
  {
    title: "PHÂN TÍCH CHỈ SỐ VÀ ĐƯA RA KẾT QUẢ",
    description:
      "Hệ thống sử dụng trí tuệ nhân tạo để phân tích chỉ số đường huyết, BMI, huyết áp... và đưa ra dự đoán nguy cơ cá nhân.",
    image: "/assets/img/slider/slider-2.jpg",
  },
  {
    title: "PHÁT HIỆN SỚM VÀ NGĂN NGỪA PHÒNG BỆNH",
    description:
      "Chủ động kiểm soát tình trạng sức khỏe, theo dõi diễn biến chỉ số và phòng ngừa từ giai đoạn sớm.",
    image: "/assets/img/slider/slider-3.jpg",
  },
];

const Slider = () => {
  useEffect(() => {
  const slider = tns({
    container: ".slider-active",
    items: 1,
    slideBy: "page",
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayButtonOutput: false,
    controls: false,
    nav: true,
    loop: true,
    rewind: false,
    mouseDrag: true,
  });

  return () => {
    slider.destroy(); // 🔥 tránh nhân bản nếu component re-render
  };
}, []);


  return (
    <section className="slider-section">
      <div className="slider-active">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`single-slider img-bg ${index === 0 ? "overlay" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="container">
              <div className="slider-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Slider;
