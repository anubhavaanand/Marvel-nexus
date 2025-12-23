
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Hero, CanonEvent } from '../types';
import { INITIAL_HEROES, INITIAL_CANON_EVENTS } from '../constants';

interface NexusContextType {
  heroes: Hero[];
  canonEvents: CanonEvent[];
  unlockedHeroes: string[];
  unlockHero: (id: string) => void;
  isHeroUnlocked: (id: string) => boolean;
  addHero: (hero: Hero) => void;
  resetDatabase: () => void;
  loading: boolean;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [canonEvents, setCanonEvents] = useState<CanonEvent[]>(INITIAL_CANON_EVENTS);
  const [unlockedHeroes, setUnlockedHeroes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      try {
        const savedHeroes = localStorage.getItem('nexus_heroes');
        const savedUnlocked = localStorage.getItem('nexus_unlocked');

        if (savedHeroes) {
          setHeroes(JSON.parse(savedHeroes));
        } else {
          setHeroes(INITIAL_HEROES);
          localStorage.setItem('nexus_heroes', JSON.stringify(INITIAL_HEROES));
        }

        if (savedUnlocked) {
          setUnlockedHeroes(JSON.parse(savedUnlocked));
        }
      } catch (e) {
        console.error("Archive Corruption Detected. Purging...", e);
        localStorage.clear();
        setHeroes(INITIAL_HEROES);
      }
      setLoading(false);
    };
    init();
  }, []);

  const unlockHero = (id: string) => {
    setUnlockedHeroes(prev => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem('nexus_unlocked', JSON.stringify(updated));
      return updated;
    });
  };

  const isHeroUnlocked = (id: string) => unlockedHeroes.includes(id);

  const addHero = (newHero: Hero) => {
    setHeroes(prev => {
      const exists = prev.some(h => h.alias.toLowerCase() === newHero.alias.toLowerCase());
      if (exists) return prev;
      const updated = [newHero, ...prev];
      localStorage.setItem('nexus_heroes', JSON.stringify(updated));
      return updated;
    });
  };

  const resetDatabase = () => {
    localStorage.removeItem('nexus_heroes');
    localStorage.removeItem('nexus_unlocked');
    setHeroes(INITIAL_HEROES);
    setUnlockedHeroes([]);
  };

  return (
    <NexusContext.Provider value={{ 
      heroes, 
      canonEvents, 
      unlockedHeroes, 
      unlockHero, 
      isHeroUnlocked, 
      addHero,
      resetDatabase,
      loading 
    }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) throw new Error('useNexus must be used within a NexusProvider');
  return context;
};
