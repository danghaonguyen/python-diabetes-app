import pandas as pd
import joblib

# Load mô hình và scaler
model = joblib.load("models/trained_model.pkl")
scaler = joblib.load("models/scaler.pkl")


def predict_from_input(user_input_dict, threshold=0.3):
    """
    Dự đoán bệnh tiểu đường từ input dict, cho phép chỉnh threshold.
    Mặc định threshold = 0.3 (tối ưu sau tuning cho dữ liệu lệch)
    """

    # Tạo DataFrame từ input
    input_df = pd.DataFrame([user_input_dict])

    # Đảm bảo đúng thứ tự cột như khi train
    feature_order = [
        "age",
        "gender",
        "pulse_rate",
        "systolic_bp",
        "diastolic_bp",
        "glucose",
        "height",
        "weight",
        "bmi",
        "family_diabetes",
        "hypertensive",
        "family_hypertension",
        "cardiovascular_disease",
        "stroke",
    ]

    input_df = input_df[feature_order]

    # Chuẩn hóa dữ liệu
    input_scaled = scaler.transform(input_df)

    # Dự đoán xác suất
    prob = model.predict_proba(input_scaled)[:, 1]

    # Áp dụng threshold tùy chỉnh
    prediction = int(prob[0] >= threshold)

    # Phân loại mức độ nguy cơ
    if prob[0] >= threshold + 0.3:
        risk_level = "🔴 CAO"
    elif prob[0] >= threshold:
        risk_level = "🟠 TRUNG BÌNH"
    else:
        risk_level = "🟢 THẤP"

    """ threshold_info = f"🔵 Threshold đang sử dụng: {threshold}" """
    risk_info = f"🔵 Đánh giá mức nguy cơ: {risk_level}"

    # Kết luận đẹp hơn
    result = (
        f"-> Có nguy cơ mắc bệnh tiểu đường - {risk_level} (Xác suất: {prob[0]*100:.1f}%)."
        if prediction == 1
        else f"-> Không có dấu hiệu mắc bệnh - {risk_level} (Xác suất: {prob[0]*100:.1f}%)."
    )

    # Ghép các dòng
    """ result = f"{threshold_info}\n{risk_info}\n{result}" """
    result = f"\n{risk_info}\n{result}"

    return result


# Test sử dụng thử:
if __name__ == "__main__":
    example_input = {
        "age": 50,  # Tuổi trung niên (nguy cơ tăng nhẹ)
        "gender": 1,  # Nam
        "pulse_rate": 76,  # Nhịp tim trung bình
        "systolic_bp": 130,  # Huyết áp tâm thu hơi cao (tiền cao huyết áp)
        "diastolic_bp": 85,  # Huyết áp tâm trương hơi cao
        "glucose": 7.2,  # Đường huyết hơi cao (6.1 - 7.8 mmol/L là tiền tiểu đường)
        "height": 1.70,  # Chiều cao trung bình
        "weight": 75.0,  # Cân nặng hơi thừa
        "bmi": 25.95,  # BMI hơi thừa cân (25 - 29.9)
        "family_diabetes": 0,  # Không có tiền sử gia đình
        "hypertensive": 0,  # Không có cao huyết áp xác định
        "family_hypertension": 1,  # Không có tiền sử cao huyết áp gia đình
        "cardiovascular_disease": 0,
        "stroke": 0,
    }

    print(predict_from_input(example_input))  # Mặc định threshold 0.3
