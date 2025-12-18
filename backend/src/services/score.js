export function computeScore(d) {
  let score = 0;

  // 🛌 Sommeil (0–20)
  if (d.sommeil_h >= 8) score += 20;
  else if (d.sommeil_h >= 7) score += 16;
  else if (d.sommeil_h >= 6) score += 12;
  else score += 6;

  // 👟 Pas (0–20)
  if (d.pas >= 10000) score += 20;
  else if (d.pas >= 8000) score += 16;
  else if (d.pas >= 6000) score += 12;
  else score += 6;

  // 💪 Sport (0–15)
  if (d.sport_min >= 60) score += 15;
  else if (d.sport_min >= 30) score += 10;
  else if (d.sport_min >= 15) score += 6;
  else score += 2;

  // 🍽️ Calories (0–15)
  if (d.calories >= 1800 && d.calories <= 2400) score += 15;
  else if (d.calories >= 1600 && d.calories <= 2600) score += 10;
  else score += 5;

  // 😄 Humeur (0–15)
  score += d.humeur_0_5 * 3; // max 15

  // 😌 Stress (0–10)
  score += (5 - d.stress_0_5) * 2; // max 10

  // ❤️ FC repos (0–5)
  if (d.fc_repos <= 55) score += 5;
  else if (d.fc_repos <= 65) score += 3;
  else score += 1;

  return Math.min(100, Math.round(score));
}
