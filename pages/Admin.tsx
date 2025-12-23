
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, RefreshCcw, Database, Shield, AlertCircle, Plus, CheckCircle2, Search, Loader2, Trash2, Camera, Sparkles, Target, Radio } from 'lucide-react';
import { suggestNewHeroes, deepScanHero, generateHeroImage } from '../services/gemini';
import { useNexus } from '../context/NexusContext';
import { Hero } from '../types';

const Admin: React.FC = () => {
  const { addHero, heroes, resetDatabase } = useNexus();
  const [logs, setLogs] = useState<string[]>(['SYSTEM_INIT: SUCCESS', 'SECURITY_LAYER: ACTIVE', 'PROJECT_INSIGHT: ONLINE']);
  const [syncing, setSyncing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [generatingImg, setGeneratingImg] = useState<string | null>(null);
  const [scanQuery, setScanQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSync = async () => {
    setSyncing(true);
    addLog('REQUESTING_MULTIVERSE_SYNC...');
    try {
      const news = await suggestNewHeroes();
      setSuggestions(news);
      addLog(`SYNC_COMPLETE: FOUND ${news.length} NEW ENTITIES`);
    } catch (e) {
      addLog('SYNC_ERROR: UNKNOWN_TIMELINE_INTERFERENCE');
    }
    setSyncing(false);
  };

  /**
   * Triggers the Deep Scan Multiverse locator.
   * Calls gemini-3-flash to generate a full profile based on the query.
   */
  const handleDeepScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanQuery.trim();
    if (!query) return;

    setScanning(true);
    addLog(`INITIATING_DEEP_SCAN_FOR: "${query.toUpperCase()}"`);
    addLog('CONNECTING_TO_NEXUS_NODES...');
    
    try {
      const result = await deepScanHero(query);
      
      if (result && result.alias) {
        addLog(`SCAN_SUCCESS: TARGET_LOCKED: ${result.alias.toUpperCase()}`);
        addLog(`ORIGIN_VERIFIED: ${result.origin_world}`);
        
        // Add to suggestions if not already present
        setSuggestions(prev => {
          const exists = prev.some(s => s.alias.toLowerCase() === result.alias.toLowerCase());
          if (exists) {
            addLog(`NOTE: ENTITY "${result.alias.toUpperCase()}" ALREADY IN BUFFER`);
            return prev;
          }
          return [result, ...prev];
        });
        
        setScanQuery('');
      } else {
        addLog('SCAN_FAILURE: NO_BIOMETRIC_MATCH_FOUND');
      }
    } catch (err) {
      addLog(`CRITICAL_ERROR: TEMPORAL_FEED_INTERRUPTED`);
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateVisual = async (hero: any) => {
    setGeneratingImg(hero.alias);
    addLog(`INITIATING_IMAGE_GENERATION: ${hero.alias.toUpperCase()}...`);
    
    const imageUrl = await generateHeroImage(hero.alias, hero.description);
    if (imageUrl) {
      setSuggestions(prev => prev.map(s => s.alias === hero.alias ? { ...s, image_url: imageUrl } : s));
      addLog(`VISUAL_GEN_SUCCESS: IMAGE_DECODED_FOR_${hero.alias.toUpperCase()}`);
    } else {
      addLog(`VISUAL_GEN_FAILURE: NO_OPTICAL_DATA_RETRIEVED`);
    }
    setGeneratingImg(null);
  };

  const handleAddHero = (suggested: any) => {
    if (heroes.some(h => h.alias.toLowerCase() === suggested.alias.toLowerCase())) {
      addLog(`ERROR: ENTITY ${suggested.alias.toUpperCase()} ALREADY REGISTERED`);
      setAddedIds(prev => new Set(prev).add(suggested.alias));
      return;
    }

    const newHero: Hero = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: suggested.name,
      alias: suggested.alias,
      origin_world: suggested.origin_world || 'Earth-616',
      powers: suggested.powers || [],
      weaknesses: suggested.weaknesses || ['Unknown - Requires Field Analysis'],
      image_url: suggested.image_url || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800',
      is_locked_content: true,
      description: suggested.description || 'New entity detected during temporal scan.'
    };
    
    addHero(newHero);
    setAddedIds(prev => new Set(prev).add(suggested.alias));
    addLog(`ENTITY_COMMITTED_TO_DATABASE: ${newHero.alias.toUpperCase()}`);
  };

  const handleReset = () => {
    if (window.confirm("PURGE_ENTIRE_DATABASE? All custom scanned heroes will be lost.")) {
      resetDatabase();
      setAddedIds(new Set());
      setSuggestions([]);
      addLog('SYSTEM_RESET: DATABASE PURGED TO DEFAULTS');
    }
  };

  return (
    <div className="py-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-orbitron font-bold flex items-center gap-3">
            <Shield className="text-rose-500" /> Admin Console
          </h1>
          <p className="text-neutral-500 text-[10px] font-orbitron tracking-widest mt-1 uppercase">SHIELD_SECURITY_PROTOCOL: LEVEL_10</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={handleReset}
            className="glass-panel px-4 py-3 rounded-xl border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 font-orbitron text-[9px] tracking-widest shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            <Trash2 size={14} /> PURGE_DB
          </button>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="glass-panel px-6 py-3 rounded-xl border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 font-orbitron text-[9px] tracking-widest disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            <RefreshCcw size={14} className={syncing ? 'animate-spin' : ''} />
            SYNC_MULTIVERSE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal Log */}
        <div className="lg:col-span-4 glass-panel rounded-2xl overflow-hidden border-rose-500/10 flex flex-col h-[600px] bg-black/40">
          <div className="bg-rose-900/10 p-3 border-b border-rose-500/10 flex items-center gap-2">
            <Terminal size={14} className="text-rose-500" />
            <span className="text-[10px] font-orbitron text-rose-500 uppercase tracking-widest">Live_System_Logs</span>
          </div>
          <div className="p-4 font-mono text-[11px] text-rose-400/80 space-y-2 overflow-y-auto flex-1">
             {logs.map((log, i) => (
               <div key={i} className="animate-in fade-in slide-in-from-left-2 opacity-80 border-l border-rose-900/40 pl-2">
                 {log}
               </div>
             ))}
          </div>
          <div className="p-3 bg-black/40 border-t border-rose-500/10 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_green]" />
                <span className="text-[8px] font-orbitron text-neutral-500 tracking-widest uppercase">Connection: Stable</span>
             </div>
             <span className="text-[8px] font-mono text-rose-900">VER: 1.0.4-SHIELD</span>
          </div>
        </div>

        {/* Dynamic Scan & Suggestions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-cyan-500/20 bg-cyan-950/5 relative overflow-hidden">
            {/* Background scanner animation when active */}
            <AnimatePresence>
              {scanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_cyan] animate-[admin-scan_2s_linear_infinite]" />
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="font-orbitron text-xs font-bold uppercase tracking-[0.3em] text-cyan-400 mb-6 flex items-center gap-2">
               <Radio size={14} className={scanning ? 'animate-pulse text-cyan-400' : 'text-cyan-600'} /> 
               DEEP_SCAN_LOCATOR
            </h3>
            <form onSubmit={handleDeepScan} className="flex gap-3 relative z-10">
              <div className="relative flex-1">
                <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input 
                  type="text" 
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  disabled={scanning}
                  placeholder="Query Multiverse Entity (e.g. Wanda Maximoff)..."
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-14 pr-4 font-inter text-sm focus:outline-none focus:border-cyan-500/40 transition-all disabled:opacity-50"
                />
              </div>
              <button 
                type="submit"
                disabled={scanning || !scanQuery.trim()}
                className="bg-cyan-500 text-black px-8 py-4 rounded-2xl font-orbitron text-[10px] font-bold tracking-widest hover:bg-cyan-400 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)] min-w-[140px]"
              >
                {scanning ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'INITIATE_SCAN'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/5 min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-white/5 rounded-lg">
                 <Database size={18} className="text-cyan-400" />
               </div>
               <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest">Temporal_Buffer_Entities</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {suggestions.map((hero, i) => (
                  <motion.div 
                    key={`${hero.alias}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex flex-col justify-between p-6 bg-neutral-900/60 border border-white/5 rounded-2xl hover:border-cyan-500/20 transition-all group relative overflow-hidden"
                  >
                    <div className="mb-4">
                      <div className="relative h-32 w-full rounded-xl overflow-hidden mb-4 border border-white/10 bg-neutral-800">
                        {hero.image_url ? (
                          <img src={hero.image_url} alt={hero.alias} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-20">
                            <Camera size={32} />
                          </div>
                        )}
                        {generatingImg === hero.alias && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                             <Loader2 size={24} className="text-cyan-500 animate-spin" />
                             <span className="text-[8px] font-orbitron text-cyan-500 tracking-widest uppercase animate-pulse">Neural_Rendering...</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-orbitron text-sm text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider truncate max-w-[150px]">{hero.alias}</h4>
                        <span className="text-[8px] font-mono text-cyan-500/60 px-2 py-0.5 border border-cyan-500/20 rounded uppercase bg-cyan-500/5">{hero.origin_world}</span>
                      </div>
                      <p className="text-[10px] text-neutral-500 font-inter mb-4 line-clamp-2 italic">{hero.description}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleGenerateVisual(hero)}
                        disabled={generatingImg === hero.alias}
                        className={`p-3 rounded-xl transition-all flex items-center gap-2 border ${
                          generatingImg === hero.alias 
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                          : 'bg-neutral-800 border-white/5 text-cyan-500 hover:bg-cyan-500 hover:text-black hover:border-cyan-500'
                        }`}
                        title="Generate AI Visual"
                      >
                        {generatingImg === hero.alias ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        <span className="text-[9px] font-orbitron uppercase tracking-widest font-bold">Gen_Visual</span>
                      </button>
                      <button 
                        onClick={() => handleAddHero(hero)}
                        disabled={addedIds.has(hero.alias) || heroes.some(h => h.alias.toLowerCase() === hero.alias.toLowerCase())}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[9px] tracking-[0.2em] uppercase transition-all ${
                          (addedIds.has(hero.alias) || heroes.some(h => h.alias.toLowerCase() === hero.alias.toLowerCase()))
                          ? 'bg-green-900/10 text-green-400 border border-green-800/20 cursor-default' 
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                        }`}
                      >
                        {(addedIds.has(hero.alias) || heroes.some(h => h.alias.toLowerCase() === hero.alias.toLowerCase())) ? (
                          <><CheckCircle2 size={12} /> REGISTERED</>
                        ) : (
                          <><Plus size={12} /> COMMIT_ENTITY</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {suggestions.length === 0 && !scanning && (
              <div className="flex flex-col items-center justify-center h-[280px] text-neutral-800 border border-dashed border-white/5 rounded-2xl">
                <AlertCircle size={40} className="mb-4 opacity-20" />
                <p className="font-orbitron text-[10px] tracking-[0.4em] opacity-40">WAITING_FOR_DATA_NODES</p>
                <p className="text-[9px] mt-2 opacity-20 font-inter">INITIATE_SCAN_TO_PROCEED</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes admin-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Admin;
