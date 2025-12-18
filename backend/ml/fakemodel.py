import random
import mysql.connector
from datetime import date, timedelta

# ==============================
# CONFIG
# ==============================
USER_ID = 7   # ⚠️ adapte si besoin
START_DATE = date(2024, 11, 1)
END_DATE = date.today()

# ==============================
# DB CONNECTION
# ==============================
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="elevai"
)
cursor = conn.cursor()

print("🚀 Génération dataset réaliste pour user", USER_ID)

current = START_DATE

while current <= END_DATE:

    # ==============================
    # DÉTERMINER TYPE DE JOUR
    # ==============================
    rand = random.random()

    # 15 % très mauvais jours
    if rand < 0.15:
        sommeil = round(random.uniform(3.5, 5.5), 1)
        pas = random.randint(500, 3000)
        sport = 0
        calories = random.randint(2600, 3300)
        humeur = random.randint(0, 2)
        stress = random.randint(4, 5)
        fc = random.randint(75, 95)

    # 25 % jours moyens
    elif rand < 0.40:
        sommeil = round(random.uniform(5.5, 6.5), 1)
        pas = random.randint(3000, 6000)
        sport = random.randint(0, 20)
        calories = random.randint(2200, 2800)
        humeur = random.randint(2, 3)
        stress = random.randint(3, 4)
        fc = random.randint(65, 80)

    # 60 % bons jours
    else:
        sommeil = round(random.uniform(6.5, 8.5), 1)
        pas = random.randint(6000, 14000)
        sport = random.randint(20, 80)
        calories = random.randint(1800, 2400)
        humeur = random.randint(3, 5)
        stress = random.randint(0, 2)
        fc = random.randint(55, 70)

    # ==============================
    # INSERT DAILY DATA
    # ==============================
    cursor.execute("""
        INSERT INTO daily_data
        (user_id, date, sommeil_h, pas, sport_min, calories,
         humeur_0_5, stress_0_5, fc_repos)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        USER_ID, current, sommeil, pas, sport,
        calories, humeur, stress, fc
    ))

    # ==============================
    # SCORE (NON LISSÉ — IMPORTANT)
    # ==============================
    score = (
        sommeil * 9 +
        min(pas / 120, 90) +
        sport * 0.6 +
        humeur * 7 -
        stress * 10 -
        abs(fc - 60)
    )

    score += random.uniform(-8, 8)
    score = round(max(20, min(95, score)))

    # catégorie
    if score >= 80:
        category = "Excellent"
    elif score >= 60:
        category = "Bon"
    elif score >= 40:
        category = "Moyen"
    else:
        category = "À risque"

    risk_level = "Stable"
    if stress >= 4 or sommeil < 5:
        risk_level = "Risque fatigue"

    delta_score = 0  # recalculé côté dashboard si besoin

    cursor.execute("""
        INSERT INTO analysis_results
        (user_id, date, score, category, delta_score, risk_level, coach_message)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        USER_ID, current, score, category,
        delta_score, risk_level,
        "Données générées automatiquement"
    ))

    current += timedelta(days=1)

conn.commit()
cursor.close()
conn.close()

print("✅ Dataset généré avec succès")
print("📅 Période :", START_DATE, "→", END_DATE)
