import pandas as pd
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_curve,
    auc,
    precision_score,
    recall_score,
    f1_score,
)
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import StandardScaler


# ✅ B1. Tiền xử lý dữ liệu
def load_and_clean_data(filepath):
    df = pd.read_csv(filepath)
    float_cols = ["glucose", "bmi", "height", "weight"]
    int_cols = [
        "age",
        "pulse_rate",
        "systolic_bp",
        "diastolic_bp",
        "family_diabetes",
        "hypertensive",
        "family_hypertension",
        "cardiovascular_disease",
        "stroke",
    ]

    for col in int_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")
    for col in float_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").astype(float)
    if "gender" in df.columns:
        df["gender"] = df["gender"].map({"Male": 1, "Female": 0})
    if "diabetic" in df.columns:
        df["diabetic"] = df["diabetic"].map({"Yes": 1, "No": 0}).astype("Int64")
    return df


# ✅ B2. Huấn luyện mô hình + đánh giá
def train_and_evaluate(df):
    X = df.drop("diabetic", axis=1)
    y = df["diabetic"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    smote = SMOTE(random_state=42)
    X_train_balanced, y_train_balanced = smote.fit_resample(
        X_train.astype("float64"), y_train.astype(int)
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_balanced)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(max_iter=5000, class_weight="balanced")
    model.fit(X_train_scaled, y_train_balanced)

    # Đánh giá trên train
    y_train_pred = model.predict(X_train_scaled)
    cm_train = confusion_matrix(y_train_balanced, y_train_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm_train, annot=True, fmt="d", cmap="Greens", cbar=False)
    plt.title("Confusion Matrix (Train Set - Sau SMOTE)")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

    # Đánh giá trên test
    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    cm_test = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(5, 4))
    sns.heatmap(cm_test, annot=True, fmt="d", cmap="Blues", cbar=False)
    plt.title("Confusion Matrix (Test Set - Gốc)")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

    fpr, tpr, thresholds = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)
    plt.figure(figsize=(6, 5))
    plt.plot(fpr, tpr, label=f"ROC Curve (AUC = {roc_auc:.2f})", lw=2)
    plt.plot([0, 1], [0, 1], "k--")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve (Test Set)")
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.show()

    # Tuning threshold
    threshold_tuning_report(y_test, y_prob)

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/trained_model.pkl")
    joblib.dump(scaler, "models/scaler.pkl")
    print("\n✅ Mô hình và scaler đã được lưu")

    return model, scaler


# ✅ B3. Tuning threshold
def threshold_tuning_report(y_true, y_prob):
    thresholds = [i / 100 for i in range(10, 91, 5)]
    report = []

    for th in thresholds:
        y_pred = (y_prob >= th).astype(int)
        precision = precision_score(y_true, y_pred, zero_division=0)
        recall = recall_score(y_true, y_pred, zero_division=0)
        f1 = f1_score(y_true, y_pred, zero_division=0)
        acc = accuracy_score(y_true, y_pred)
        report.append(
            {
                "Threshold": th,
                "Precision": round(precision, 2),
                "Recall": round(recall, 2),
                "F1-Score": round(f1, 2),
                "Accuracy": round(acc, 2),
            }
        )

    df_report = pd.DataFrame(report)
    print("\n📊 Bảng so sánh các threshold:")
    print(df_report)


# ✅ B4. Dự đoán input mới
def predict_from_input(user_input_dict, threshold=0.3):
    model = joblib.load("models/trained_model.pkl")
    scaler = joblib.load("models/scaler.pkl")

    input_df = pd.DataFrame([user_input_dict])
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
    input_scaled = scaler.transform(input_df)
    prob = model.predict_proba(input_scaled)[:, 1]
    prediction = int(prob[0] >= threshold)

    if prob[0] >= threshold + 0.3:
        risk_level = "🔴 CAO"
    elif prob[0] >= threshold:
        risk_level = "🟠 TRUNG BÌNH"
    else:
        risk_level = "🟢 THẤP"

    threshold_info = f"🔵 Threshold đang sử dụng: {threshold}"
    risk_info = f"🔵 Đánh giá mức nguy cơ: {risk_level}"

    result = (
        f"-> Có nguy cơ mắc bệnh tiểu đường - {risk_level} (Xác suất: {prob[0]*100:.1f}%)."
        if prediction == 1
        else f"-> Không có dấu hiệu mắc bệnh - {risk_level} (Xác suất: {prob[0]*100:.1f}%)."
    )

    result = f"{threshold_info}\n{risk_info}\n{result}"
    return result


# ✅ B5. Thực thi tổng hợp
if __name__ == "__main__":
    # Load và clean data
    df = load_and_clean_data(r"F:\Python Project\data\diabetes_final_data_v2.csv")
    # Train model
    train_and_evaluate(df)
    # Test prediction
    example_input = {
        "age": 80,
        "gender": 1,
        "pulse_rate": 70,
        "systolic_bp": 145,
        "diastolic_bp": 80,
        "glucose": 8.5,
        "height": 1.65,
        "weight": 72.0,
        "bmi": 26.4,
        "family_diabetes": 1,
        "hypertensive": 1,
        "family_hypertension": 1,
        "cardiovascular_disease": 0,
        "stroke": 0,
    }
    print(predict_from_input(example_input))
