from playwright.sync_api import sync_playwright
import time

def verify_sponsor_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a large viewport to ensure the button (hidden on mobile) is visible
        page = browser.new_page(viewport={"width": 1920, "height": 1080})

        try:
            # 1. Go to home page
            print("Navigating to home page...")
            page.goto("http://localhost:3131")
            page.wait_for_load_state("networkidle")

            # 2. Check for "Sponsor Project" button
            print("Checking for Sponsor Project button...")
            sponsor_button = page.get_by_role("link", name="Sponsor Project")

            if sponsor_button.is_visible():
                print("Button is visible.")
                box = sponsor_button.bounding_box()
                print(f"Button bounding box: {box}")
            else:
                print("Button is NOT visible.")
                page.screenshot(path="verification_failure.png")
                return

            # Take screenshot of the header
            page.screenshot(path="header_verification.png")

            # 3. Click the button and verify navigation
            print("Clicking the button...")
            sponsor_button.click()
            time.sleep(2) # Give it some time
            page.wait_for_load_state("networkidle")

            # 4. Verify URL and content
            print(f"Current URL: {page.url}")
            if "/support" in page.url:
                print("Navigated to /support successfully.")
            else:
                print(f"Failed to navigate to /support. URL is {page.url}")

            # 5. Verify content on Support page
            print("Verifying support page content...")
            heading = page.get_by_role("heading", name="Support the Project")
            if heading.is_visible():
                print("Support page heading found.")
            else:
                print("Support page heading NOT found.")

            # Take screenshot of the support page
            page.screenshot(path="support_page_verification.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error_verification.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_sponsor_button()
