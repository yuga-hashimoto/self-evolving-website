import { notFound } from "next/navigation";
import { getModel, MODELS } from "@/lib/models";
import { IconPlayground, IconWarning } from "@/components/icons/Icons";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export function generateStaticParams() {
    return Object.keys(MODELS).map((modelId) => ({
        modelId,
    }));
}

interface PageProps {
    params: Promise<{ modelId: string }>;
}

export default async function PlaygroundPage({ params }: PageProps) {
    const { modelId } = await params;
    const model = getModel(modelId);

    if (!model) {
        notFound();
    }

    const t = await getTranslations("playground.generic");

    return (
        <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16">
            <div className="max-w-2xl w-full">
                {/* Warning Banner */}
                <div className="glass-card p-4 mb-8 border-l-4 border-yellow-500/50">
                    <div className="flex items-center gap-3">
                        <IconWarning size={32} />
                        <p className="text-yellow-300 text-sm">
                            {t("warningMessage", { modelName: model.name })}
                        </p>
                    </div>
                </div>

                {/* Playground Container */}
                <div className="glass-card p-8">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <IconPlayground size={48} />
                        <h1 className="text-3xl font-bold gradient-text">{t("pageTitle", { modelName: model.name })}</h1>
                    </div>

                    {/* Empty - AI will add content here */}
                    <div className="text-center text-gray-400 py-12">
                        <p>{t("emptyContent", { modelName: model.name })}</p>
                        <p className="text-xs text-gray-500 mt-2">{t("emptyState")}</p>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        href={`/models/${modelId}`}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {t("backToModel", { modelName: model.name })}
                    </Link>
                </div>
            </div>
        </div>
    );
}
