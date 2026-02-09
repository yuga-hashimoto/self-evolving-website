// SVG Icons for Self-Evolving Website
// Nano Banana themed icons

interface IconProps {
    size?: number;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
    "aria-label"?: string;
}

// DNA/Evolution icon - Main logo
export function IconDNA({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M32 8C24 8 18 14 18 22C18 30 24 36 32 36C40 36 46 42 46 50C46 58 40 56 32 56" stroke="url(#dna-grad)" strokeWidth="4" strokeLinecap="round" />
            <path d="M32 8C40 8 46 14 46 22C46 30 40 36 32 36C24 36 18 42 18 50C18 58 24 56 32 56" stroke="url(#dna-grad2)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="32" cy="22" r="4" fill="#FFD93D" />
            <circle cx="32" cy="50" r="4" fill="#FFD93D" />
            <ellipse cx="32" cy="36" rx="6" ry="3" fill="#FFD93D" />
            <defs>
                <linearGradient id="dna-grad" x1="18" y1="8" x2="46" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7" />
                    <stop offset="1" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="dna-grad2" x1="46" y1="8" x2="18" y2="56" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// Home icon for navigation
export function IconHome({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M32 10L8 32H16V54H28V40H36V54H48V32H56L32 10Z" fill="#a855f7" />
            <rect x="28" y="28" width="8" height="8" rx="1" fill="#FFD93D" />
        </svg>
    );
}

// Playground/Game icon
export function IconPlayground({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <rect x="12" y="20" width="40" height="28" rx="4" fill="#FFD93D" />
            <rect x="16" y="24" width="12" height="8" rx="2" fill="#1a1a2e" />
            <circle cx="44" cy="32" r="4" fill="#a855f7" />
            <circle cx="44" cy="42" r="3" fill="#6366f1" />
            <rect x="20" y="36" width="4" height="8" rx="1" fill="#1a1a2e" />
            <rect x="16" y="38" width="12" height="4" rx="1" fill="#1a1a2e" />
            <circle cx="32" cy="14" r="2" fill="#FFD93D" />
            <path d="M32 14L34 8M32 14L30 8" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Changelog/Notes icon
export function IconChangelog({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <rect x="14" y="10" width="36" height="44" rx="4" fill="#FFD93D" />
            <rect x="20" y="18" width="20" height="3" rx="1" fill="#1a1a2e" />
            <rect x="20" y="26" width="24" height="3" rx="1" fill="#1a1a2e" />
            <rect x="20" y="34" width="18" height="3" rx="1" fill="#1a1a2e" />
            <rect x="20" y="42" width="22" height="3" rx="1" fill="#1a1a2e" />
            <circle cx="46" cy="46" r="10" fill="#a855f7" />
            <path d="M46 40V46L50 48" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Analytics/Chart icon
export function IconAnalytics({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <rect x="10" y="44" width="10" height="12" rx="2" fill="#3b82f6" />
            <rect x="24" y="32" width="10" height="24" rx="2" fill="#6366f1" />
            <rect x="38" y="20" width="10" height="36" rx="2" fill="#a855f7" />
            <path d="M14 38L30 26L44 16" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round" />
            <circle cx="14" cy="38" r="4" fill="#FFD93D" />
            <circle cx="30" cy="26" r="4" fill="#FFD93D" />
            <circle cx="44" cy="16" r="4" fill="#FFD93D" />
        </svg>
    );
}

// Click/Pointer icon
export function IconClick({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <ellipse cx="32" cy="36" rx="20" ry="22" fill="#FFD93D" />
            <ellipse cx="28" cy="30" rx="3" ry="4" fill="#1a1a2e" />
            <ellipse cx="38" cy="30" rx="3" ry="4" fill="#1a1a2e" />
            <path d="M26 42C28 46 36 46 38 42" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 10L32 18" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 14L24 20" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 14L40 20" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Warning icon
export function IconWarning({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <path d="M32 8L56 52H8L32 8Z" fill="#FFD93D" stroke="#f59e0b" strokeWidth="2" />
            <rect x="29" y="22" width="6" height="16" rx="2" fill="#1a1a2e" />
            <circle cx="32" cy="44" r="3" fill="#1a1a2e" />
        </svg>
    );
}

// Celebration icon
export function IconCelebration({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <ellipse cx="32" cy="38" rx="18" ry="20" fill="#FFD93D" />
            <path d="M24 22L28 32" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 22L36 32" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <polygon points="32,6 34,14 30,14" fill="#a855f7" />
            <ellipse cx="28" cy="34" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="36" cy="34" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M28 44C30 48 34 48 36 44" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="16" r="3" fill="#f472b6" />
            <circle cx="50" cy="20" r="2" fill="#3b82f6" />
            <circle cx="52" cy="12" r="3" fill="#22c55e" />
            <circle cx="12" cy="28" r="2" fill="#f59e0b" />
        </svg>
    );
}

// Fire icon
export function IconFire({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <ellipse cx="32" cy="42" rx="16" ry="18" fill="#FFD93D" />
            <path d="M20 30C20 18 32 8 32 8C32 8 44 18 44 30C44 36 40 42 36 44C38 40 36 36 32 36C28 36 26 40 28 44C24 42 20 36 20 30Z" fill="#f97316" />
            <path d="M26 34C26 26 32 20 32 20C32 20 38 26 38 34C38 38 36 42 32 44C28 42 26 38 26 34Z" fill="#fbbf24" />
            <rect x="24" y="36" width="16" height="6" rx="2" fill="#1a1a2e" opacity="0.8" />
            <ellipse cx="28" cy="38" rx="2" ry="2" fill="white" />
            <ellipse cx="36" cy="38" rx="2" ry="2" fill="white" />
        </svg>
    );
}

// Crown icon
export function IconCrown({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <ellipse cx="32" cy="44" rx="16" ry="14" fill="#FFD93D" />
            <path d="M14 22L22 32L32 18L42 32L50 22L46 36H18L14 22Z" fill="#f59e0b" />
            <circle cx="14" cy="20" r="4" fill="#fbbf24" />
            <circle cx="32" cy="14" r="4" fill="#fbbf24" />
            <circle cx="50" cy="20" r="4" fill="#fbbf24" />
            <ellipse cx="28" cy="40" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="36" cy="40" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M28 50C30 52 34 52 36 50" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Empty/Mailbox icon
export function IconEmpty({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <ellipse cx="24" cy="40" rx="14" ry="16" fill="#FFD93D" />
            <ellipse cx="20" cy="36" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="28" cy="36" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M20 46C22 44 26 44 28 46" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <rect x="42" y="24" width="14" height="20" rx="2" fill="#6366f1" />
            <path d="M42 28L49 34L56 28" stroke="#a855f7" strokeWidth="2" />
            <rect x="48" y="44" width="2" height="12" fill="#4b5563" />
        </svg>
    );
}

// Loading/Spinner icon
export function IconLoading({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <ellipse cx="32" cy="36" rx="16" ry="18" fill="#FFD93D" />
            <ellipse cx="28" cy="32" rx="3" ry="4" fill="#1a1a2e" />
            <ellipse cx="36" cy="32" rx="3" ry="4" fill="#1a1a2e" />
            <path d="M26 44C28 46 36 46 38 44" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="14" r="8" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 30" />
        </svg>
    );
}

// GitHub icon
export function IconGithub({ size = 16, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" className={className}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
    );
}

// Info/Lightbulb icon
export function IconInfo({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <ellipse cx="32" cy="38" rx="14" ry="16" fill="#FFD93D" />
            <ellipse cx="28" cy="34" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="36" cy="34" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M28 44C30 46 34 46 36 44" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="14" r="8" fill="#fbbf24" />
            <path d="M32 10V18" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 6L32 10L36 6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Trash/Delete icon
export function IconTrash({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <ellipse cx="32" cy="44" rx="12" ry="14" fill="#FFD93D" />
            <ellipse cx="28" cy="40" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="36" cy="40" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M28 50C30 48 34 48 36 50" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <rect x="22" y="10" width="20" height="24" rx="2" fill="#ef4444" />
            <rect x="18" y="8" width="28" height="4" rx="1" fill="#dc2626" />
            <rect x="28" y="4" width="8" height="4" rx="1" fill="#b91c1c" />
            <rect x="26" y="16" width="2" height="12" rx="1" fill="#1a1a2e" />
            <rect x="31" y="16" width="2" height="12" rx="1" fill="#1a1a2e" />
            <rect x="36" y="16" width="2" height="12" rx="1" fill="#1a1a2e" />
        </svg>
    );
}

// Megaphone/Announcement icon
export function IconMegaphone({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <ellipse cx="24" cy="40" rx="12" ry="14" fill="#FFD93D" />
            <ellipse cx="20" cy="36" rx="2" ry="3" fill="#1a1a2e" />
            <ellipse cx="28" cy="36" rx="2" ry="3" fill="#1a1a2e" />
            <path d="M20 46C22 48 26 48 28 46" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
            <path d="M36 20L52 12V40L36 32V20Z" fill="#a855f7" />
            <rect x="32" y="20" width="6" height="14" rx="2" fill="#6366f1" />
            <circle cx="52" cy="26" r="4" fill="#f472b6" />
            <path d="M56 20L60 16M56 26L62 26M56 32L60 36" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
// Brain/AI/Analyze icon
export function IconBrain({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <path d="M32 56C32 56 14 50 14 32C14 14 32 8 32 8C32 8 50 14 50 32C50 50 32 56 32 56Z" fill="#1a1a2e" stroke="#bef264" strokeWidth="3" strokeLinecap="round" />
            <path d="M32 16V24" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 20L26 26" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 20L38 26" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 32H26" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 32H46" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 44L26 38" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <path d="M42 44L38 38" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="32" r="4" fill="#bef264" />
            <circle cx="32" cy="16" r="2" fill="#bef264" />
            <circle cx="20" cy="20" r="2" fill="#bef264" />
            <circle cx="44" cy="20" r="2" fill="#bef264" />
        </svg>
    );
}

// Code/Spark/Generate icon
export function IconCodeSpark({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <path d="M16 24L8 32L16 40" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M48 24L56 32L48 40" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 20L36 44" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            <path d="M32 10L36 18H30L34 26" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="32" r="12" fill="#38bdf8" fillOpacity="0.2" />
        </svg>
    );
}

// Cycle/Daily/Verify icon
export function IconCycleDaily({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M32 12V8M32 56V52M52 32H56M8 32H12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <path d="M46.14 17.86L43.31 20.69M17.86 46.14L20.69 43.31M17.86 17.86L20.69 20.69M46.14 46.14L43.31 43.31" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 18C24.268 18 18 24.268 18 32C18 39.732 24.268 46 32 46C39.732 46 46 39.732 46 32" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round" />
            <path d="M46 32L42 28M46 32L42 36" stroke="#f9a8d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="6" fill="#fbbf24" />
        </svg>
    );
}


// Mimo Icon
export function IconMimo({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <circle cx="32" cy="32" r="28" fill="#a855f7" fillOpacity="0.1" stroke="#a855f7" strokeWidth="2" />
            <text x="32" y="42" fontSize="28" fontWeight="bold" fill="#a855f7" textAnchor="middle">AI1</text>
        </svg>
    );
}

// Grok Icon
export function IconGrok({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <circle cx="32" cy="32" r="28" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
            <text x="32" y="42" fontSize="28" fontWeight="bold" fill="#3b82f6" textAnchor="middle">AI2</text>
        </svg>
    );
}

// Balance/Fairness icon
export function IconBalance({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M32 8V24" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
            <path d="M12 24H52" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
            <path d="M16 24L8 44H24L16 24Z" fill="#eab308" fillOpacity="0.2" stroke="#eab308" strokeWidth="2" strokeLinejoin="round" />
            <path d="M48 24L40 44H56L48 24Z" fill="#eab308" fillOpacity="0.2" stroke="#eab308" strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 56V24" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 56H40" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
            <circle cx="32" cy="12" r="4" fill="#fbbf24" stroke="#eab308" strokeWidth="2" />
        </svg>
    );
}

// Target/Goal icon
export function IconTarget({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <circle cx="32" cy="32" r="24" stroke="#a855f7" strokeWidth="2" fill="#a855f7" fillOpacity="0.05" />
            <circle cx="32" cy="32" r="16" stroke="#6366f1" strokeWidth="2" />
            <circle cx="32" cy="32" r="8" fill="#FFD93D" />
            <circle cx="32" cy="32" r="4" fill="#1a1a2e" />
            <path d="M56 32H60M4 32H8M32 4V8M32 56V60" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Rocket/Launch icon
export function IconRocket({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M32 6C32 6 20 18 20 34C20 44 16 48 12 50V54H24L26 48H38L40 54H52V50C48 48 44 44 44 34C44 18 32 6 32 6Z" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="24" r="6" fill="#FFD93D" stroke="#1a1a2e" strokeWidth="2" />
            <path d="M26 48L24 54M38 48L40 54" stroke="#1a1a2e" strokeWidth="2" />
            <path d="M32 54V60" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <path d="M26 56L24 58M38 56L40 58" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// Clipboard/Rules icon
export function IconClipboard({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <rect x="14" y="10" width="36" height="46" rx="4" fill="#1a1a2e" fillOpacity="0.05" stroke="#22c55e" strokeWidth="2" />
            <path d="M22 6H42V14H22V6Z" fill="#22c55e" />
            <circle cx="32" cy="10" r="2" fill="#1a1a2e" />
            <path d="M22 24H42M22 34H42M22 44H34" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 24H20M18 34H20M18 44H20" stroke="#FFD93D" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

// Star/Favorite icon
export function IconStar({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
            <path d="M32 8L39 24H56L42 34L48 50L32 40L16 50L22 34L8 24H25L32 8Z" fill="#FFD93D" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="32" r="4" fill="#fbbf24" fillOpacity="0.5" />
        </svg>
    );
}

// Coffee icon
export function IconCoffee({ size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M12 20h32v24c0 4.4-3.6 8-8 8H20c-4.4 0-8-3.6-8-8V20z" fill="#78350f" />
            <path d="M44 20h4c2.2 0 4 1.8 4 4v4c0 2.2-1.8 4-4 4h-4" stroke="#78350f" strokeWidth="4" />
            <path d="M20 12c0-4 4-4 4-8" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
            <path d="M36 12c0-4 4-4 4-8" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 12c0-4 4-4 4-8" stroke="#d6d3d1" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// X (Twitter) icon
export function IconX({ size = 24, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

// Icon map for dynamic usage
export const iconMap = {
    mimo: IconMimo,
    grok: IconGrok,
    dna: IconDNA,
    home: IconHome,
    playground: IconPlayground,
    game: IconPlayground,
    changelog: IconChangelog,
    analytics: IconAnalytics,
    click: IconClick,
    warning: IconWarning,
    celebration: IconCelebration,
    fire: IconFire,
    crown: IconCrown,
    empty: IconEmpty,
    loading: IconLoading,
    info: IconInfo,
    trash: IconTrash,
    megaphone: IconMegaphone,
    brain: IconBrain,
    code: IconCodeSpark,
    daily: IconCycleDaily,
    star: IconStar,
    target: IconTarget,
    rocket: IconRocket,
    clipboard: IconClipboard,
    balance: IconBalance,
    x: IconX,
} as const;

export type IconName = keyof typeof iconMap;

export function Icon({ name, size = 48, className = "", "aria-hidden": ariaHidden, "aria-label": ariaLabel }: { name: IconName } & IconProps) {
    const IconComponent = iconMap[name];
    return <IconComponent size={size} className={className} aria-hidden={ariaHidden} aria-label={ariaLabel} />;
}

