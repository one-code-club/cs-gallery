import { test, expect } from '@playwright/test';

test.describe('Admin Verification', () => {
  test('Login as Itagaki (123.2.0.1) and verify results', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '123.2.0.1' }
    });
    const page = await context.newPage();

    // Admin Code 1234 is default in our config
    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'Itagaki?1234');
    await page.click('button[type="submit"]');

    // Redirect to /admin
    await expect(page).toHaveURL('/admin');

    // Check user list
    // Users: MahiMahi, AhiAhi, Cotoji, Masaki, Kenji, Itagaki = 6 users
    // The table body rows
    await expect(page.locator('tbody tr')).toHaveCount(6);

    // Navigate to Gallery
    // Click on "Gallery" link in header
    await page.click('text=Gallery');
    await expect(page).toHaveURL('/gallery');

    // Verify Votes
    // MahiMahi: 2 votes
    // AhiAhi: 1 vote
    // Cotoji: 1 vote
    
    const cardLocator = page.locator('div.flex.flex-col.border.bg-card');

    const verifyVote = async (nickname: string, count: number) => {
      const card = cardLocator.filter({ hasText: nickname });
      // The count is in the footer next to the heart
      await expect(card.locator('.border-t span.font-bold').first()).toHaveText(String(count));
    };

    await verifyVote('MahiMahi', 2);
    await verifyVote('AhiAhi', 1);
    await verifyVote('Cotoji', 1);

    await context.close();
  });
});

