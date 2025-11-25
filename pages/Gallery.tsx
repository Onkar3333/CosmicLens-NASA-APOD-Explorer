import React, { useEffect, useState } from 'react';
import { nasaService } from '../services/nasaService';
import { ApodResponse } from '../types';
import { ApodCard } from '../components/ApodCard';
import { CosmicChat } from '../components/CosmicChat';
import { IconX } from '../components/Icons';

export const Gallery: React.FC = () => {
  const [apods, setApods] = useState<ApodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApod, setSelectedApod] = useState<ApodResponse | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDateObj = new Date();
        startDateObj.setDate(today.getDate() - 20); // Last 20 days
        const startDate = startDateObj.toISOString().split('T')[0];

        const data = await nasaService.getApodRange(startDate, endDate);
        setApods(data);
      } catch (e) {
        console.error("Failed to load gallery", e);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display font-bold text-3xl mb-8 text-white">Recent <span className="text-cosmos-highlight">Discoveries</span></h1>
        
        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {apods.map((item) => (
                <div key={item.date} className="h-80">
                    <ApodCard 
                        data={item} 
                        onClick={setSelectedApod} 
                        compact={true}
                    />
                </div>
            ))}
            </div>
        )}

        {/* Modal for Details */}
        {selectedApod && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-space-900 w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-white/10">
                    <button 
                        onClick={() => setSelectedApod(null)}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <IconX className="w-6 h-6" />
                    </button>

                    {/* Image Side */}
                    <div className="w-full md:w-2/3 h-1/2 md:h-full bg-black relative">
                         {selectedApod.media_type === 'image' ? (
                             <img 
                                src={selectedApod.hdurl || selectedApod.url} 
                                alt={selectedApod.title}
                                className="w-full h-full object-contain"
                             />
                         ) : (
                             <iframe 
                                src={selectedApod.url}
                                title={selectedApod.title}
                                className="w-full h-full"
                             />
                         )}
                    </div>

                    {/* Info Side with Chat */}
                    <div className="w-full md:w-1/3 h-1/2 md:h-full border-l border-white/10 flex flex-col">
                        <div className="p-6 overflow-y-auto flex-1 bg-space-950">
                            <span className="text-cosmos-highlight text-sm font-mono mb-2 block">{selectedApod.date}</span>
                            <h2 className="text-2xl font-bold text-white mb-4 font-display">{selectedApod.title}</h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                {selectedApod.explanation}
                            </p>
                            {selectedApod.copyright && (
                                <p className="mt-4 text-xs text-gray-500">Image Credit: {selectedApod.copyright}</p>
                            )}
                        </div>
                        
                        {/* Integrated Chat for this item */}
                        <div className="h-1/2 border-t border-white/10">
                            <CosmicChat apod={selectedApod} onClose={() => {}} />
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
