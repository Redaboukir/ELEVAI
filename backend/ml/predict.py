import sys
import json
import joblib
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔥 lecture stdin
raw = sys.stdin.read()
data = json.loads(raw)

X_df = pd.DataFrame([data])

# 🔹 chargement modèles (CHEMIN ABSOLU)
model = joblib.load(os.path.join(BASE_DIR, "model_score.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
anomaly_model = joblib.load(os.path.join(BASE_DIR, "anomaly.pkl"))

X_scaled = scaler.transform(X_df)

score_pred = float(model.predict(X_scaled)[0])
score_pred = max(0, min(100, score_pred))

is_anomaly = anomaly_model.predict(X_scaled)[0] == -1

print(json.dumps({
    "score_ml": round(score_pred, 2),
    "anomaly": bool(is_anomaly)
}))
