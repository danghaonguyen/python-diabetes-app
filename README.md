# XÂY DỰNG ỨNG DỤNG PHÂN TÍCH DỮ LIỆU Y TẾ ĐỂ DỰ ĐOÁN  BỆNH TIỂU ĐƯỜNG

## Giới thiệu

Đây là ứng dụng web hỗ trợ người dùng **dự đoán nguy cơ mắc bệnh tiểu đường** dựa trên các chỉ số sức khỏe. Hệ thống kết hợp giữa **giao diện ReactJS** và **backend Python Flask**

### 🧩 Các tính năng chính:

- Trang **Đăng nhập / Đăng ký**
- Trang **Trang chủ** (giới thiệu ứng dụng, hướng dẫn)
- **Trang dự đoán** nguy cơ tiểu đường bằng cách nhập chỉ số y tế
- Hiển thị **kết quả dự đoán** kèm mức độ nguy cơ (thấp, trung bình, cao)
- Biểu đồ **so sánh chỉ số của cá nhân với chỉ số bình thường**
- Trang **Lịch sử dự đoán**: Xem lại toàn bộ kết quả và thông tin đã nhập

---

## 🚀 Hướng dẫn chạy ứng dụng
<br>
git clone để lấy source code về máy

---

### 1. Backend – Flask API (Python)<br>
cd backend<br>
python app.py

---

### 2. Frontend – ReactJs<br>
cd frontend<br>
npm start

---

### 3. CSDL - MySQL <br>
-> Lấy csdl trong thư mục database: diabetes_app.sql <br>
-> Mở XAMPP Control Panel và chạy Apache , MySQL <br>
-> Sau đó click chọn Admin của MySQL, để chuyển hướng đến PhpMyAdmin <br>
-> Import file diabetes_app.sql lên.
