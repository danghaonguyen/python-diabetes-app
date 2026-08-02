import joblib
import os
import pandas as pd
import numpy as np
from ml.prediction import predict_from_input as ml_predict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")

data_loaded = joblib.load(MODEL_PATH)
threshold = data_loaded["threshold"]


# =========================
# SAFE MAP
# =========================
def map_yes_no(x):
    try:
        return int(x)
    except:
        return 0


# =========================
# BMI CALC
# =========================
def calc_bmi(weight, height):
    try:
        return float(weight) / (float(height) ** 2)
    except:
        return 0.0


# =========================
# MEDICAL BOOST (FIXED)
# =========================
def medical_boost(data, prob):
    boost = 0.0
    hard_flag = False

    # 🔥 GLUCOSE
    if data["glucose"] >= 11:
        boost += 0.25
        hard_flag = True
    elif data["glucose"] >= 7.8:
        boost += 0.18
    elif data["glucose"] >= 6.5:
        boost += 0.06

    # ❤️ BP
    if data["systolic_bp"] >= 160:
        boost += 0.18
        hard_flag = True
    elif data["systolic_bp"] >= 140:
        boost += 0.10

    if data["diastolic_bp"] >= 100:
        boost += 0.15
        hard_flag = True
    elif data["diastolic_bp"] >= 90:
        boost += 0.08

    # ⚖️ BMI
    if data["bmi"] >= 30:
        boost += 0.12
        hard_flag = True

    # 👴 AGE
    if data["age"] >= 75:
        boost += 0.10
        hard_flag = True

    # 🔥 FINAL COMBINE (QUAN TRỌNG)
    final = prob + boost

    # 🧠 HARD OVERRIDE CASE NẶNG
    if hard_flag:
        final = max(final, 0.80)

    return min(final, 0.98)


# =========================
# RISK LOGIC (ONLY HERE)
# =========================
def get_risk(prob, data):

    if (
        data["glucose"] >= 11 or
        data["systolic_bp"] >= 160 or
        data["diastolic_bp"] >= 100 or
        data["bmi"] >= 30 or
        data["age"] >= 75
    ):
        return "Cao"

    if prob >= 0.70:
        return "Cao"
    elif prob >= 0.40:
        return "Trung bình"
    else:
        return "Thấp"


# =========================
# MAIN SERVICE
# =========================
def predict_from_input(data):

    age = float(data.get("age", 0))
    pulse_rate = float(data.get("pulse_rate", 0))
    systolic_bp = float(data.get("systolic_bp", 0))
    diastolic_bp = float(data.get("diastolic_bp", 0))
    glucose = float(data.get("glucose", 0))
    height = float(data.get("height", 0))
    weight = float(data.get("weight", 0))

    bmi = calc_bmi(weight, height)

    # ===== ML PREDICT =====
    ml_result = ml_predict(data)
    prob = float(ml_result["probability"])

    # ===== BOOST =====
    prob = medical_boost(
        {
            "age": age,
            "glucose": glucose,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "bmi": bmi
        },
        prob
    )

    # ===== RISK =====
    risk = get_risk(prob, {
        "age": age,
        "glucose": glucose,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "bmi": bmi
    })

    pred = int(prob > 0.5)

    return {
        "prediction": pred,
        "probability": float(prob),
        "risk_level": risk
    }