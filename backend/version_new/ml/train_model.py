import pandas as pd
import joblib
import os
import numpy as np

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, recall_score, fbeta_score
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE

from preprocessing import load_and_clean_data


# ===== CONFIG =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = "F:/Python Project/data/diabetes_final_data_v2.csv"
MODEL_DIR = BASE_DIR
RANDOM_STATE = 42


# ===== LOAD DATA =====
df = load_and_clean_data(DATA_PATH)

df = df.drop(columns=["cardiovascular_disease", "stroke"], errors="ignore")

X = df.drop("diabetic", axis=1)
y = df["diabetic"].astype(int)


# ===== SPLIT =====
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE
)


# ===== CLASS BALANCE =====
ratio = y.value_counts().iloc[0] / y.value_counts().iloc[1]


# ===== PIPELINES =====
pipelines = {
    "RandomForest": Pipeline(
        [
            ("smote", SMOTE(random_state=RANDOM_STATE)),
            ("model", RandomForestClassifier(random_state=RANDOM_STATE)),
        ]
    ),
    "XGBoost": Pipeline(
        [
            ("smote", SMOTE(random_state=RANDOM_STATE)),  # FIX QUAN TRỌNG
            (
                "model",
                XGBClassifier(
                    eval_metric="logloss",
                    scale_pos_weight=ratio,
                    random_state=RANDOM_STATE,
                    n_jobs=-1,
                    tree_method="exact",
                    device="cpu"
                ),
            ),
        ]
    ),
}


# ===== PARAM GRID =====
param_grids = {
    "RandomForest": {
        "model__n_estimators": [100, 200],
        "model__max_depth": [5, 10, 15],
    },
    "XGBoost": {
        "model__n_estimators": [100, 200],
        "model__max_depth": [3, 5],
        "model__learning_rate": [0.05, 0.1],
    },
}


# ===== TRAIN =====
best_model = None
best_score = -1
best_threshold = 0.5
best_name = ""
best_recall = 0


for name in pipelines:

    print(f"\n🔍 Training: {name}")

    grid = GridSearchCV(
        pipelines[name],
        param_grids[name],
        cv=3,
        scoring="f1",
        n_jobs=-1,
        error_score="raise",
    )

    grid.fit(X_train, y_train)

    model = grid.best_estimator_

    y_prob = model.predict_proba(X_test)[:, 1]

    thresholds = np.arange(0.1, 0.8, 0.01)

    best_local_score = -1
    t_best = 0
    recall_best = 0

    for t in thresholds:

        y_pred = (y_prob > t).astype(int)

        recall = recall_score(y_test, y_pred)

        # ===== MEDICAL SCORE (F2 SCORE) =====
        score = fbeta_score(y_test, y_pred, beta=2)

        if score > best_local_score:
            best_local_score = score
            t_best = t
            recall_best = recall

    print(f"👉 Best threshold: {t_best:.2f}")
    print(f"👉 F2 Score: {best_local_score:.3f}")
    print(f"👉 Recall: {recall_best:.3f}")

    if best_local_score > best_score:
        best_model = model
        best_score = best_local_score
        best_threshold = t_best
        best_name = name
        best_recall = recall_best


# ===== FINAL REPORT =====
print(f"\n🏆 Best model: {best_name}")
print(f"🔥 F2 Score: {best_score:.3f}")
print(f"🎯 Threshold: {best_threshold:.2f}")
print(f"💡 Recall: {best_recall:.3f}")

y_prob = best_model.predict_proba(X_test)[:, 1]
y_pred = (y_prob > best_threshold).astype(int)

print("\n📋 Classification Report:")
print(classification_report(y_test, y_pred))


# ===== SAVE MODEL =====
model_path = os.path.join(MODEL_DIR, "model.pkl")

joblib.dump(
    {
        "model": best_model,
        "threshold": best_threshold,
        "type": "early_warning_medical"
    },
    model_path,
)

print("✅ Model saved at:", model_path)