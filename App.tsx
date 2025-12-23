
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HeroDetail from './pages/HeroDetail';

const App: React.FC = () => {
  return (
    <Router>
      {/* Background Decor */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-900/10 blur-[120px] rounded-full" />
        {/* Grid lines background overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero/:id" element={<HeroDetail />} />
          <Route path="/admin" element={<div className="p-20 text-center font-orbitron">ADMIN_ACCESS_PENDING...</div>} />
          <Route path="/search" element={<div className="p-20 text-center font-orbitron">NEXUS_SCAN_IN_PROGRESS...</div>} />
          <Route path="/profile" element={<div className="p-20 text-center font-orbitron">USER_LOG_INITIATED...</div>} />
        </Routes>
      </main>

      <Navbar />
    </Router>
  );
};

export default App;
