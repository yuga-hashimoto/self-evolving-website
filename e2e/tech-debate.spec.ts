import { test, expect } from 'playwright/test';

test('Tech Debate component works correctly', async ({ page }) => {
  // Go to home page
  await page.goto('/');

  // Wait for the component to appear. The title is "The Eternal Tech Debate" (or translation).
  const title = page.getByText(/The Eternal Tech Debate/i).first();
  await expect(title).toBeVisible();

  // Scope to the debate component section
  // We look for a container that has the title and buttons.
  // The structure is: <h3>Title</h3> <button>Next Debate</button> <AnimatePresence> <motion.div> ... <VoteOption> <VoteOption>

  // Find the "Next Debate" button.
  const nextButton = page.getByRole('button', { name: /Next Debate/i }).first();
  await expect(nextButton).toBeVisible();

  // Find the voting options. They are buttons but NOT the "Next Debate" button.
  // We wait for at least 2 other buttons to be visible.
  // Note: VoteOption has text like "Tabs", "Spaces", etc.
  // We scope the search to the container of the title to avoid picking up other buttons on the page.
  // The component is wrapped in a .glass-card.
  const card = page.locator('.glass-card').filter({ has: title });
  const options = card.locator('button').filter({ hasNotText: /Next Debate/i });

  // Wait for options to load (there is a small delay in component mount)
  await expect(options).toHaveCount(2, { timeout: 10000 });

  const firstOption = options.first();
  const secondOption = options.last();

  await expect(firstOption).toBeVisible();
  await expect(secondOption).toBeVisible();

  // Initial state: buttons should be enabled
  await expect(firstOption).toBeEnabled();
  await expect(secondOption).toBeEnabled();

  // Vote for the first option
  await firstOption.click();

  // Check for success message "Thanks for voting!"
  const successMessage = card.getByText(/Thanks for voting/i);
  await expect(successMessage).toBeVisible();

  // Verify buttons become disabled after voting
  await expect(firstOption).toBeDisabled();
  await expect(secondOption).toBeDisabled();

  // Verify localStorage persistence
  // Since key is dynamic, we check if *any* relevant key is set.
  const voteData = await page.evaluate(() => {
    const keys = Object.keys(localStorage);
    // Find key like tech_debate_user_vote_tabs_vs_spaces
    const userVoteKey = keys.find(k => k.startsWith('tech_debate_user_vote_'));
    const votesKey = keys.find(k => k.startsWith('tech_debate_votes_'));

    return {
      userVote: userVoteKey ? localStorage.getItem(userVoteKey) : null,
      votes: votesKey ? JSON.parse(localStorage.getItem(votesKey) || '{}') : null
    };
  });

  // Verify we recorded a vote
  expect(voteData.userVote).toBeTruthy(); // Should be 'left' or 'right'
  expect(voteData.votes).toBeTruthy();
  expect(voteData.votes.left + voteData.votes.right).toBeGreaterThan(0);

  // Test "Next Debate" functionality
  await nextButton.click();

  // Wait for transition (300ms delay in component + animation)
  await page.waitForTimeout(500);

  // After clicking Next, we might get a new topic.
  // If we get a new topic (statistically likely), the buttons should be enabled again (unless we voted on it too).
  // If we get the same topic, they remain disabled.
  // We can't deterministically test "enabled" here without knowing the random seed,
  // but we can verify the options are still present.
  await expect(options).toHaveCount(2);
});
