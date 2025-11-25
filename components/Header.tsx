import React, { useState, useEffect } from 'react';
import { IconSettings, IconCalendar, IconImage, IconX } from './Icons';
import { Link, useLocation } from 'react-router-dom';
import { STORAGE_KEYS } from '../constants';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();

  // Settings State
  const [nasaKey, setNasaKey] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load keys
    setNasaKey(localStorage.getItem(STORAGE_KEYS.NASA_API_KEY) || '');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const saveSettings = () => {
    if (nasaKey) localStorage.setItem(STORAGE_KEYS.NASA_API_KEY, nasaKey);
    else localStorage.removeItem(STORAGE_KEYS.NASA_API_KEY);

    setShowSettings(false);
    window.location.reload(); // Simple reload to apply new service config
  };

  const navLinkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
    ${location.pathname === path 
      ? 'bg-cosmos-accent/10 text-cosmos-highlight border border-cosmos-accent/20' 
      : 'text-gray-400 hover:text-white hover:bg-white/5'}
  `;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`glass-panel rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'shadow-xl shadow-black/20' : ''}`}>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cosmos-accent to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden md:block">
                Cosmic<span className="text-cosmos-highlight">Lens</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <Link to="/" className={navLinkClass('/')}>
                <IconCalendar className="w-4 h-4" />
                <span>Today</span>
              </Link>
              <Link to="/gallery" className={navLinkClass('/gallery')}>
                <IconImage className="w-4 h-4" />
                <span>Gallery</span>
              </Link>
            </nav>

            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <IconSettings className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-space-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-xl">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">NASA API Key</label>
                <input 
                  type="password" 
                  value={nasaKey}
                  onChange={(e) => setNasaKey(e.target.value)}
                  placeholder="Leave empty for DEMO mode"
                  className="w-full bg-space-950 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-cosmos-accent focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Get one at api.nasa.gov</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={saveSettings}
                className="px-4 py-2 rounded-lg text-sm bg-cosmos-accent text-white font-medium hover:bg-indigo-500 shadow-lg shadow-cosmos-accent/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};