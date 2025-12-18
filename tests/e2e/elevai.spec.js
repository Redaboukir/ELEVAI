import { test, expect } from "@playwright/test";

test("Flow complet ElevAI (register → login → profile → test → dashboard)", async ({ page }) => {
  // =========================
  // 1️⃣ REGISTER
  // =========================
  await page.goto("/register");

  const email = `test${Date.now()}@gmail.com`;
  const password = "test1234";

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="age"]', "25");
  await page.fill('input[name="genre"]', "H");
  await page.fill('input[name="taille_cm"]', "175");
  await page.fill('input[name="poids_kg"]', "70");
  await page.fill('input[name="objectif"]', "Améliorer la forme");

  await page.click('button[type="submit"]');

  // =========================
  // 2️⃣ LOGIN
  // =========================
  await page.waitForURL("/login", { timeout: 15000 });

  await page.fill('input[placeholder="Email"]', email);
  await page.fill('input[placeholder="Mot de passe"]', password);

  await page.click("button");

  // =========================
  // 3️⃣ PROFILE (REDIRECTION)
  // =========================
  await page.waitForURL("/profile", { timeout: 15000 });

  await expect(
    page.getByRole("heading", { name: /mon profil/i })
  ).toBeVisible();

  // =========================
  // 4️⃣ NAVIGATION → TEST (SIDEBAR)
  // =========================
  await page.getByRole("button", { name: /test/i }).click();

  await page.waitForURL(/test/, { timeout: 15000 });

  await expect(
    page.getByRole("heading", { name: /test santé/i })
  ).toBeVisible();

  // =========================
  // 5️⃣ SUBMIT TEST
  // =========================
  await page.fill('input[name="sommeil_h"]', "7");
  await page.fill('input[name="pas"]', "8000");
  await page.fill('input[name="sport_min"]', "30");
  await page.fill('input[name="calories"]', "2000");
  await page.fill('input[name="humeur_0_5"]', "4");
  await page.fill('input[name="stress_0_5"]', "2");
  await page.fill('input[name="fc_repos"]', "65");

  await page.getByRole("button", { name: /enregistrer/i }).click();

  // =========================
  // 6️⃣ DASHBOARD
  // =========================
  // =========================
// 6️⃣ DASHBOARD
// =========================
await page.waitForURL(/dashboard/, { timeout: 20000 });

// Titre dashboard
await expect(
  page.getByRole("heading", { name: /dashboard/i })
).toBeVisible();

// 🎯 Score numérique visible
await expect(
  page.locator("h1").filter({ hasText: /^[0-9]{1,3}$/ })
).toBeVisible();

});
