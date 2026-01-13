// SVG Icons for Self-Evolving Website
// Nano Banana themed icons

interface IconProps {
    size?: number;
    className?: string;
}

// DNA/Evolution icon - Main logo
export function IconDNA({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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

// Playground/Game icon
export function IconPlayground({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconChangelog({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconAnalytics({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconClick({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconCelebration({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconFire({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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
export function IconCrown({ size = 48, className = "" }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
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

// Icon map for dynamic usage
export const iconMap = {
    dna: IconDNA,
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
} as const;

export type IconName = keyof typeof iconMap;

export function Icon({ name, size = 48, className = "" }: { name: IconName } & IconProps) {
    const IconComponent = iconMap[name];
    return <IconComponent size={size} className={className} />;
}
