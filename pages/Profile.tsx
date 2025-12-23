
import React from 'react';
import { motion } from 'framer-motion';
import { useNexus } from '../context/NexusContext';
import { User, Shield, Zap, Lock, Unlock, Award, Database, Terminal, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { unlockedHeroes, heroes, resetDatabase } = useNexus();
  
  const unlockedEntities = heroes.filter(h => unlockedHeroes.includes(h.id));
  const progress = Math.round((unlockedHeroes.length / heroes.length) * 100) || 0;

  const handlePurge = () => {
    if (confirm("PURGE_BIOMETRIC_DATA: Are you sure you want to clear your archive history?")) {
      resetDatabase();
    }
  };

  return (
    <div className="py-12 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* User Badge */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-2xl border-cyan-500/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield size={120} className="text-cyan-400" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/50 p-1 mb-6 relative">
                 <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-20" />
                 <img 
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
                    alt="Agent" 
                    className="w-full h-full rounded-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-500"
                 />
              </div>
              <h2 className="text-xl font-orbitron font-bold text-white mb-1 uppercase tracking-widest">Agent_Alpha</h2>
              <p className="text-[10px] font-orbitron text-cyan-400 tracking-[0.4em] uppercase mb-6">Level 7 Clearance</p>
              
              <div className="w-full space-y-4">
                <div className="flex justify-between text-[10px] font-orbitron uppercase tracking-widest text-neutral-500">
                  <span>Archive Completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl border-white/5"
          >
            <h3 className="text-xs font-orbitron font-bold text-neutral-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={14} className="text-cyan-400" /> Archive Milestone
            </h3>
            <div className="space-y-3">
               {[
                 { label: 'Multiverse Observer', icon: <Database size={12} />, active: true },
                 { label: 'Nexus Keyholder', icon: <Unlock size={12} />, active: unlockedHeroes.length > 0 },
                 { label: 'Timeline Purist', icon: <Zap size={12} />, active: unlockedHeroes.length > 3 },
                 { label: 'Temporal Architect', icon: <Terminal size={12} />, active: heroes.length > 10 },
               ].map((ach, i) => (
                 <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${ach.active ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-100' : 'border-white/5 text-neutral-600 grayscale opacity-40'}`}>
                   {ach.icon}
                   <span className="text-[10px] font-orbitron uppercase tracking-widest">{ach.label}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats & Unlocks */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-2xl border-white/5"
          >
            <h3 className="text-sm font-orbitron font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
              <Terminal size={18} className="text-rose-500" /> Decrypted Intelligence
            </h3>
            
            {unlockedEntities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unlockedEntities.map(hero => (
                  <Link 
                    key={hero.id}
                    to={`/hero/${hero.id}`}
                    className="flex items-center gap-4 p-4 bg-neutral-900/40 border border-white/5 rounded-xl hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                      <img src={hero.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    </div>
                    <div className="truncate">
                       <h4 className="font-orbitron text-xs text-white group-hover:text-cyan-400 transition-colors">{hero.alias}</h4>
                       <p className="text-[9px] text-neutral-500 uppercase tracking-widest">TACTICAL_DATA: VERIFIED</p>
                    </div>
                    <Unlock size={14} className="ml-auto text-cyan-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
                <Lock size={32} className="mx-auto text-neutral-800 mb-4" />
                <p className="text-neutral-600 font-orbitron text-[10px] tracking-widest uppercase">No classified data decrypted</p>
                <Link to="/" className="mt-4 inline-block text-[10px] font-orbitron text-cyan-400 hover:text-cyan-300 transition-colors">START_SCANNING</Link>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl border-white/5"
             >
                <h4 className="text-[10px] font-orbitron text-neutral-500 uppercase tracking-widest mb-4">Nexus Activity Log</h4>
                <div className="space-y-4">
                  {unlockedEntities.length > 0 ? unlockedEntities.slice(0, 3).map((hero, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1 bg-cyan-500/30 rounded-full" />
                      <div>
                        <p className="text-[11px] text-neutral-300">Decrypted tactical profile for {hero.alias}</p>
                        <p className="text-[9px] text-neutral-600 font-mono uppercase">Node_{hero.id.substr(0, 4)} Access Success</p>
                      </div>
                    </div>
                  )) : (
                    <div className="flex gap-4">
                      <div className="w-1 bg-rose-500/30 rounded-full" />
                      <div>
                        <p className="text-[11px] text-neutral-500">No activity recorded</p>
                        <p className="text-[9px] text-neutral-600 font-mono">STATUS: WAITING_FOR_INPUT</p>
                      </div>
                    </div>
                  )}
                </div>
             </motion.div>
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 rounded-2xl border-white/5 flex flex-col justify-center items-center text-center"
             >
                <Shield size={32} className="text-rose-500 mb-4 opacity-40 animate-pulse" />
                <h4 className="text-[10px] font-orbitron text-white uppercase tracking-widest">Security Protocol</h4>
                <p className="text-[9px] text-neutral-500 mt-2 max-w-[200px] leading-relaxed">Project Insight monitors all multiverse interactions. Biometric signatures are recorded for every data access.</p>
                <button 
                  onClick={handlePurge}
                  className="mt-6 px-4 py-2 border border-rose-500/30 text-rose-500 text-[8px] font-orbitron uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all rounded flex items-center gap-2"
                >
                  <RefreshCw size={10} /> Purge Session
                </button>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
