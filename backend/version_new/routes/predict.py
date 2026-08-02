from flask import Blueprint, request, jsonify
from services.prediction_service import predict_from_input
from db.db import mysql
import traceback

predict_bp = Blueprint('predict', __name__)


def clean_prediction(result):
    return {
        "prediction": int(result.get("prediction", 0)),
        "probability": float(result.get("probability", 0)),
        "risk_level": result.get("risk_level", "Không rõ"),
    }


# =========================
# SAFE HELPERS
# =========================
def safe_float(x, default=0.0):
    try:
        return float(x)
    except:
        return default


def map_gender(x):
    try:
        return int(x)
    except:
        return 0


def map_yes_no(x):
    try:
        return int(x)
    except:
        return 0


def calc_bmi(weight, height):
    try:
        return round(float(weight) / (float(height) ** 2), 2)
    except:
        return 0.0


# =========================
# ROUTE
# =========================
@predict_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("📦 INPUT RECEIVED:", data)

        # ===== USER ID =====
        user_id = data.get("user_id")
        user_id = int(user_id) if user_id is not None else None

        print("USER_ID:", user_id)

        # ===== PREDICT =====
        raw_result = predict_from_input(data)
        result = clean_prediction(raw_result)

        print("🔥 PREDICTION DONE:", result)

        # ===== BMI (MUST BE CONSISTENT WITH MODEL) =====
        bmi = calc_bmi(data.get("weight"), data.get("height"))

        # ===== SAVE DB =====
        if user_id is not None:
            try:
                cursor = mysql.connection.cursor()

                print("🔥 INSERT DB START")

                cursor.execute("""
                    INSERT INTO predictions (
                        user_id, age, gender, pulse_rate,
                        systolic_bp, diastolic_bp, glucose,
                        height, weight, bmi,
                        family_diabetes, hypertensive, family_hypertension,
                        prediction_result, prediction_probability, created_at
                    )
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
                """, (
                    user_id,
                    safe_float(data.get("age")),
                    map_gender(data.get("gender")),
                    safe_float(data.get("pulse_rate")),
                    safe_float(data.get("systolic_bp")),
                    safe_float(data.get("diastolic_bp")),
                    safe_float(data.get("glucose")),
                    safe_float(data.get("height")),
                    safe_float(data.get("weight")),
                    bmi,
                    map_yes_no(data.get("family_diabetes")),
                    map_yes_no(data.get("hypertensive")),
                    map_yes_no(data.get("family_hypertension")),
                    result.get("risk_level"),
                    result.get("probability")
                ))

                mysql.connection.commit()
                cursor.close()

                print("✅ INSERT SUCCESS")

            except Exception as db_error:
                print("💥 DB ERROR:", db_error)
                traceback.print_exc()

        else:
            print("⚠️ SKIP DB: user_id is None")

        return jsonify(result)

    except Exception as e:
        print("🔥 GLOBAL ERROR:")
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 400