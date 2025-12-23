
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Search, Settings, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} />, path: '/', label: 'Home' },
    { icon: <Search size={20} />, path: '/search', label: 'Nexus' },
    { icon: <Shield size={20} />, path: '/admin', label: 'Admin' },
    { icon: <User size={20} />, path: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-8 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-orbitron uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
