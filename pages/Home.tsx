
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroCard from '../components/HeroCard';
import { useNexus } from '../context/NexusContext';
import { Database, Activity, Search, ShieldAlert, Zap, SearchCode } from 'lucide-react';

const Home: React.FC = () => {
  const { heroes, loading } = useNexus();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredHeroes = useMemo(() => {
    return heroes.filter(h => 
      h.alias.toLowerCase().includes(searchQuery.toLowerCase()) || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [heroes, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative w-24 h-24 mb-6">
          <Activity className="text-cyan-500 animate-spin w-full h-full opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="text-cyan-400 animate-pulse" size={32} />
          </div>
        </div>
        <h2 className="font-orbitron text-xl tracking-[0.5em] animate-pulse text-cyan-500">BOOTING_JARVIS...</h2>
      </div>
    );
  }

  return (
    <div className="pb-40 pt-12 px-2 md:px-0">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
             <Database className="text-cyan-400" size={20} />
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] font-orbitron text-cyan-500 tracking-[0.3em] uppercase">
               SHIELD_NETWORK_ACTIVE
             </span>
             <span className="text-[8px] font-mono text-neutral-600">ENCRYPTION: AES-256 QUANTUM</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black uppercase tracking-tighter mb-4 leading-none">
              NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-rose-500">ARCHIVE</span>
            </h1>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-inter max-w-xl">
              Access tactical profiles for multiverse entities. Monitor canon events and prepare for temporal displacement.
            </p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute -inset-1 bg-cyan-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search Archive or Multiverse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500/50 font-orbitron text-xs tracking-widest uppercase transition-all placeholder:text-neutral-700"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredHeroes.map((hero) => (
            <motion.div
              key={hero.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              <HeroCard hero={hero} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Search Empty State / Discovery Call */}
      {filteredHeroes.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-panel border-dashed border-white/5 rounded-3xl max-w-2xl mx-auto"
        >
          <div className="mb-6 relative inline-block">
             <SearchCode size={64} className="text-neutral-800" />
             <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-10 rounded-full" />
          </div>
          <h3 className="font-orbitron text-lg text-white mb-2 tracking-widest uppercase">Entity Not Found in Local Archive</h3>
          <p className="text-neutral-500 text-xs font-inter mb-8 px-8">
            The entity "{searchQuery}" is not currently registered. Use the Multiverse Scan to locate this variant in other timelines.
          </p>
          <button 
            onClick={() => navigate('/admin')}
            className="px-8 py-3 bg-cyan-500 text-black font-orbitron text-[10px] font-bold tracking-[0.3em] uppercase rounded-xl hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Locate in Multiverse
          </button>
        </motion.div>
      )}

      {/* Decorative Footer Info */}
      <div className="mt-20 flex flex-wrap gap-8 opacity-30 justify-center pointer-events-none">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-cyan-400" />
          <span className="text-[10px] font-orbitron tracking-widest uppercase">Data Nodes: Active</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert size={12} className="text-rose-500" />
          <span className="text-[10px] font-orbitron tracking-widest uppercase">Threat Monitor: Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Database size={12} className="text-cyan-400" />
          <span className="text-[10px] font-orbitron tracking-widest uppercase">Archive Version: 1.0.4-BETA</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
