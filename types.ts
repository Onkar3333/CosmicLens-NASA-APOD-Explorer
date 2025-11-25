export interface ApodResponse {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface CacheEntry {
  timestamp: number;
  data: ApodResponse;
}

export interface NasaConfig {
  apiKey: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
