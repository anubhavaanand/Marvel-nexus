
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hero } from '../types';
import { Lock, Zap, ShieldAlert, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HeroCardProps {
  hero: Hero;
}

const HeroCard: React.FC<HeroCardProps> = ({ hero }) => {
  const [imgError, setImgError] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  // Motion values for the 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Refined spring config for a more responsive, tactile "snap-to-mouse" feel
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // Transform raw mouse position to degrees of rotation - slightly increased range for better visibility
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerScan();
  };

  const handleLockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/hero/${hero.id}`);
  };

  return (
    <div 
      className="relative h-[480px] w-full"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/hero/${hero.id}`} className="block h-full w-full">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ scale: 1.03 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            scale: { duration: 0.25 } 
          }}
          className="group relative h-full w-full overflow-hidden rounded-3xl border border-white/5 glass-panel transition-colors duration-300 hover:border-cyan-500/40 shadow-2xl"
        >
          {/* Hero Image */}
          <div className="absolute inset-0 z-0 bg-neutral-900" style={{ transform: "translateZ(-30px)" }}>
            {!imgError ? (
              <img 
                src={hero.image_url} 
                alt={hero.alias} 
                onError={() => setImgError(true)}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100 grayscale-[0.5] group-hover:grayscale-0"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black">
                 <ShieldAlert className="text-neutral-800" size={80} />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-orbitron text-neutral-600 tracking-[1em] rotate-90 whitespace-nowrap">IMAGE_UNAVAILABLE</span>
                 </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
          </div>

          {/* Tactical Scan Overlay */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-cyan-500/10 backdrop-blur-[2px] pointer-events-none"
              >
                <div className="absolute inset-0 border-[20px] border-cyan-500/5 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-[scanline_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-4 bg-black/60 rounded-xl border border-cyan-500/40 flex flex-col items-center gap-2" style={{ transform: "translateZ(60px)" }}>
                     <Activity className="text-cyan-400 animate-pulse" size={24} />
                     <span className="text-[10px] font-orbitron text-cyan-400 tracking-[0.4em] uppercase font-bold">Analyzing_Vitals...</span>
                     <span className="text-[8px] font-mono text-cyan-600 uppercase">Stability: 98.4%</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Badges - Top Corners */}
          <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-40" style={{ transform: "translateZ(40px)" }}>
             <button 
               onClick={handleStatusClick}
               className="px-3 py-1.5 rounded-full bg-black/60 border border-cyan-500/30 backdrop-blur-md hover:bg-cyan-500/20 transition-all group/badge"
             >
               <span className="text-[8px] font-orbitron tracking-[0.2em] text-cyan-400 flex items-center gap-1.5 uppercase font-bold">
                 <Zap size={10} className="group-hover/badge:animate-bounce" /> {hero.origin_world}
               </span>
             </button>
             
             {hero.is_locked_content ? (
               <button 
                 onClick={handleLockClick}
                 className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md hover:bg-rose-500 hover:text-white transition-all group/lock"
               >
                 <Lock size={12} className="text-rose-500 group-hover/lock:text-white" />
               </button>
             ) : (
               <button 
                 onClick={handleStatusClick}
                 className="p-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md hover:bg-cyan-500 hover:text-black transition-all group/info"
               >
                 <Info size={12} className="text-cyan-500 group-hover/info:text-black" />
               </button>
             )}
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 z-10" style={{ transform: "translateZ(50px)" }}>
            <h3 className="text-2xl font-orbitron font-black text-white mb-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tighter leading-none">
              {hero.alias}
            </h3>
            <p className="text-[10px] text-neutral-500 font-orbitron uppercase tracking-widest mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{hero.name}</p>
            
            {/* Visual Decoration */}
            <div className="h-[2px] w-0 bg-cyan-500 transition-all duration-700 group-hover:w-full rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <div className="mt-2 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
               <span className="text-[7px] font-mono text-neutral-500 uppercase">ACCESS_KEY: {hero.id.substr(0, 8)}</span>
               <span className="text-[7px] font-mono text-cyan-500">STABLE_TIMELINE</span>
            </div>
          </div>

          {/* Holographic Scanline Overlay (Permanent) */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-[-100%] left-0 w-full h-[50%] bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-[scanner_4s_linear_infinite]" />
          </div>
        </motion.div>
      </Link>
      
      <style>{`
        @keyframes scanner {
          0% { top: -50%; }
          100% { top: 150%; }
        }
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default HeroCard;
