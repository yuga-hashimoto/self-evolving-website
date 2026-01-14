import Link from "next/link"; // Assuming Link is used or needed, otherwise just add KofiWidget
import KofiWidget from "@/components/KofiWidget";

export default function Footer() {
    return (
        <footer className="border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    <KofiWidget />
                </div>
                <p className="text-center text-xs text-gray-500 mt-4">
                    © 2026 Self-Evolving Website Experiment. AIが自動生成したコードを含みます。
                </p>
            </div>
        </footer>
    );
}
