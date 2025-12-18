import sys, json, random
import pandas as pd
import joblib
from datetime import date, timedelta
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 🔹 load input
baseline = json.loads(sys.stdin.read())

# 🔹 load models
model = joblib.load(os.path.join(BASE_DIR, "model_score.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
anomaly_model = joblib.load(os.path.join(BASE_DIR, "anomaly.pkl"))

results = []
today = date.today()

for i in range(1, 8):
    day = today + timedelta(days=i)

    simulated = {
        "sommeil_h": max(3, min(9, baseline["sommeil_h"] + random.uniform(-0.6, 0.6))),
        "pas": max(500, baseline["pas"] + random.randint(-1500, 1500)),
        "sport_min": max(0, baseline["sport_min"] + random.randint(-15, 15)),
        "calories": max(1400, baseline["calories"] + random.randint(-250, 250)),
        "humeur_0_5": min(5, max(0, baseline["humeur_0_5"] + random.uniform(-1, 1))),
        "stress_0_5": min(5, max(0, baseline["stress_0_5"] + random.uniform(-1, 1))),
        "fc_repos": max(45, baseline["fc_repos"] + random.randint(-4, 4))
    }

    X = pd.DataFrame([simulated])
    Xs = scaler.transform(X)

    score = round(max(0, min(100, model.predict(Xs)[0])))
    anomaly = anomaly_model.predict(Xs)[0] == -1

    results.append({
        "day": str(day),
        "score": score,
        "anomaly": anomaly
    })

print(json.dumps(results))
