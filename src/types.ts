export type ComponentState = 'normal' | 'hovered' | 'pressed' | 'disabled';

export type GameMode = 'survival' | 'creative' | 'adventure' | 'hardcore';
export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface CraftmineWorld {
  id: string;
  name: string;
  mode: GameMode;
  difficulty: Difficulty;
  seed: string;
  daysActive: number;
  lastPlayed: string;
  sizeMb: number;
  playersOnline?: number;
  isFavorite?: boolean;
  thumbnail?: string;
  description?: string;
}

export interface Realm {
  id: string;
  name: string;
  description?: string;
  gameMode?: GameMode;
  maxPlayers?: number;
  onlineCount?: number;
  worlds?: CraftmineWorld[];
  icon?: string;
}

export interface UserSettings {
  autoPlay: boolean;
  subtitles: boolean;
  hdQuality: boolean;
  soundVolume: number;
  qualityOption: string;
  preferredCategory: string;
  themeMode: 'dark' | 'retro';
  notifications: boolean;
  searchQuery: string;
  disablePanorama?: boolean;
  lockPanoramaScroll?: boolean;
  panoramaScrollSpeed?: number;
  reduceMotion?: boolean;
}
