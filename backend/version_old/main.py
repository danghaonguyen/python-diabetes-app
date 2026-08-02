import pandas as pd
from preprocessing import load_and_clean_data
from model_training import train_model
import visualization
import joblib

# Đọc và xử lý dữ liệu
df = load_and_clean_data(r'F:\Python Project\data\diabetes_final_data_v2.csv')

# Hiển thị 10 dòng đầu
print(df.head(20))

# Thông tin tổng quan
print(df.dtypes)

# Lấy thống kê mô tả gốc
desc = df.describe()
desc_clean = desc.copy()

# Cột số thực cần giữ 2 chữ số thập phân
float_cols = ['glucose', 'bmi', 'height', 'weight']

# Cột cần hiển thị là số nguyên
int_cols = ['age', 'pulse_rate', 'systolic_bp', 'diastolic_bp',
            'family_diabetes', 'hypertensive', 'family_hypertension',
            'cardiovascular_disease', 'stroke', 'diabetic']

# Làm tròn số thực (giữ 2 chữ số)
for col in float_cols:
    if col in desc_clean.columns:
        desc_clean[col] = desc_clean[col].round(1)

# Làm tròn và ép kiểu int cho các cột số nguyên
for col in int_cols:
    if col in desc_clean.columns:
        desc_clean[col] = desc_clean[col].round(0).astype(int)

# In bảng mô tả đã gọn gàng
print(desc_clean)

# Huấn luyện mô hình
model = train_model(df)

# Kiểm tra các mô hình đã lưu lại chưa
model = joblib.load("models/trained_model.pkl")
scaler = joblib.load("models/scaler.pkl")
print("✅ Đã load thành công")