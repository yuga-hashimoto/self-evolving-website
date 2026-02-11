import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        print("Navigating to home page...")
        page.goto("http://localhost:3131")

        # Wait for the page to load and hydrate
        page.wait_for_timeout(5000)

        print("Searching for Code Arena...")
        # Scroll to find the element
        # We look for the title "Code Arena"
        code_arena = page.get_by_text("Code Arena")
        if code_arena.count() > 0:
            code_arena.scroll_into_view_if_needed()
            print("Found Code Arena!")
        else:
            print("Code Arena not found by text, trying to find by text content via locator")
            # Fallback
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.wait_for_timeout(1000)

        # Take a screenshot before voting
        if not os.path.exists("verification"):
            os.makedirs("verification")

        page.screenshot(path="verification/before_vote.png")
        print("Screenshot taken: verification/before_vote.png")

        # Vote for the first option
        print("Voting for first option...")
        # Find buttons with text "Vote"
        vote_buttons = page.get_by_role("button", name="Vote")
        if vote_buttons.count() > 0:
            vote_buttons.first.click()
            print("Clicked vote button")

            # Wait for animation
            page.wait_for_timeout(2000)

            # Take screenshot after voting
            page.screenshot(path="verification/after_vote.png")
            print("Screenshot taken: verification/after_vote.png")

            # Verify "Thanks for voting!" message
            if page.get_by_text("Thanks for voting!").count() > 0:
                print("Verification Successful: 'Thanks for voting!' message appeared.")
            else:
                print("Verification Warning: 'Thanks for voting!' message NOT found.")
        else:
            print("No Vote buttons found!")

        browser.close()

if __name__ == "__main__":
    run()
