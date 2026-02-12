import AIChat from '@/components/features/AIChat';
import { useTranslations } from 'next-intl';

export default function ChatPage() {
  const t = useTranslations('aiChat');

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                {t('title')}
            </h1>
            <p className="text-gray-400 text-center mb-8">{t('subtitle')}</p>
            <AIChat />
        </div>
    </div>
  );
}
