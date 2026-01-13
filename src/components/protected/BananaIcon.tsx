import Image from "next/image";

interface BananaIconProps {
    name: "dna" | "game" | "changelog" | "analytics" | "click" | "warning" | "celebration" | "fire" | "crown" | "empty" | "loading";
    size?: number;
    className?: string;
}

export default function BananaIcon({ name, size = 48, className = "" }: BananaIconProps) {
    return (
        <Image
            src={`/icons/${name}.png`}
            alt={name}
            width={size}
            height={size}
            className={className}
        />
    );
}
