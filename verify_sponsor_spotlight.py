from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navigating to homepage...")
            page.goto("http://localhost:3131")

            print("Waiting for Sponsor of the Month badge...")
            # Wait for the "Sponsor of the Month" text
            spotlight_badge = page.get_by_text("Sponsor of the Month")
            expect(spotlight_badge).to_be_visible(timeout=30000)
            print("Sponsor of the Month badge found.")

            # Find the container: We can find the container by looking for the .glass-card that contains the badge
            spotlight_card = page.locator(".glass-card").filter(has_text="Sponsor of the Month")
            expect(spotlight_card).to_be_visible()

            # Verify the sponsor name "X Corp" is visible *inside* the spotlight card
            print("Verifying sponsor name inside spotlight...")
            sponsor_name = spotlight_card.get_by_text("X Corp")
            expect(sponsor_name).to_be_visible()
            print("Sponsor 'X Corp' found in spotlight.")

            # Scroll into view
            spotlight_card.scroll_into_view_if_needed()

            # Add a small delay for animations
            page.wait_for_timeout(2000)

            print("Taking screenshot...")
            spotlight_card.screenshot(path="sponsor_spotlight.png")
            print("Screenshot saved to sponsor_spotlight.png")

        except Exception as e:
            print(f"Error: {e}")
            # Take a full page screenshot for debugging
            page.screenshot(path="error_screenshot.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
