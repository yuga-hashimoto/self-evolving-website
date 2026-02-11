from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    try:
        response = page.goto("http://localhost:3131/pricing")
        if not response.ok:
            print(f"Failed to load page: {response.status}")
            exit(1)

        # Wait for the pricing table to be visible
        page.wait_for_selector("table")

        # Verify content
        content = page.content()
        if "Unlock Pro Features" not in content:
            print("Title not found")
            exit(1)
        if "Compare Features" not in content:
            print("Table title not found")
            exit(1)
        if "Daily Evolutions" not in content:
            print("Table row not found")
            exit(1)

        # Take screenshot
        page.screenshot(path="pricing_page.png", full_page=True)
        print("Screenshot saved to pricing_page.png")

        # Click checkout button and verify alert
        # Handling dialog
        dialog_handled = False
        def handle_dialog(dialog):
            nonlocal dialog_handled
            print(f"Dialog message: {dialog.message}")
            if "fake checkout button" in dialog.message:
                print("Checkout alert verified")
                dialog_handled = True
            dialog.dismiss()

        page.on("dialog", handle_dialog)

        # Click the "Upgrade to Pro" button
        page.click("text=Upgrade to Pro")

        # Wait a bit to ensure dialog logic runs
        page.wait_for_timeout(1000)

        if not dialog_handled:
             print("Dialog not handled!")
             exit(1)

    except Exception as e:
        print(f"Error: {e}")
        exit(1)
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
