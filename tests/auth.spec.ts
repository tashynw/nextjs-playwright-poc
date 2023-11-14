import { test, expect } from "@playwright/test";
import { mockUserData } from "./factory/auth";

const baseUrl = `http:localhost:3000`;

test("sign up and login", async ({ page }) => {
  const userData = mockUserData();
  await page.goto(`${baseUrl}/signup`);

  const nameInput = page.locator('input[name="name"]');
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const signUpButton = page.locator('button:has-text("Sign up")');

  await nameInput.fill(userData.name);
  await emailInput.fill(userData.email);
  await passwordInput.fill(userData.password);
  await signUpButton.click();

  await expect(page).toHaveTitle(/Login/);

  const loginEmailInput = page.locator('input[name="email"]');
  const loginPasswordInput = page.locator('input[name="password"]');
  const LoginSignInButton = page.locator('button:has-text("Login")');

  await loginEmailInput.fill(userData.email);
  await loginPasswordInput.fill(userData.password);
  await LoginSignInButton.click();

  await expect(page.locator('button:has-text("Log out")')).toContainText(
    "Log out"
  );
});
