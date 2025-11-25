import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Gallery } from './pages/Gallery';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen text-slate-100 font-sans selection:bg-cosmos-accent selection:text-white">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
