"use client";

import { useState } from "react";

interface ChangelogScreenshotProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ChangelogScreenshot({
    src,
    alt,
    className
}: ChangelogScreenshotProps) {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
        return (
            <p className="text-gray-500 text-xs p-4 text-center">
                スクリーンショットが見つかりません
            </p>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}
