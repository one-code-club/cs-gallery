import { test, expect } from '@playwright/test';

test.describe('TA Voting', () => {
  // Masaki
  test('Login as Masaki (123.1.0.1) and vote', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '123.1.0.1' }
    });
    const page = await context.newPage();

    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'Masaki?TA');
    await page.click('button[type="submit"]');

    // Verify redirect
    await expect(page).toHaveURL('/voting');

    // Wait for cards to load
    const cards = page.locator('.rounded-xl'); // Card component usually has this class or we can use other selector
    // More robust selector:
    const cardLocator = page.locator('div.flex.flex-col.border.bg-card'); 
    
    // Verify 3 cards are displayed
    await expect(cardLocator).toHaveCount(3);

    // Vote for MahiMahi and AhiAhi
    // Function to click heart by nickname
    const voteFor = async (nickname: string) => {
      const card = cardLocator.filter({ hasText: nickname });
      // The heart button is the button in the footer
      await card.locator('button').click();
    };

    await voteFor('MahiMahi');
    await voteFor('AhiAhi');

    // Save votes
    await page.click('text=Submit Votes');

    // Wait for saving to complete (button goes back to enabled state)
    await expect(page.getByText('Saving...')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Votes' })).toBeEnabled();
    
    // Reload page to verify persistence (optional, but good practice)
    await page.reload();
    
    const mahiCard = cardLocator.filter({ hasText: 'MahiMahi' });
    const ahiCard = cardLocator.filter({ hasText: 'AhiAhi' });

    // Check if heart is red (has fill-red-500 class)
    await expect(mahiCard.locator('svg.lucide-heart')).toHaveClass(/fill-red-500/);
    await expect(ahiCard.locator('svg.lucide-heart')).toHaveClass(/fill-red-500/);

    await context.close();
  });

  // Kenji
  test('Login as Kenji (456.1.0.1) and vote', async ({ browser }) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-forwarded-for': '456.1.0.1' }
    });
    const page = await context.newPage();

    await page.goto('/login');
    await page.fill('input[name="nickname"]', 'Kenji?TA');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/voting');
    
    const cardLocator = page.locator('div.flex.flex-col.border.bg-card');
    await expect(cardLocator).toHaveCount(3);

    // Vote for MahiMahi and Cotoji
    const voteFor = async (nickname: string) => {
      const card = cardLocator.filter({ hasText: nickname });
      await card.locator('button').click();
    };

    await voteFor('MahiMahi');
    await voteFor('Cotoji');

    await page.click('text=Submit Votes');

    // Wait for saving to complete
    await expect(page.getByText('Saving...')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Votes' })).toBeEnabled();

    // Verify persistence
    await page.reload();
    const mahiCard = cardLocator.filter({ hasText: 'MahiMahi' });
    const cotojiCard = cardLocator.filter({ hasText: 'Cotoji' });
    
    await expect(mahiCard.locator('svg.lucide-heart')).toHaveClass(/fill-red-500/);
    await expect(cotojiCard.locator('svg.lucide-heart')).toHaveClass(/fill-red-500/);

    await context.close();
  });
});

