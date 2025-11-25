export const NASA_API_BASE = 'https://api.nasa.gov/planetary/apod';
export const STORAGE_KEYS = {
  NASA_API_KEY: 'cosmic_lens_nasa_key',
  GEMINI_API_KEY: 'cosmic_lens_gemini_key',
  CACHE_PREFIX: 'cosmic_lens_cache_',
  THEME: 'cosmic_lens_theme',
};

// Fallback key for demo purposes (Rate limited)
export const DEMO_KEY = 'DEMO_KEY'; 

export const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
