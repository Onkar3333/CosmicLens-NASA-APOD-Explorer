import React from 'react';
import { ApodResponse } from '../types';
import { IconMaximize, IconCalendar } from './Icons';

interface ApodCardProps {
  data: ApodResponse;
  onClick: (data: ApodResponse) => void;
  compact?: boolean;
}

export const ApodCard: React.FC<ApodCardProps> = ({ data, onClick, compact = false }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-space-card backdrop-blur-sm transition-all duration-300 hover:border-cosmos-accent/50 hover:shadow-lg hover:shadow-cosmos-accent/10 cursor-pointer h-full"
      onClick={() => onClick(data)}
    >
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-video'} overflow-hidden`}>
        {data.media_type === 'image' ? (
          <img 
            src={data.url} 
            alt={data.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-space-950">
            <iframe 
              src={data.url} 
              title={data.title}
              className="h-full w-full pointer-events-none" // pointer-events-none so the click goes to the card
              frameBorder="0"
            />
            <div className="absolute inset-0 z-10 bg-transparent" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10">
            <IconMaximize className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="flex items-center gap-2 text-xs text-cosmos-highlight mb-1">
             <IconCalendar className="w-3 h-3" />
             <span>{data.date}</span>
          </div>
          <h3 className={`font-display font-bold text-white leading-tight ${compact ? 'text-lg line-clamp-2' : 'text-xl'}`}>
            {data.title}
          </h3>
          {!compact && (
            <p className="mt-2 text-sm text-gray-300 line-clamp-2">
              {data.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
