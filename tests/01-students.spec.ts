import { test, expect } from '@playwright/test';

test.describe('Student Submissions', () => {
  // MahiMahi
  test('Login as MahiMahi (123.0.0.1) and submit URL', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '123.0.0.1' }
    });
    const page = await context.newPage();

    // Login
    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'MahiMahi');
    await page.click('button[type="submit"]');

    // Verify redirect to home
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Submit Your Work')).toBeVisible();

    // Invalid URL
    await page.fill('input[name="url"]', 'test.co.org');
    await page.click('button[type="submit"]');
    
    // Expect error (Assuming the UI shows the error from action state)
    // The action returns { error: 'URL must contain "..."' }
    await expect(page.getByText(/URL must contain/)).toBeVisible();

    // Valid URL
    await page.fill('input[name="url"]', 'test.code.org/test');
    await page.click('button[type="submit"]');

    // Verify success (Error should disappear)
    await expect(page.getByText(/URL must contain/)).not.toBeVisible();
    // Verify input retains value or new state
    await expect(page.locator('input[name="url"]')).toHaveValue('test.code.org/test');

    await context.close();
  });

  // AhiAhi
  test('Login as AhiAhi (456.0.0.1) and submit URL', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '456.0.0.1' }
    });
    const page = await context.newPage();

    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'AhiAhi');
    await page.click('button[type="submit"]');

    await page.fill('input[name="url"]', 'ahi.code.org/test');
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.getByText(/URL must contain/)).not.toBeVisible();
    await expect(page.locator('input[name="url"]')).toHaveValue('ahi.code.org/test');

    await context.close();
  });

  // Cotoji
  test('Login as Cotoji (789.0.0.1) and submit URL', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '789.0.0.1' }
    });
    const page = await context.newPage();

    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'Cotoji');
    await page.click('button[type="submit"]');

    await page.fill('input[name="url"]', 'cotoji.code.org/test');
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.getByText(/URL must contain/)).not.toBeVisible();
    await expect(page.locator('input[name="url"]')).toHaveValue('cotoji.code.org/test');

    await context.close();
  });
});

