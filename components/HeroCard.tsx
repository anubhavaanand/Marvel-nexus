
import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../types';
import { Lock, Zap } from 'lucide-react';

interface HeroCardProps {
  hero: Hero;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  return (
    <Link to={`/hero/${hero.id}`} className="group relative block h-[450px] w-full max-w-[300px] overflow-hidden rounded-xl border border-white/10 glass-panel glow-border transition-all duration-500 hover:-translate-y-2">
      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={hero.image_url} 
          alt={hero.alias} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center justify-between mb-2">
           <span className="text-[10px] font-orbitron tracking-[0.2em] text-cyan-400 flex items-center gap-1">
             <Zap size={10} /> {hero.origin_world}
           </span>
           {hero.is_locked_content && (
             <Lock size={14} className="text-rose-500 animate-pulse" />
           )}
        </div>
        <h3 className="text-xl font-orbitron font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors uppercase tracking-tight">
          {hero.alias}
        </h3>
        <p className="text-sm text-neutral-400 font-medium">{hero.name}</p>
        
        {/* Subtle Decorative Lines */}
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-cyan-500/50 to-transparent" />
      </div>

      {/* Scanning Effect Overlay on Hover */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 animate-[scan_2s_linear_infinite]" />
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </Link>
  );
};

export default HeroCard;
