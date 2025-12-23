
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={18} />, path: '/', label: 'Home' },
    { icon: <Search size={18} />, path: '/search', label: 'Nexus' },
    { icon: <Shield size={18} />, path: '/admin', label: 'Admin' },
    { icon: <User size={18} />, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 px-4 md:px-0 pointer-events-none">
      <div className="glass-panel mx-auto max-w-sm md:max-w-md px-6 py-2.5 rounded-full flex items-center justify-around border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
                isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {item.icon}
              <span className="text-[9px] font-orbitron uppercase tracking-widest hidden sm:inline-block">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_rgba(6,182,212,1)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
