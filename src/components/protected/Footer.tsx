import Link from "next/link"; // Assuming Link is used or needed, otherwise just add KofiWidget
import KofiWidget from "@/components/KofiWidget";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 relative z-[60] bg-[#0f0f1a]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center pt-8 pb-20 sm:pb-8 gap-4">
                    <KofiWidget />
                    <p className="text-center text-xs text-gray-500">
                        © 2026 Self-Evolving Website Experiment. AIが自動生成したコードを含みます。
                    </p>
                </div>
            </div>
        </footer>
    );
}
