import joblib
import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

data_loaded = joblib.load(os.path.join(BASE_DIR, "model.pkl"))

model = data_loaded["model"]
threshold = data_loaded["threshold"]


# =========================
# SAFE CUT
# =========================
def safe_cut(value, bins, labels):
    try:
        return pd.cut([value], bins=bins, labels=labels)[0]
    except:
        return 0


# =========================
# MAIN PREDICT (ONLY ML)
# =========================
def predict_from_input(data):

    gender = int(data.get("gender", 0))

    age = float(data.get("age", 0))
    pulse_rate = float(data.get("pulse_rate", 0))
    systolic = float(data.get("systolic_bp", 0))
    diastolic = float(data.get("diastolic_bp", 0))
    glucose = float(data.get("glucose", 0))
    height = float(data.get("height", 0))
    weight = float(data.get("weight", 0))

    bmi = weight / (height * height) if height > 0 else 0

    bmi_category = int(safe_cut(bmi, [0, 18.5, 25, 30, 100], [0, 1, 2, 3]))
    age_group = int(safe_cut(age, [0, 30, 45, 60, 100], [0, 1, 2, 3]))

    bp_ratio = systolic / (diastolic + 1e-6)
    high_glucose = int(glucose > 7.8)

    input_df = pd.DataFrame([{
        "age": age,
        "gender": gender,
        "pulse_rate": pulse_rate,
        "systolic_bp": systolic,
        "diastolic_bp": diastolic,
        "glucose": glucose,
        "height": height,
        "weight": weight,
        "bmi": bmi,
        "family_diabetes": int(data.get("family_diabetes", 0)),
        "hypertensive": int(data.get("hypertensive", 0)),
        "family_hypertension": int(data.get("family_hypertension", 0)),
        "bmi_category": bmi_category,
        "bp_ratio": bp_ratio,
        "age_group": age_group,
        "high_glucose": high_glucose,
    }])

    probability = float(model.predict_proba(input_df)[0][1])
    prediction = int(probability > threshold)

    return {
        "prediction": prediction,
        "probability": probability
    }