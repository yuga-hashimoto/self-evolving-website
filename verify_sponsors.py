from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Navigate to the sponsors page
            page.goto("http://localhost:3131/sponsors")

            # Wait for content to load
            page.wait_for_selector("h1")

            # Check for the presence of the new buttons
            # Ko-fi
            # Note: The Ko-fi button text is "Ko-fi" now (was "Buy us a Coffee on Ko-fi")
            kofi_link = page.get_by_role("link", name="Ko-fi")
            if kofi_link.count() > 0:
                print("Ko-fi link found")
            else:
                print("Ko-fi link NOT found")

            # GitHub Sponsors
            github_link = page.get_by_role("link", name="GitHub Sponsors")
            if github_link.count() > 0:
                print("GitHub Sponsors link found")
            else:
                print("GitHub Sponsors link NOT found")

            # Patreon
            patreon_link = page.get_by_role("link", name="Patreon")
            if patreon_link.count() > 0:
                print("Patreon link found")
            else:
                print("Patreon link NOT found")

            # Take a screenshot
            page.screenshot(path="verification_sponsors.png", full_page=True)
            print("Screenshot saved to verification_sponsors.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
