import pandas as pd

def load_and_clean_data(filepath):
    df = pd.read_csv(filepath)

    # Cột cần giữ phần thập phân
    float_cols = ['glucose', 'bmi', 'height', 'weight']

    # Cột cần chuyển về số nguyên
    int_cols = ['age', 'pulse_rate', 'systolic_bp', 'diastolic_bp',
                'family_diabetes', 'hypertensive', 'family_hypertension',
                'cardiovascular_disease', 'stroke']

    # Ép kiểu chính xác
    for col in int_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').astype('Int64')  # int dạng nullable

    for col in float_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce').astype(float)

        # Mã hóa cột chuỗi 'gender' (nếu có)
    if 'gender' in df.columns:
        df['gender'] = df['gender'].map({'Male': 1, 'Female': 0})

     # Xử lý cột 'diabetic': chuyển 'Yes'/'No' → 1/0
    if 'diabetic' in df.columns:
        df['diabetic'] = df['diabetic'].map({'Yes': 1, 'No': 0}).astype('Int64')

    return df