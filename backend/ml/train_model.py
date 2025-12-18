import pandas as pd
import joblib
import mysql.connector
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest

print("🚀 DÉMARRAGE TRAIN ML")

# 🔹 Connexion MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="elevai"
)

# 🔹 Dataset réel depuis la base
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


print("📥 Lecture données MySQL...")
df = pd.read_sql(query, conn)

# 🔹 Export dataset (POUR LE PROF ✅)
df.to_csv("dataset_export.csv", index=False)

print("📊 Lignes chargées :", len(df))

if df.empty:
    raise Exception("❌ Aucune donnée pour entraîner le ML")

# 🔹 Features
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

# 🔹 Normalisation
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 🔹 Régression (score)
model = LinearRegression()
model.fit(X_scaled, y)

# 🔹 Détection d’anomalies (ML utile)
anomaly_model = IsolationForest(
    contamination=0.15,
    random_state=42
)
anomaly_model.fit(X_scaled)

# 🔹 Sauvegarde modèles
joblib.dump(model, "model_score.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(anomaly_model, "anomaly.pkl")

print("✅ ML entraîné et sauvegardé")
print("📁 Dataset exporté : dataset_export.csv")
