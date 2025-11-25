import React, { useState, useEffect, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { ApodResponse, ChatMessage } from '../types';
import { IconSend, IconX, IconSparkles } from './Icons';
import { GenerateContentResponse } from "@google/genai";

interface CosmicChatProps {
  apod: ApodResponse;
  onClose: () => void;
}

export const CosmicChat: React.FC<CosmicChatProps> = ({ apod, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: `Hello! I'm Cosmos. I can explain this image of "${apod.title}" or answer any astronomy questions you have.`,
        timestamp: Date.now()
      }
    ]);
  }, [apod]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Prepare history for API
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      
      const streamResult = await geminiService.chatStream(history, userMsg.text, apod);
      
      // Create placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      
      for await (const chunk of streamResult) {
         const c = chunk as GenerateContentResponse;
         if (c.text) {
             fullText += c.text;
             setMessages(prev => prev.map(m => 
                 m.id === aiMsgId ? { ...m, text: fullText } : m
             ));
         }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to Cosmos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-space-900 border-l border-white/10 shadow-2xl w-full md:w-96">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-space-950/50 backdrop-blur-md">
        <div className="flex items-center gap-2 text-cosmos-highlight">
          <IconSparkles className="w-5 h-5 animate-pulse-slow" />
          <h2 className="font-display font-bold text-lg">Cosmic AI</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <IconX className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cosmos-accent text-white rounded-tr-sm' 
                  : 'bg-space-800 text-gray-200 border border-white/5 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="bg-space-800 p-3 rounded-2xl rounded-tl-sm border border-white/5">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                 </div>
            </div>
        )}
        {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 text-xs">
                {error}
                <div className="mt-1 opacity-70">Check settings to ensure API Key is valid.</div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-space-950/30">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this image..."
            className="w-full bg-space-950 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent transition-all placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cosmos-accent text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
