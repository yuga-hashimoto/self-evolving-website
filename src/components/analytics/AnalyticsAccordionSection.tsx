'use client';

import { ModelAnalyticsAccordion } from './ModelAnalyticsAccordion';

interface AnalyticsAccordionSectionProps {
    title: string;
    translations: {
        detailedAnalytics: string;
        expandAnalytics: string;
        collapseAnalytics: string;
        loading: string;
        noData: string;
        pageviews: string;
        avgSessionDuration: string;
    };
}

export function AnalyticsAccordionSection({ title, translations }: AnalyticsAccordionSectionProps) {
    return (
        <div className="max-w-3xl w-full mb-6 px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400">
                {title}
            </h3>
            <div className="space-y-4">
                <ModelAnalyticsAccordion modelId="ai1" translations={translations} />
                <ModelAnalyticsAccordion modelId="ai2" translations={translations} />
            </div>
        </div>
    );
}
