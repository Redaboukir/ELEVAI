import pandas as pd
import joblib
import mysql.connector
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import os

print("🚀 ENTRAÎNEMENT ML HEBDOMADAIRE")

# ======================
# DB CONNECTION
# ======================
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="elevai"
)

# ======================
# DATASET QUERY
# ======================
query = """
SELECT
  d.sommeil_h,
  d.pas,
  d.sport_min,
  d.calories,
  d.humeur_0_5,
  d.stress_0_5,
  d.fc_repos,
  a.score
FROM daily_data d
JOIN analysis_results a
  ON d.user_id = a.user_id
 AND d.date = a.date
"""

df = pd.read_sql(query, conn)
conn.close()

if df.empty:
    raise Exception("❌ Dataset vide — entraînement annulé")

print(f"📊 Lignes chargées : {len(df)}")

# ======================
# EXPORT CSV
# ======================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "dataset_export.csv")

df.to_csv(CSV_PATH, index=False)
print("📁 CSV mis à jour :", CSV_PATH)

# ======================
# FEATURES
# ======================
features = [
    "sommeil_h",
    "pas",
    "sport_min",
    "calories",
    "humeur_0_5",
    "stress_0_5",
    "fc_repos"
]

X = df[features]
y = df["score"]

# ======================
# SCALING
# ======================
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ======================
# MODEL SCORE
# ======================
model = LinearRegression()
model.fit(X_scaled, y)

# ======================
# ANOMALY DETECTION
# ======================
anomaly_model = IsolationForest(
    contamination=0.15,
    random_state=42
)
anomaly_model.fit(X_scaled)

# ======================
# SAVE MODELS
# ======================
joblib.dump(model, os.path.join(BASE_DIR, "score_model.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "scaler.pkl"))
joblib.dump(anomaly_model, os.path.join(BASE_DIR, "anomaly.pkl"))

print
