
import React, { useState } from 'react';
import { Search, Loader2, Globe, ExternalLink, Hash } from 'lucide-react';
import { nexusSearch } from '../services/gemini';

const NexusSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; citations: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await nexusSearch(query);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="py-12 pb-32 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-orbitron font-black tracking-widest uppercase mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          Nexus Search
        </h1>
        <p className="text-neutral-500 text-sm font-orbitron tracking-widest">
          QUERY THE MULTIVERSE | ACCESS GROUNDED INTEL
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about heroes, timelines, or cinematic history..."
          className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl py-5 px-8 pr-16 text-lg focus:outline-none focus:border-cyan-500/50 transition-all font-inter placeholder:text-neutral-700"
        />
        <button 
          disabled={loading}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-cyan-500 rounded-xl text-black hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
        </button>
      </form>

      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel rounded-2xl p-8 mb-8 border-cyan-500/20">
             <div className="flex items-center gap-2 mb-6 text-cyan-400 opacity-60">
               <Hash size={16} />
               <span className="text-[10px] font-orbitron uppercase tracking-[0.3em]">INTELLIGENCE_REPORT</span>
             </div>
             <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed">
               {result.text.split('\n').map((line, i) => (
                 <p key={i} className="mb-4">{line}</p>
               ))}
             </div>
          </div>

          {result.citations.length > 0 && (
            <div className="space-y-4">
               <h3 className="font-orbitron text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                 <Globe size={14} /> Web Grounding Sources
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {result.citations.map((chunk, idx) => (
                   chunk.web && (
                     <a 
                       key={idx}
                       href={chunk.web.uri}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="glass-panel p-4 rounded-xl border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between group"
                     >
                       <span className="text-xs text-neutral-400 truncate pr-4">{chunk.web.title || chunk.web.uri}</span>
                       <ExternalLink size={14} className="text-neutral-600 group-hover:text-cyan-400" />
                     </a>
                   )
                 ))}
               </div>
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-cyan-500/20 rounded-full" />
            <div className="w-12 h-12 border-2 border-t-cyan-500 rounded-full animate-spin absolute top-0" />
          </div>
          <p className="font-orbitron text-[10px] text-cyan-500 animate-pulse tracking-[0.4em]">CONNECTING_TO_NEXUS...</p>
        </div>
      )}
    </div>
  );
};

export default NexusSearch;
