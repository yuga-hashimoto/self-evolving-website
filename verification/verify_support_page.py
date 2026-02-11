import time
from playwright.sync_api import sync_playwright

def verify_sponsor_flow():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # Navigate to History page
        print("Navigating to /history...")
        try:
            page.goto("http://localhost:3000/history", timeout=10000)
            page.wait_for_load_state("networkidle")
        except Exception as e:
            print(f"Failed to load /history: {e}")
            return

        # Check for Sponsor button (exact match)
        try:
            sponsor_button = page.get_by_role("link", name="Sponsor", exact=True)
            if sponsor_button.is_visible():
                print("SUCCESS: Sponsor button (exact match) found on /history page.")
            else:
                print("FAILURE: Sponsor button NOT visible.")
                page.screenshot(path="verification/history_page_failure.png")
                return
        except Exception as e:
            print(f"Error finding button: {e}")
            return

        # Click Sponsor button
        print("Clicking Sponsor button...")
        sponsor_button.click()

        # Wait for navigation
        try:
            page.wait_for_url("**/support", timeout=5000)
            print("SUCCESS: Navigated to /support page.")
        except Exception as e:
            print(f"FAILURE: Did not navigate to /support. Current URL: {page.url}")
            page.screenshot(path="verification/navigation_failure.png")
            return

        # Check for Cyber Support heading
        try:
            heading = page.get_by_text("CYBER SUPPORT")
            heading.wait_for(state="visible", timeout=5000)
            if heading.is_visible():
                print("SUCCESS: 'CYBER SUPPORT' heading found.")
            else:
                 print("FAILURE: 'CYBER SUPPORT' heading NOT found.")
        except Exception as e:
             print(f"Error finding heading: {e}")

        # Take screenshot of Support page
        screenshot_path = "verification/support_page.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_sponsor_flow()
