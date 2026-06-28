import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("carrega a página principal com conteúdo da landing legada", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".legacy-home")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Saúde mental/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Entrar" })).toBeVisible();
  });

  test("não exibe seção Fale conosco removida", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Fale conosco")).toHaveCount(0);
    await expect(page.locator("#contato")).toHaveCount(0);
  });
});

test.describe("Autenticação", () => {
  test("página de login carrega formulário", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1.page-title")).toHaveText("Entrar");
    await expect(page.getByLabel(/E-mail/i)).toBeVisible();
    await expect(page.getByLabel(/Senha/i)).toBeVisible();
  });

  test("rejeita login com credenciais inválidas via API", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: {
        email: "invalido@test.com",
        password: "senhaerrada",
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  test("rejeita payload inválido no login com 400", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: {
        email: "email-invalido",
        password: "123",
      },
    });

    expect(response.status()).toBe(400);
  });
});

test.describe("Segurança de API", () => {
  test("endpoints protegidos retornam 401 sem sessão", async ({ request }) => {
    const endpoints = [
      "/api/appointments",
      "/api/psychologists/me",
      "/api/psychologists/me/earnings",
    ];

    for (const url of endpoints) {
      const response = await request.get(url);
      expect(response.status(), url).toBe(401);
    }
  });
});
