import fs from 'fs';
import path from 'path';
import { IconCodeSpark } from '@/components/icons/Icons';
import { getTranslations } from 'next-intl/server';
import ReactionButton from '@/components/home/ReactionButton';

interface ChangeLogEntry {
  id: number;
  date: string;
  model: string;
  changes: string;
  intent?: string;
  prUrl?: string;
}

async function getRecentEvolutions(): Promise<ChangeLogEntry[]> {
  const models = ['ai1', 'ai2'];
  let allChanges: ChangeLogEntry[] = [];

  for (const model of models) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'models', model, 'changelog-en.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const changes = JSON.parse(fileContent) as ChangeLogEntry[];
        // Add model info if not present
        const entries = changes.map(c => ({ ...c, model }));
        allChanges = [...allChanges, ...entries];
      }
    } catch (e) {
      console.error(`Error reading changelog for ${model}:`, e);
    }
  }

  // Sort by date descending
  allChanges.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Return top 5
  return allChanges.slice(0, 5);
}

function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
    } catch {
        return dateString;
    }
}

export default async function RecentEvolutions() {
  const evolutions = await getRecentEvolutions();

  if (evolutions.length === 0) return null;

  return (
    <div className="max-w-3xl w-full mb-6 px-4">
      <div className="flex items-center gap-3 mb-6">
         <IconCodeSpark size={32} className="text-purple-400" />
         <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
           Recent Evolutions
         </h3>
      </div>
      
      <div className="glass-card p-4 sm:p-6 border-purple-500/20">
        <div className="space-y-6">
          {evolutions.map((evo) => (
            <div key={`${evo.model}-${evo.id}`} className="relative pl-6 border-l-2 border-white/10 last:pb-0">
               <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full ${evo.model === 'ai1' ? 'bg-purple-500' : 'bg-blue-500'}`} />
               </div>
               
               <div className="mb-1 flex items-center gap-2">
                 <span className="text-xs font-mono text-gray-500">{formatDate(evo.date)}</span>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${evo.model === 'ai1' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                   {evo.model === 'ai1' ? 'AI 1 (AI 1)' : 'AI 2 (AI 2)'}
                 </span>
               </div>
               
               <h4 className="text-base font-semibold text-gray-200 mb-1">
                 {evo.changes.split('.')[0]}.
               </h4>
               
               <p className="text-sm text-gray-400 line-clamp-2">
                 {evo.intent || evo.changes}
               </p>

               <div className="flex items-center gap-3 mt-2">
                 <ReactionButton id={evo.id} model={evo.model} />
                 {evo.prUrl && (
                   <a href={evo.prUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                     View Code &rarr;
                   </a>
                 )}
               </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center border-t border-white/5 pt-4">
            <p className="text-xs text-gray-500 mb-3">Evolution happens automatically twice a day.</p>
             <a 
               href='https://ko-fi.com/yugahashimoto' 
               target='_blank' 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-[#ec4899] hover:bg-[#db2777] text-white text-sm font-medium rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
             >
                <span>☕ Sponsor an Evolution</span>
             </a>
        </div>
      </div>
    </div>
  );
}
