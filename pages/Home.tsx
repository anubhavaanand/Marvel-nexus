
import React, { useState, useEffect } from 'react';
import HeroCard from '../components/HeroCard';
import { INITIAL_HEROES } from '../constants';
import { Hero } from '../types';
import { Database, Activity } from 'lucide-react';

const Home: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial DB fetch
    const timer = setTimeout(() => {
      setHeroes(INITIAL_HEROES);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Activity className="text-cyan-500 animate-spin mb-4" size={48} />
        <h2 className="font-orbitron text-xl tracking-[0.5em] animate-pulse">INIT_DATABASE...</h2>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-12">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-2">
           <Database className="text-cyan-400" size={24} />
           <span className="text-[10px] font-orbitron text-cyan-500 tracking-[0.3em] uppercase">
             Security Level: 7 (Top Secret)
           </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-orbitron font-black uppercase tracking-tighter mb-4">
          Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-500">Nexus</span>
        </h1>
        <p className="max-w-2xl text-neutral-400 text-sm md:text-base leading-relaxed">
          Welcome to the SHIELD Multiverse Archive. Monitor temporal anomalies, track canon events, 
          and access tactical data for known entities across the 616 and branching timelines.
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>
    </div>
  );
};

export default Home;
