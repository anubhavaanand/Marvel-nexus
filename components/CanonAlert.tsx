
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CanonAlertProps {
  description: string;
  movieTitle?: string;
}

const CanonAlert: React.FC<CanonAlertProps> = ({ description, movieTitle }) => {
  return (
    <div className="relative overflow-hidden bg-rose-900/20 border border-rose-500/30 p-4 rounded-lg backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-rose-500/50 animate-pulse" />
      
      <div className="flex items-start gap-4">
        <div className="bg-rose-500 p-2 rounded animate-pulse">
          <AlertTriangle size={18} className="text-white" />
        </div>
        <div>
          <h4 className="font-orbitron text-xs font-bold text-rose-500 tracking-[0.2em] uppercase mb-1">
            CANON EVENT DETECTED
          </h4>
          <p className="text-sm text-neutral-200 leading-relaxed italic">
            "{description}"
          </p>
          {movieTitle && (
            <p className="text-[10px] font-orbitron text-rose-400/70 mt-2 tracking-widest uppercase">
              Origin: {movieTitle}
            </p>
          )}
        </div>
      </div>

      {/* Decorative Glitch Elements */}
      <div className="absolute bottom-1 right-2 text-[8px] font-mono text-rose-500 opacity-30 select-none">
        ERR: ABSOLUTE_POINT_NULL
      </div>
    </div>
  );
};

export default CanonAlert;
