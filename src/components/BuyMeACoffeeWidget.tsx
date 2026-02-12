'use client';

import Script from 'next/script';

export default function BuyMeACoffeeWidget() {
  return (
    <Script
      strategy="lazyOnload"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-name="BMC-Widget"
      data-cfasync="false"
      data-id="yugahashimoto"
      data-description="Support me on Buy me a coffee!"
      data-message=""
      data-color="#FFDD00"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
    />
  );
}
