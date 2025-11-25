import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { ApodResponse } from '../types';
import { IconSparkles, IconCalendar } from '../components/Icons';
import { CosmicChat } from '../components/CosmicChat';

export const Dashboard: React.FC = () => {
  const [todayApod, setTodayApod] = useState<ApodResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const fetchData = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await nasaService.getApod(date);
      setTodayApod(data);
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch APOD');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(e.target.value);
  };

  if (loading && !todayApod) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cosmos-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-cosmos-highlight animate-pulse">Contacting NASA servers...</p>
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md text-center border-red-500/30">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Houston, we have a problem</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => fetchData(selectedDate)}
            className="px-4 py-2 bg-cosmos-accent rounded-lg text-white hover:bg-indigo-500"
          >
            Retry Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6 relative overflow-hidden">
        
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
          <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
        
        {/* Main Content Area */}
        <div className={`lg:col-span-${showChat ? '8' : '12'} flex flex-col h-full transition-all duration-500`}>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
             <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white">
                    Astronomy Picture <span className="text-cosmos-highlight">of the Day</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Discover the cosmos, one day at a time.</p>
             </div>

             <div className="flex items-center gap-3">
                <div className="relative">
                    <input 
                        type="date" 
                        value={selectedDate}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        className="bg-space-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cosmos-accent cursor-pointer"
                    />
                    <IconCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <button 
                    onClick={() => setShowChat(!showChat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showChat 
                        ? 'bg-cosmos-accent text-white shadow-lg shadow-cosmos-accent/25' 
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <IconSparkles className="w-4 h-4" />
                    <span>{showChat ? 'Hide AI' : 'Ask AI'}</span>
                </button>
             </div>
          </div>

          {/* Featured Image Card */}
          <div className="flex-1 min-h-0 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-space-900/50">
             {todayApod && (
                 <>
                    {todayApod.media_type === 'image' ? (
                        <img 
                            src={todayApod.hdurl || todayApod.url} 
                            alt={todayApod.title}
                            className="w-full h-full object-contain bg-black"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                            <iframe
                                src={todayApod.url}
                                title={todayApod.title}
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}
                    
                    {/* Floating Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-8 backdrop-blur-[2px]">
                        <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">{todayApod.title}</h2>
                        <div className="text-gray-300 text-sm md:text-base max-w-3xl leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-pointer">
                            {todayApod.explanation}
                        </div>
                        {todayApod.copyright && (
                            <div className="mt-2 text-xs text-gray-500 font-medium">
                                © {todayApod.copyright}
                            </div>
                        )}
                    </div>
                 </>
             )}
          </div>

        </div>

        {/* Side Panel (Chat) */}
        {showChat && todayApod && (
            <div className="lg:col-span-4 h-full animate-in slide-in-from-right duration-500">
                <div className="h-full rounded-2xl overflow-hidden border border-white/10">
                    <CosmicChat 
                        apod={todayApod} 
                        onClose={() => setShowChat(false)} 
                    />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
