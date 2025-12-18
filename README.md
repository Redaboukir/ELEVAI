🎯 Contexte & Objectif

ElevAI est une application full-stack de suivi et d’analyse du bien-être quotidien.
Elle permet à chaque utilisateur de :

saisir ses indicateurs de santé (sommeil, activité, alimentation, humeur, stress…),

obtenir un score de bien-être (0–100),

analyser son évolution dans le temps,

bénéficier de prédictions IA et de recommandations personnalisées.

Le projet répond aux exigences du projet final M2 MIASHS en intégrant :

une API REST,

des modèles de Machine Learning,

une interface React moderne,

des tests E2E Playwright,

une documentation complète.
🗄️ Base de Données

Base MySQL avec les tables suivantes :

users
id, email, password_hash, age, genre, taille_cm, poids_kg, objectif, created_at

daily_data
user_id, date, sommeil_h, pas, sport_min, calories, humeur_0_5, stress_0_5, fc_repos

analysis_results
user_id, date, score, category, delta_score, risk_level, coach_message


👉 Contrainte respectée : 1 analyse par utilisateur et par jour

🔌 API REST – Endpoints Principaux
Authentification

POST /auth/register

POST /auth/login

Utilisateur

POST /users

PUT /users/:id

GET /users/:id

Données quotidiennes

POST /data/:user_id

GET /data/:user_id

Analyse & IA

POST /analysis/test/:user_id

GET /analysis/analyze/:user_id

GET /analysis/history/:user_id

GET /analysis/dataset/:user_id

🧠 Intelligence Artificielle (IA)
🔹 Prétraitement

Standardisation (StandardScaler)

Gestion des valeurs manquantes

Agrégation par jour

🔹 Modèles utilisés
1️⃣ Régression Linéaire

Objectif : prédire un score continu (0–100)

Avantage : interprétable, simple

2️⃣ Random Forest Regressor

Objectif : modéliser des relations non linéaires

Avantage : plus robuste, meilleure précision

👉 Score final hybride :

Score = 60% ML + 40% règles métier

3️⃣ Détection d’anomalies

Modèle : IsolationForest

Détection de dérives comportementales

📊 Front-End React
Pages principales

Login / Register

Profil utilisateur (modifiable)

Saisie quotidienne

Dashboard

Score du jour

Évolution du score (LineChart)

Analyse ML

Message Coach IA

UI / UX

Sidebar persistante

Mode sombre / clair

Formulaires validés

Messages d’état clairs

🌙 Mode Sombre

Géré via ThemeContext

Bouton de toggle intégré dans la sidebar

Styles dynamiques sans librairie externe

🧪 Tests E2E – Playwright
Scénario couvert

Inscription utilisateur

Connexion

Accès profil

Test du jour

Redirection dashboard

Vérification du score affiché

npx playwright test

⚙️ Installation & Lancement
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

Variables d’environnement (.env)
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=elevai

OPENAI_API_KEY=xxxx
RESEND_API_KEY=xxxx

🧠 Choix Techniques – Réponses aux Questions
Pourquoi ces modèles ?

Régression linéaire → interprétabilité

Random Forest → performance

IsolationForest → détection d’anomalies

Normalisation

Indispensable pour comparer pas, calories, humeur…

Reproductibilité

random_state

modèles sauvegardés .pkl

versionnement clair

Sécurité (axes d’amélioration)

JWT

Hash bcrypt

Rate-limit API

Validation serveur renforcée

🚀 Bonus Implémentés

✅ Détection d’anomalies
✅ Score hybride ML + règles
✅ Mode sombre
✅ Tests E2E complets
✅ Architecture propre et documentée

Réalise par : - Boukir Reda
-Laktati Mehdi
