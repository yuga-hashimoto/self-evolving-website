"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function KofiWidget() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <div id="kofi-widget-container" style={{ minWidth: "160px" }}></div>
            <Script
                src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'
                strategy='lazyOnload'
                onLoad={() => {
                    // @ts-ignore
                    if (window.kofiWidgetOverlay) {
                        // @ts-ignore
                        window.kofiWidgetOverlay.draw('yugahashimoto', {
                            'type': 'floating-chat',
                            'floating-chat.donateButton.text': 'Tip Me',
                            'floating-chat.donateButton.background-color': '#8b5cf6',
                            'floating-chat.donateButton.text-color': '#fff',
                            'floating-chat.core.position.bottom-left': 'position: static !important; width: auto !important; transform: none !important;',
                            'floating-chat.core.position.bottom-right': 'position: static !important; width: auto !important; transform: none !important;'
                        }, 'kofi-widget-container');
                    }
                }}
            />
            <style jsx global>{`
                .floatingchat-container-wrap {
                    position: static !important;
                    width: auto !important;
                    height: auto !important;
                    display: inline-block !important;
                }
                .floatingchat-container-wrap-mobi {
                    display: none !important;
                }
                .floatingchat-container {
                    position: static !important;
                    width: 160px !important; 
                    height: 65px !important;
                }
                #kofi-widget-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </>
    );
}
