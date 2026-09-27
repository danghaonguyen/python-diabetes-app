import logging

from flask import Blueprint, jsonify, request, session

from db.db import mysql
from services.prediction_service import calc_bmi, predict_from_input

predict_bp = Blueprint('predict', __name__)

logger = logging.getLogger(__name__)


def clean_prediction(result):
    return {
        "prediction": int(result.get("prediction", 0)),
        "probability": float(result.get("probability", 0)),
        "risk_level": result.get("risk_level", "Không rõ"),
    }


# =========================
# SAFE HELPERS
# =========================
def to_number(value, default=0):
    """Ép giá trị đầu vào về số, trả mặc định nếu không hợp lệ."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def map_gender(value):
    """Giới tính: 1 = Nam, 0 = Nữ (mặc định 0 khi dữ liệu sai)."""
    return int(to_number(value))


def map_yes_no(value):
    """Cờ nhị phân: 1 = Có, 0 = Không (mặc định 0 khi dữ liệu sai)."""
    return int(to_number(value))


def build_insert_values(user_id, data, bmi, result):
    """Chuẩn hoá dữ liệu trước khi ghi vào bảng predictions."""
    return (
        user_id,
        to_number(data.get("age")),
        map_gender(data.get("gender")),
        to_number(data.get("pulse_rate")),
        to_number(data.get("systolic_bp")),
        to_number(data.get("diastolic_bp")),
        to_number(data.get("glucose")),
        to_number(data.get("height")),
        to_number(data.get("weight")),
        bmi,
        map_yes_no(data.get("family_diabetes")),
        map_yes_no(data.get("hypertensive")),
        map_yes_no(data.get("family_hypertension")),
        result.get("risk_level"),
        result.get("probability"),
    )


def save_prediction(user_id, data, bmi, result):
    """Lưu kết quả dự đoán. Trả True nếu ghi thành công, False nếu thất bại."""
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO predictions ("
            "user_id, age, gender, pulse_rate, "
            "systolic_bp, diastolic_bp, glucose, "
            "height, weight, bmi, "
            "family_diabetes, hypertensive, family_hypertension, "
            "prediction_result, prediction_probability, created_at"
            ") VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())"
        , build_insert_values(user_id, data, bmi, result))
        mysql.connection.commit()
        return True
    except Exception:
        mysql.connection.rollback()
        logger.exception("Không thể lưu kết quả dự đoán cho user_id=%s", user_id)
        return False
    finally:
        cursor.close()


# =========================
# ROUTE
# =========================
@predict_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True) or {}

    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "Vui lòng đăng nhập để dự đoán"}), 401

    try:
        raw_result = predict_from_input(data)
        result = clean_prediction(raw_result)
        # Làm tròn BMI trước khi lưu để khớp định dạng cột bmi.
        bmi = round(calc_bmi(data.get("weight"), data.get("height")), 2)

        if not save_prediction(user_id, data, bmi, result):
            payload = {"message": "Đã dự đoán nhưng không lưu được vào lịch sử."}
            payload.update(result)
            return jsonify(payload), 500

        return jsonify(result)
    except Exception:
        logger.exception("Lỗi khi xử lý dự đoán cho user_id=%s", user_id)
        return jsonify({"message": "Không thể dự đoán. Vui lòng thử lại."}), 400
