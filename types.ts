
export type ExerciseType = 'PUSH-UPS' | 'SQUATS' | 'PULL-UPS' | 'LUNGES' | 'BURPEES' | 'MUSCLE-UPS';

export enum Step {
  BOOT = 'BOOT',
  THE_GATE = 'THE_GATE',
  INTRO = 'INTRO',
  COMBAT_HISTORY = 'COMBAT_HISTORY',
  BIO_DATA = 'BIO_DATA',
  PROCESSING = 'PROCESSING',
  REALITY_CHECK = 'REALITY_CHECK',
  SYSTEM_ONBOARDING = 'SYSTEM_ONBOARDING',
  FOUNDERS_NOTE = 'FOUNDERS_NOTE',
  SHADOW_BIND = 'SHADOW_BIND',
  EGG_BATTLE = 'EGG_BATTLE',
  THE_CONTRACT = 'THE_CONTRACT',
  PLEDGE = 'PLEDGE',
  PAYWALL = 'PAYWALL',
  PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
  FINAL_GATE = 'FINAL_GATE',
  GAME_LOBBY = 'GAME_LOBBY',
  DUNGEON_RUN = 'DUNGEON_RUN',
}

export interface UserData {
  weakness: string | null;
  experience: 'ROOKIE' | 'VETERAN' | 'ACTIVE' | null;
  gender: 'M' | 'F' | null;
  age: number;
  height: number;
  weight: number;
  activityLevel: number; // 0-100
  shadowName: string;
  missionClass: 'STRENGTH' | 'HYPERTROPHY' | 'AGILITY' | null;
  nutrition: 'COOK' | 'RATIONS' | 'SCAVENGE' | null;
}

export interface PlayerStats {
  str: number;
  vit: number;
  agi: number;
  int: number;
  sen: number;
}

export interface DungeonRecord {
  id: string;
  name: string;
  date: string;
  reps: number;
  xp: number;
  iron: number;
}

export interface Item {
  id: string;
  name: string;
  // Expanded types for new accessory slots
  type: 'WEAPON' | 'HELMET' | 'CHEST' | 'SHOULDER' | 'LEGS' | 'SHOES' | 'RING' | 'CONSUMABLE' | 'MATERIAL' | 'BUFF' | 'STAT' | 'COSMETIC' | 'GLOVES' | 'ACCESSORY'; 
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  stats?: { [key: string]: number }; // e.g. { str: 2, vit: 1 }
  value: number; // Sell price or effect value
  icon: string;
  description?: string;
  obtainedAt?: string;
}

export interface PlayerProfile extends UserData {
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  level: number;
  currentXp: number;
  requiredXp: number;
  iron: number;
  crystals: number;
  stats: PlayerStats;
  currentHp: number;
  currentMana: number;
  streak: number;
  lastLogin: string;
  inventory: Item[];
  // Updated Equipped Structure for 8 Accessories + Weapon
  equipped: {
    weapon: Item | null;
    helmet: Item | null;
    chest: Item | null;
    shoulderL: Item | null;
    shoulderR: Item | null;
    legs: Item | null;
    shoes: Item | null;
    finger1: Item | null;
    finger2: Item | null;
    gloves: Item | null; // Keeping for legacy/compatibility if needed, or unused
    accessory: Item | null; // Keeping for legacy/compatibility
  };
  dailyQuestCompleted: boolean;
  vengeanceGauge: number; // 0, 1, or 2
  history: DungeonRecord[];
  unspentPoints: number;
}

export const INITIAL_USER_DATA: UserData = {
  weakness: null,
  experience: null,
  gender: 'M',
  age: 24,
  height: 175,
  weight: 75,
  activityLevel: 42,
  shadowName: '',
  missionClass: null,
  nutrition: null,
};

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  ...INITIAL_USER_DATA,
  rank: 'E',
  level: 1,
  currentXp: 0,
  requiredXp: 100,
  iron: 10000, // UPDATED: 10,000 Starting Iron
  crystals: 50, 
  stats: { str: 10, vit: 10, agi: 10, int: 10, sen: 10 },
  currentHp: 100, 
  currentMana: 100, 
  streak: 0,
  lastLogin: new Date().toISOString(),
  inventory: [],
  equipped: { 
      weapon: null, 
      helmet: null, 
      chest: null, 
      shoulderL: null, 
      shoulderR: null, 
      legs: null, 
      shoes: null, 
      finger1: null, 
      finger2: null,
      gloves: null,
      accessory: null
  },
  dailyQuestCompleted: false,
  vengeanceGauge: 0,
  history: [],
  unspentPoints: 5 
};
