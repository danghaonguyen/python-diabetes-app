# 🩺 Ứng dụng Dự đoán Nguy cơ Bệnh Tiểu đường

Ứng dụng web hỗ trợ **dự đoán nguy cơ mắc bệnh tiểu đường** dựa trên các chỉ số sức khỏe của người dùng. Hệ thống kết hợp mô hình **Machine Learning** (RandomForest / XGBoost) ở backend với giao diện **ReactJS** hiện đại.

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Kiến trúc & Công nghệ](#-kiến-trúc--công-nghệ)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [API Endpoints](#-api-endpoints)
- [Mô hình Machine Learning](#-mô-hình-machine-learning)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| **Đăng ký / Đăng nhập** | Xác thực qua email, có xác thực mã OTP gửi qua Gmail |
| **Quên mật khẩu** | Gửi mã reset qua email, mã có hiệu lực 15 phút |
| **Trang chủ** | Giới thiệu ứng dụng, hướng dẫn sử dụng |
| **Dự đoán nguy cơ** | Nhập chỉ số y tế → trả về kết quả + xác suất + mức nguy cơ |
| **Biểu đồ phân tích** | So sánh chỉ số cá nhân với ngưỡng tham khảo |
| **Lịch sử dự đoán** | Xem lại, lọc theo ngày/tháng/năm, xoá bản ghi |

### Mức độ nguy cơ
Kết quả dự đoán được phân loại thành 3 mức: **Thấp** / **Trung bình** / **Cao**, dựa trên xác suất từ mô hình kết hợp với các ngưỡng y tế (đường huyết, huyết áp, BMI, tuổi).

---

## 🛠 Kiến trúc & Công nghệ

**Backend**
- Python + Flask
- Flask-CORS, Flask-MySQLdb
- scikit-learn, XGBoost, imbalanced-learn (SMOTE)
- pandas, numpy, joblib

**Frontend**
- React 18 + Vite
- React Router DOM, Axios
- Recharts (biểu đồ), React-Select, React-Modal, React-Toastify

**Database**
- MySQL / MariaDB

---

## 📁 Cấu trúc thư mục

```
python-diabetes-app/
├── backend/
│   ├── version_new/              ← ⭐ Phiên bản đang chạy chính
│   │   ├── app.py                # Entry point, khởi tạo Flask app
│   │   ├── config.py             # Đọc cấu hình từ .env
│   │   ├── requirements.txt
│   │   ├── .env.example          # Mẫu cấu hình (copy thành .env)
│   │   ├── db/
│   │   │   └── db.py             # Khởi tạo MySQL connection
│   │   ├── routes/               # API endpoints (Blueprint)
│   │   │   ├── auth.py           # Đăng ký, đăng nhập, reset password
│   │   │   ├── predict.py        # Dự đoán + lưu lịch sử
│   │   │   └── history.py        # Lấy / xoá lịch sử
│   │   ├── services/
│   │   │   ├── prediction_service.py  # Logic dự đoán + medical boost
│   │   │   └── email_service.py       # Gửi email SMTP
│   │   └── ml/
│   │       ├── model.pkl         # Model đã huấn luyện
│   │       ├── prediction.py     # Inference
│   │       ├── preprocessing.py  # Làm sạch & feature engineering
│   │       └── train_model.py    # Script huấn luyện
│   └── version_old/              # Phiên bản cũ (không dùng)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Routing + ProtectedRoute
│   │   ├── components/
│   │   │   ├── auth/             # Login, Register
│   │   │   └── pages/
│   │   │       ├── home/         # Trang chủ
│   │   │       ├── prediction/   # Form nhập + biểu đồ
│   │   │       ├── history/      # Lịch sử dự đoán
│   │   │       └── layout/       # Navbar, Footer, HeaderTop
│   │   └── services/
│   │       ├── apiClient.js      # Axios instance
│   │       ├── auth.js           # API auth
│   │       └── api.js            # API dự đoán
│   ├── vite.config.js            # Dev server + proxy /api → Flask
│   └── .env.example
│
├── database/
│   └── diabetes_app.sql          # Schema + dữ liệu mẫu
└── data/
    ├── diabetes_final_data_v2.csv         # Dữ liệu huấn luyện
    └── diabetes_final_data_cleaned_v3.csv # Dữ liệu đã làm sạch
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Python 3.10+
- Node.js 18+
- MySQL / MariaDB (hoặc XAMPP)

### Bước 1 — Clone source

```bash
git clone https://github.com/danghaonguyen/python-diabetes-app.git
cd python-diabetes-app
```

### Bước 2 — Cài đặt cơ sở dữ liệu

1. Mở **XAMPP Control Panel** → Start **Apache** và **MySQL**
2. Nhấn **Admin** cạnh MySQL để mở phpMyAdmin
3. Tạo database tên `diabetes_app`
4. Chọn **Import** → chọn file `database/diabetes_app.sql` → **Go**

### Bước 3 — Cài đặt & chạy Backend

```bash
cd backend/version_new
pip install -r requirements.txt

# Tạo file cấu hình từ mẫu
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
```

Mở `.env` và điền thông tin thật:

```dotenv
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB=diabetes_app

SECRET_KEY=<chuỗi-ngẫu-nhiên-đủ-dài>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_APP_PASSWORD=your-16-char-app-password
```

> **Lưu ý:** `SMTP_APP_PASSWORD` là **App Password** của Gmail (bật 2FA → tạo tại https://myaccount.google.com/apppasswords), **không phải** mật khẩu Gmail thường.

Chạy server:

```bash
python app.py
```

Backend chạy tại `http://127.0.0.1:5000`. Kiểm tra kết nối DB: mở `http://127.0.0.1:5000/test-db` → hiện `DB OK`.

### Bước 4 — Cài đặt & chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt tại `http://127.0.0.1:3000`.

> **Không cần cấu hình gì thêm cho dev.** Vite tự proxy mọi request `/api` sang Flask ở `127.0.0.1:5000` (xem `vite.config.js`), nên không gặp lỗi CORS.

---

## 🔌 API Endpoints

Tất cả endpoint có tiền tố `/api`.

### Xác thực (`routes/auth.py`)

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/send_verification_code` | Gửi mã OTP đăng ký qua email |
| `POST` | `/api/register` | Đăng ký (cần mã OTP) |
| `POST` | `/api/login` | Đăng nhập (lưu session) |
| `POST` | `/api/logout` | Đăng xuất |
| `POST` | `/api/send_password_reset` | Gửi mã reset mật khẩu |
| `POST` | `/api/verify_reset_code` | Xác thực mã reset |
| `POST` | `/api/reset_password` | Đặt mật khẩu mới |

### Dự đoán (`routes/predict.py`)

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/predict` | Dự đoán nguy cơ + lưu vào lịch sử (yêu cầu đăng nhập) |

### Lịch sử (`routes/history.py`)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/history/<user_id>` | Lấy lịch sử dự đoán của user |
| `DELETE` | `/api/history/<prediction_id>` | Xoá một bản ghi |

---

## 🤖 Mô hình Machine Learning

### Huấn luyện

Script `backend/version_new/ml/train_model.py`:
- Đọc dữ liệu từ `data/diabetes_final_data_v2.csv`
- So sánh 2 mô hình: **RandomForest** và **XGBoost**, dùng `GridSearchCV` để tìm tham số tốt nhất
- Cân bằng dữ liệu bằng **SMOTE**
- Chọn **threshold** tối ưu theo **F2-score** (ưu tiên Recall — quan trọng trong y tế, tránh bỏ sót ca bệnh)
- Lưu model vào `ml/model.pkl` (kèm threshold)

```bash
cd backend/version_new/ml
python train_model.py
```

### Dự đoán

Luồng dự đoán (`services/prediction_service.py`):

1. **ML predict** — mô hình trả về xác suất (`ml/prediction.py`)
2. **Medical boost** — điều chỉnh xác suất dựa trên ngưỡng y tế:
   - Đường huyết ≥ 11 mmol/L, huyết áp tâm thu ≥ 160, tâm trương ≥ 100, BMI ≥ 30, tuổi ≥ 75
   - Trường hợp nặng được đẩy lên tối thiểu 0.80
3. **Phân loại nguy cơ** — Thấp / Trung bình / Cao

---

## 🗄 Cơ sở dữ liệu

### Bảng `users`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | int | Khoá chính |
| `email` | varchar(100) | Unique, dùng để đăng nhập |
| `password` | varchar(255) | Hash bằng `werkzeug.security` |
| `username` | varchar(100) | Tên hiển thị |
| `reset_code` | varchar(10) | Mã reset mật khẩu |
| `reset_code_expiry` | datetime | Hạn của mã reset |
| `created_at` | timestamp | Thời điểm tạo |

### Bảng `predictions`

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | int | Khoá chính |
| `user_id` | int | FK → `users.id` |
| `age`, `gender`, `pulse_rate` | int/tinyint | Chỉ số cơ bản |
| `systolic_bp`, `diastolic_bp` | int | Huyết áp tâm thu / tâm trương |
| `glucose` | float | Đường huyết (mmol/L) |
| `height`, `weight`, `bmi` | float | Chiều cao, cân nặng, BMI |
| `family_diabetes`, `hypertensive`, `family_hypertension` | tinyint | Tiền sử (0/1) |
| `prediction_result` | varchar(100) | Mức nguy cơ |
| `prediction_probability` | float | Xác suất (0–1) |
| `created_at` | datetime | Thời điểm dự đoán |

---

## 🔒 Bảo mật

- **Không commit file `.env`** — đã được chặn bởi `.gitignore`
- Mật khẩu người dùng được **hash** (không lưu plaintext)
- `SECRET_KEY` phải là chuỗi ngẫu nhiên khi deploy production:
  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  ```
- Session cookie đặt `HTTPONLY` và `SAMESITE=Lax`
- Xoá lịch sử dự đoán yêu cầu **đúng user sở hữu** bản ghi

---

## 📄 License

Dự án phục vụ mục đích học tập.
