
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, CanonEvent } from '../types';
import { getHeroInsights } from '../services/gemini';
import { useNexus } from '../context/NexusContext';
import CanonAlert from '../components/CanonAlert';
import { ArrowLeft, Cpu, ShieldAlert, Zap, Lock, Info, Loader2, Unlock } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { heroes, canonEvents: allCanon, isHeroUnlocked, unlockHero } = useNexus();
  const [hero, setHero] = useState<Hero | null>(null);
  const [canonEvents, setCanonEvents] = useState<CanonEvent[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('Initializing neural link...');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const foundHero = heroes.find(h => h.id === id);
    if (foundHero) {
      setHero(foundHero);
      const events = allCanon.filter(ce => ce.hero_id === id);
      setCanonEvents(events);
      getHeroInsights(foundHero.alias).then(text => setAiInsight(text || ""));
    }
    window.scrollTo(0, 0);
  }, [id, heroes, allCanon]);

  const handleUnlock = () => {
    setUnlocking(true);
    setTimeout(() => {
      unlockHero(hero?.id || '');
      setUnlocking(false);
    }, 2500);
  };

  if (!hero) return <div className="p-20 text-center font-orbitron text-rose-500">ENTITY_NOT_FOUND_IN_ARCHIVE</div>;

  const unlocked = isHeroUnlocked(hero.id) || !hero.is_locked_content;

  return (
    <div className="pb-32 pt-8">
      {/* Decryption Overlay */}
      <AnimatePresence>
        {unlocking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <div className="relative">
              <Loader2 size={80} className="text-cyan-500 animate-spin" />
              <ShieldAlert size={30} className="absolute inset-0 m-auto text-rose-500 animate-pulse" />
            </div>
            <h2 className="mt-8 font-orbitron text-xl tracking-[0.5em] text-cyan-400 animate-pulse">DECRYPTING_TACTICAL_DATA</h2>
            <div className="mt-4 w-64 h-1 bg-neutral-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
                className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-cyan-400 transition-colors mb-8 font-orbitron text-xs tracking-widest">
        <ArrowLeft size={16} /> RETURN_TO_BASE
      </Link>

      <motion.div 
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* Profile Image & Quick Stats */}
        <motion.div variants={sectionVariants} className="lg:col-span-5">
          <div className="relative group">
            <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000`}></div>
            <div className="relative rounded-xl overflow-hidden glass-panel border-white/5">
              <img 
                src={hero.image_url} 
                alt={hero.alias} 
                className="w-full aspect-[4/5] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
                <h2 className="text-4xl font-orbitron font-black uppercase text-white mb-2">{hero.alias}</h2>
                <p className="text-cyan-400 font-orbitron tracking-widest text-[10px]">{hero.name} | {hero.origin_world}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-lg border-white/5">
              <span className="text-[10px] text-neutral-500 font-orbitron uppercase tracking-widest block mb-2">Power Class</span>
              <div className="flex items-center gap-2 text-cyan-400">
                <Zap size={18} />
                <span className="text-lg font-orbitron">OMEGA</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-lg border-white/5">
              <span className="text-[10px] text-neutral-500 font-orbitron uppercase tracking-widest block mb-2">Threat Level</span>
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert size={18} />
                <span className="text-lg font-orbitron">CRITICAL</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.section variants={sectionVariants}>
            <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <Cpu size={20} /> J.A.R.V.I.S. TACTICAL INTEL
            </h3>
            <div className="glass-panel p-6 rounded-xl border-white/5 text-neutral-300 leading-relaxed text-sm bg-cyan-950/5">
              <div className="mb-4 whitespace-pre-wrap font-mono text-cyan-100 opacity-80 border-l-2 border-cyan-500 pl-4 py-2 bg-black/40 rounded-r-lg">
                {aiInsight}
              </div>
              <p className="text-neutral-400">{hero.description}</p>
            </div>
          </motion.section>

          <motion.section variants={sectionVariants}>
             <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Info size={20} /> ABILITIES & WEAKNESSES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-orbitron uppercase text-cyan-400 tracking-widest">Enhanced Capabilities</h4>
                {hero.powers.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.8)]" /> {p}
                  </div>
                ))}
              </div>
              <div className="space-y-3 relative min-h-[120px]">
                <h4 className="text-[10px] font-orbitron uppercase text-rose-500 tracking-widest">Tactical Vulnerabilities</h4>
                <AnimatePresence mode="wait">
                  {!unlocked ? (
                    <motion.div 
                      key="locked-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center glass-panel rounded-lg backdrop-blur-xl border-rose-500/20 p-4 text-center"
                    >
                      <Lock size={20} className="text-rose-500 mb-3" />
                      <button 
                        onClick={handleUnlock}
                        className="text-[10px] font-orbitron uppercase bg-rose-500 hover:bg-rose-400 text-white px-4 py-2.5 rounded-lg transition-all border border-rose-400/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                      >
                        Unlock Classified Intel
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="unlocked-state"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="space-y-3"
                    >
                      {hero.weaknesses.map((w, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-sm text-neutral-300"
                        >
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)]" /> {w}
                        </motion.div>
                      ))}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 p-2 bg-green-500/10 border border-green-500/20 rounded flex items-center gap-2"
                      >
                         <Unlock size={12} className="text-green-500" />
                         <span className="text-[9px] font-orbitron text-green-500 uppercase tracking-widest">Intel_Verified</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className={!unlocked ? 'blur-sm select-none opacity-20' : 'hidden'}>
                   {hero.weaknesses.map((w, i) => <div key={i} className="text-sm py-1">CLASSIFIED_DATA_ENTRY</div>)}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section variants={sectionVariants}>
            <h3 className="font-orbitron text-lg font-bold mb-6 flex items-center gap-2 text-rose-500">
              <ShieldAlert size={20} /> MULTIVERSE CANON TIMELINE
            </h3>
            <div className="flex flex-col gap-4">
              {canonEvents.length > 0 ? (
                canonEvents.map((ce, idx) => (
                  <motion.div
                    key={ce.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <CanonAlert description={ce.description} movieTitle={ce.movie_title} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 glass-panel border-dashed border-white/5 rounded-xl bg-rose-500/5">
                  <ShieldAlert size={24} className="mx-auto text-rose-900 mb-2" />
                  <p className="text-rose-900 font-orbitron text-[9px] tracking-widest uppercase">NO_FIXED_POINTS_RECORDED_FOR_THIS_VARIANT</p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroDetail;
