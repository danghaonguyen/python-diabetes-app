import pandas as pd
import numpy as np


def load_and_clean_data(filepath):
    df = pd.read_csv(filepath)

    # =========================
    # TYPE CONVERSION
    # =========================
    float_cols = ['glucose', 'bmi', 'height', 'weight']
    int_cols = [
        'age', 'pulse_rate', 'systolic_bp', 'diastolic_bp',
        'family_diabetes', 'hypertensive', 'family_hypertension'
    ]

    for col in float_cols + int_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    # =========================
    # GENDER
    # =========================
    if 'gender' in df.columns:
        df['gender'] = (
            df['gender']
            .astype(str)
            .str.strip()
            .str.lower()
            .map({'male': 1, 'female': 0, 'm': 1, 'f': 0})
        )
        df['gender'] = df['gender'].fillna(df['gender'].median())

    # =========================
    # TARGET LABEL (ONLY HERE)
    # =========================
    df['diabetic'] = (
        df['diabetic']
        .astype(str)
        .str.lower()
        .map({'yes': 1, 'no': 0})
    )

    df = df.dropna(subset=['diabetic'])
    df['diabetic'] = df['diabetic'].astype(int)

    # =========================
    # MISSING VALUE
    # =========================
    df = df.fillna(df.median(numeric_only=True))

    # =========================
    # OUTLIER FILTER
    # =========================
    df = df[
        (df['age'].between(0, 100)) &
        (df['pulse_rate'].between(40, 180)) &
        (df['systolic_bp'].between(70, 250)) &
        (df['diastolic_bp'].between(40, 150)) &
        (df['bmi'].between(10, 60))
    ]

    # =========================
    # FEATURE ENGINEERING (TRAIN = INFER MATCH EXACT)
    # =========================

    df["bmi_category"] = pd.cut(
        df["bmi"],
        bins=[0, 18.5, 25, 30, 100],
        labels=[0, 1, 2, 3]
    ).astype(float).fillna(0).astype(int)

    df["bp_ratio"] = df["systolic_bp"] / df["diastolic_bp"].replace(0, np.nan)
    df["bp_ratio"] = df["bp_ratio"].replace([np.inf, -np.inf], np.nan)
    df["bp_ratio"] = df["bp_ratio"].fillna(df["bp_ratio"].median())

    df["age_group"] = pd.cut(
        df["age"],
        bins=[0, 30, 45, 60, 100],
        labels=[0, 1, 2, 3]
    ).astype(float).fillna(0).astype(int)

    df["high_glucose"] = (df["glucose"] > 7.8).astype(int)

    # =========================
    # DROP LOW QUALITY FEATURES
    # =========================
    for col in ['cardiovascular_disease', 'stroke']:
        if col in df.columns and df[col].nunique() <= 1:
            df = df.drop(columns=[col])

    df = df.reset_index(drop=True)

    return df