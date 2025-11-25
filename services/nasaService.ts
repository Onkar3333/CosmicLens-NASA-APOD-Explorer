import { ApodResponse, CacheEntry } from '../types';
import { NASA_API_BASE, STORAGE_KEYS, DEMO_KEY, CACHE_DURATION_MS } from '../constants';

/**
 * Service Layer mimicking a backend component.
 * Features:
 * - Centralized Fetching
 * - LocalStorage Caching (Persisted)
 * - Error Handling
 */
class NasaService {
  private getApiKey(): string {
    return localStorage.getItem(STORAGE_KEYS.NASA_API_KEY) || DEMO_KEY;
  }

  private getCacheKey(date: string): string {
    return `${STORAGE_KEYS.CACHE_PREFIX}${date}`;
  }

  /**
   * Fetches a single APOD for a specific date.
   * Checks cache first.
   */
  async getApod(date: string): Promise<ApodResponse> {
    const cacheKey = this.getCacheKey(date);
    const cachedRaw = localStorage.getItem(cacheKey);

    if (cachedRaw) {
      try {
        const entry: CacheEntry = JSON.parse(cachedRaw);
        const now = Date.now();
        if (now - entry.timestamp < CACHE_DURATION_MS) {
          console.log(`[NasaService] Cache hit for ${date}`);
          return entry.data;
        } else {
          console.log(`[NasaService] Cache expired for ${date}`);
          localStorage.removeItem(cacheKey);
        }
      } catch (e) {
        console.error('Cache parse error', e);
        localStorage.removeItem(cacheKey);
      }
    }

    console.log(`[NasaService] Fetching from API for ${date}`);
    const apiKey = this.getApiKey();
    const url = `${NASA_API_BASE}?api_key=${apiKey}&date=${date}`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || errorData.error?.message || `API Error: ${response.status}`);
    }

    const data: ApodResponse = await response.json();
    
    // Cache the successful response
    const cacheEntry: CacheEntry = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

    return data;
  }

  /**
   * Fetches a range of APODs.
   * Note: The NASA API supports `start_date` and `end_date`.
   * However, to ensure we cache individual days effectively for the "Web Service" requirement,
   * we process the array and cache individual items.
   */
  async getApodRange(startDate: string, endDate: string): Promise<ApodResponse[]> {
    const apiKey = this.getApiKey();
    const url = `${NASA_API_BASE}?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

    console.log(`[NasaService] Fetching range ${startDate} to ${endDate}`);
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || errorData.error?.message || `API Error: ${response.status}`);
    }

    const data: ApodResponse[] = await response.json();

    // Cache each item individually
    data.forEach(item => {
      if (item.date) {
        const cacheKey = this.getCacheKey(item.date);
        const cacheEntry: CacheEntry = {
          timestamp: Date.now(),
          data: item
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      }
    });

    return data.reverse(); // Newest first
  }

  /**
   * Get random APODs
   */
  async getRandomApods(count: number = 5): Promise<ApodResponse[]> {
    const apiKey = this.getApiKey();
    const url = `${NASA_API_BASE}?api_key=${apiKey}&count=${count}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch random APODs`);
    }

    const data: ApodResponse[] = await response.json();
    return data;
  }
}

export const nasaService = new NasaService();
