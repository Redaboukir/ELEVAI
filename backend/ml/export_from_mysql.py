import mysql.connector
import pandas as pd

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="elevai"
)

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
 AND d.date = DATE(a.created_at)
"""


df = pd.read_sql(query, conn)
df.to_csv("dataset.csv", index=False)

print("✅ Dataset exporté depuis MySQL")
