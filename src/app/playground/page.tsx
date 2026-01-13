import ClickerGame from "@/components/playground/ClickerGame";
import { IconPlayground, IconWarning } from "@/components/icons/Icons";

export default function PlaygroundPage() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-2xl w-full">
                {/* Warning Banner */}
                <div className="glass-card p-4 mb-8 border-l-4 border-yellow-500/50">
                    <div className="flex items-center gap-3">
                        <IconWarning size={32} />
                        <p className="text-yellow-300 text-sm">
                            このページはAIが自由に変更します。予期しない変化が発生する可能性があります。
                        </p>
                    </div>
                </div>

                {/* Playground Container */}
                <div className="glass-card p-8">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <IconPlayground size={48} />
                        <h1 className="text-3xl font-bold gradient-text">実験場</h1>
                    </div>
                    <ClickerGame />
                </div>
            </div>
        </div>
    );
}
