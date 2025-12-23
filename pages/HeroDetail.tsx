
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_HEROES, INITIAL_CANON_EVENTS } from '../constants';
import { Hero, CanonEvent } from '../types';
import { getHeroInsights } from '../services/gemini';
import CanonAlert from '../components/CanonAlert';
import { ArrowLeft, Cpu, ShieldAlert, Zap, Lock, Info } from 'lucide-react';

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Hero | null>(null);
  const [canonEvents, setCanonEvents] = useState<CanonEvent[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('Initializing neural link...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundHero = INITIAL_HEROES.find(h => h.id === id);
    if (foundHero) {
      setHero(foundHero);
      const events = INITIAL_CANON_EVENTS.filter(ce => ce.hero_id === id);
      setCanonEvents(events);
      
      // Fetch dynamic insights
      getHeroInsights(foundHero.alias).then(text => setAiInsight(text || ""));
    }
    setLoading(false);
  }, [id]);

  if (loading || !hero) return <div className="p-20 text-center font-orbitron">SYNCING...</div>;

  return (
    <div className="pb-32 pt-8 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-cyan-400 transition-colors mb-8 font-orbitron text-xs tracking-widest">
        <ArrowLeft size={16} /> RETURN_TO_BASE
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Profile Image & Quick Stats */}
        <div className="lg:col-span-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-rose-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative rounded-xl overflow-hidden glass-panel border-white/5">
              <img 
                src={hero.image_url} 
                alt={hero.alias} 
                className="w-full aspect-[4/5] object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <h2 className="text-4xl font-orbitron font-black uppercase text-white mb-2">{hero.alias}</h2>
                <p className="text-cyan-400 font-orbitron tracking-widest text-xs">{hero.name} | {hero.origin_world}</p>
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
        </div>

        {/* Detailed Info */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <section>
            <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <Cpu size={20} /> J.A.R.V.I.S. INTEL
            </h3>
            <div className="glass-panel p-6 rounded-xl border-white/5 text-neutral-300 leading-relaxed text-sm">
              <div className="mb-4 whitespace-pre-wrap font-mono opacity-80 border-l-2 border-cyan-500 pl-4 py-1">
                {aiInsight}
              </div>
              <p>{hero.description}</p>
            </div>
          </section>

          <section>
             <h3 className="font-orbitron text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Info size={20} /> ABILITIES & WEAKNESSES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-[10px] font-orbitron uppercase text-cyan-400 tracking-widest">Enhanced Capabilities</h4>
                {hero.powers.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full" /> {p}
                  </div>
                ))}
              </div>
              <div className="space-y-3 relative">
                <h4 className="text-[10px] font-orbitron uppercase text-rose-500 tracking-widest">Tactical Vulnerabilities</h4>
                {hero.is_locked_content ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center glass-panel rounded-lg backdrop-blur-md border-rose-500/20 group">
                    <Lock className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                    <button className="text-[10px] font-orbitron uppercase bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-rose-600 transition-colors">
                      Unlock Intel
                    </button>
                  </div>
                ) : (
                  hero.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                      <div className="w-1 h-1 bg-rose-500 rounded-full" /> {w}
                    </div>
                  ))
                )}
                {/* Placeholder content for blur effect */}
                <div className={hero.is_locked_content ? 'blur-sm select-none opacity-20' : ''}>
                   {hero.weaknesses.map((w, i) => <div key={i} className="text-sm py-1 opacity-0">{w}</div>)}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-orbitron text-lg font-bold mb-6 flex items-center gap-2 text-rose-500">
              <ShieldAlert size={20} /> MULTIVERSE CANON TIMELINE
            </h3>
            <div className="flex flex-col gap-4">
              {canonEvents.length > 0 ? (
                canonEvents.map((ce) => (
                  <CanonAlert key={ce.id} description={ce.description} movieTitle={ce.movie_title} />
                ))
              ) : (
                <div className="text-center py-8 glass-panel border-dashed border-white/10 rounded-xl">
                  <p className="text-neutral-500 font-orbitron text-xs">NO FIXED POINTS RECORDED FOR THIS VARIANT</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HeroDetail;
