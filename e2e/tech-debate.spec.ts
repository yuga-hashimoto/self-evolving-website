import { test, expect } from 'playwright/test';

test('Tech Debate component works correctly', async ({ page }) => {
  // Go to home page
  await page.goto('/');

  // Wait for the component to appear
  const title = page.getByText('The Eternal Tech Debate');
  await expect(title).toBeVisible();

  // Check if buttons are present
  const tabsButton = page.getByRole('button', { name: /Tabs/i });
  const spacesButton = page.getByRole('button', { name: /Spaces/i });

  await expect(tabsButton).toBeVisible();
  await expect(spacesButton).toBeVisible();

  // Initial state: buttons should be enabled (unless already voted in a previous test run, but new context should be clean)
  // Playwright creates a new context for each test, so localStorage is empty.

  // Vote for Tabs
  await tabsButton.click();

  // Check for success message
  const successMessage = page.getByText('Thanks for voting!');
  await expect(successMessage).toBeVisible();

  // Verify localStorage persistence
  const localStorageVote = await page.evaluate(() => {
    return localStorage.getItem('tech_debate_user_vote');
  });
  expect(localStorageVote).toBe('tabs');

  // Verify percentages are shown (buttons become disabled or change state)
  // My implementation disables the button.
  await expect(tabsButton).toBeDisabled();
  await expect(spacesButton).toBeDisabled();

  // Reload page to test persistence
  await page.reload();

  // Wait for component to load again
  await expect(title).toBeVisible();

  // Buttons should still be disabled
  await expect(tabsButton).toBeDisabled();
  await expect(spacesButton).toBeDisabled();

  // Success message should still be visible
  await expect(successMessage).toBeVisible();
});
