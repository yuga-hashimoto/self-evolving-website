"use client";

import Script from "next/script";

export default function KofiWidget() {
    return (
        <Script
            src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
            strategy='lazyOnload'
            onLoad={() => {
                // @ts-ignore
                window.kofiWidgetOverlay.draw('yugahashimoto', {
                    'type': 'floating-chat',
                    'floating-chat.donateButton.text': 'Tip Me',
                    'floating-chat.donateButton.background-color': '#8b5cf6',
                    'floating-chat.donateButton.text-color': '#fff'
                });
            }}
        />
    );
}
