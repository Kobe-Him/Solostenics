
import { PlayerProfile, INITIAL_PLAYER_PROFILE, UserData, Item, PlayerStats } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'SOLOSTENICS_SAVE_V1';

export interface WheelReward {
  id: string;
  label: string;
  type: 'CURRENCY' | 'ITEM' | 'STAT' | 'BUFF';
  tier: 'COMMON' | 'UNCOMMON' | 'RARE' | 'MYTHIC';
  value: number;
  icon: string;
  description: string;
}

export const WHEEL_LOOT_TABLE: WheelReward[] = [
  { id: 'iron_s', label: 'Iron Cache', type: 'CURRENCY', tier: 'COMMON', value: 75, icon: 'toll', description: '+75 Iron' },
  { id: 'xp_s', label: 'XP Shard', type: 'CURRENCY', tier: 'COMMON', value: 50, icon: 'auto_awesome', description: '+50 XP' },
  { id: 'pot_s', label: 'Minor Potion', type: 'ITEM', tier: 'COMMON', value: 25, icon: 'local_drink', description: 'Restores 25 HP' },
  { id: 'mana_s', label: 'Mana Vial', type: 'ITEM', tier: 'COMMON', value: 20, icon: 'water_drop', description: 'Restores 20 Mana' },
  { id: 'gear_c', label: 'Gear Crate', type: 'ITEM', tier: 'UNCOMMON', value: 1, icon: 'backpack', description: 'Common Equipment' },
  { id: 'shadow_t', label: 'Shadow Treat', type: 'BUFF', tier: 'UNCOMMON', value: 1, icon: 'pets', description: '+10% XP Next Run' },
  { id: 'pot_l', label: 'Full Potion', type: 'ITEM', tier: 'RARE', value: 100, icon: 'vaccines', description: 'Full HP Restore' },
  { id: 'iron_l', label: 'Large Iron', type: 'CURRENCY', tier: 'RARE', value: 200, icon: 'monetization_on', description: '+200 Iron' },
  { id: 'stat_p', label: 'Stat Fragment', type: 'STAT', tier: 'MYTHIC', value: 1, icon: 'stars', description: '+1 Permanent Stat Point' },
  { id: 'gear_r', label: 'Rare Crate', type: 'ITEM', tier: 'MYTHIC', value: 1, icon: 'diamond', description: 'Rare Equipment' },
];

export const GameService = {
  // --- CORE DATA MANAGEMENT ---
  
  saveGame: async (profile: PlayerProfile): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Local Save Failed", e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .upsert({ 
              id: user.id, 
              game_data: profile,
              updated_at: new Date().toISOString()
            });
          if (error) throw error;
        }
      } catch (e) {
        console.warn("Cloud Save Failed (Offline?)", e);
      }
    }
  },

  loadGame: async (): Promise<PlayerProfile | null> => {
    let profile: PlayerProfile | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('game_data')
            .eq('id', user.id)
            .single();
          
          if (data && data.game_data) {
            profile = data.game_data;
          }
        }
      } catch (e) {
        console.warn("Cloud Load Failed, falling back to local", e);
      }
    }

    if (!profile) {
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          if (data) {
             profile = JSON.parse(data);
          }
        } catch (e) {
          console.error("Local Load Failed", e);
        }
    }

    if (profile) {
         const today = new Date().toDateString();
         const lastLoginDate = new Date(profile.lastLogin).toDateString();
         if (today !== lastLoginDate) {
             profile.dailyQuestCompleted = false;
         }
         profile.lastLogin = new Date().toISOString();

         if ((profile as any).unspentPoints === undefined) profile.unspentPoints = 0;
         if (profile.currentHp === undefined) profile.currentHp = (profile.stats.vit * 10) * 0.5;
         if (profile.currentMana === undefined) profile.currentMana = (profile.stats.int * 10) * 0.5;
         
         // Migration for new slots
         if (!profile.equipped.helmet) {
             profile.equipped = {
                 ...profile.equipped,
                 helmet: null, chest: null, shoulderL: null, shoulderR: null,
                 legs: null, shoes: null, finger1: null, finger2: null
             };
         }
    }

    return profile;
  },

  createAccount: async (userData: UserData): Promise<PlayerProfile> => {
    const newProfile: PlayerProfile = {
      ...INITIAL_PLAYER_PROFILE,
      ...userData,
      lastLogin: new Date().toISOString()
    };
    await GameService.saveGame(newProfile);
    return newProfile;
  },

  resetGame: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
  },

  completeDungeon: async (profile: PlayerProfile, result: { reps: number, damageDealt: number, difficulty: number, dungeonName: string }): Promise<PlayerProfile> => {
    const newProfile = { ...profile };
    
    const xpBase = result.reps * 2 * result.difficulty;
    const ironBase = result.reps * 1.5 * result.difficulty;
    
    let multiplier = 1;
    if (newProfile.vengeanceGauge >= 2) {
      multiplier = 1.5;
      newProfile.vengeanceGauge = 0;
    } else {
      newProfile.vengeanceGauge = Math.min(2, newProfile.vengeanceGauge + 1);
    }
    
    const xpEarned = Math.floor(xpBase * multiplier);
    const ironEarned = Math.floor(ironBase * multiplier);
    
    newProfile.currentXp += xpEarned;
    newProfile.iron += ironEarned;
    newProfile.dailyQuestCompleted = true;
    newProfile.streak = (newProfile.streak || 0) + 1;

    if (newProfile.currentXp >= newProfile.requiredXp) {
      newProfile.level += 1;
      newProfile.currentXp -= newProfile.requiredXp;
      newProfile.requiredXp = Math.floor(newProfile.requiredXp * 1.5);
      newProfile.unspentPoints = (newProfile.unspentPoints || 0) + 3;
      newProfile.currentHp = (newProfile.stats.vit * 10);
      newProfile.currentMana = (newProfile.stats.int * 10);
    }

    newProfile.history.push({
      id: Date.now().toString(),
      name: result.dungeonName,
      date: new Date().toISOString(),
      reps: result.reps,
      xp: xpEarned,
      iron: ironEarned
    });

    await GameService.saveGame(newProfile);
    return newProfile;
  },

  equipItem: async (profile: PlayerProfile, inventoryIndex: number, targetSlot?: string): Promise<PlayerProfile> => {
    const newProfile = { ...profile };
    const itemToEquip = newProfile.inventory[inventoryIndex];
    
    // Determine Slot
    let slot = targetSlot;
    
    if (!slot) {
        // Auto-detect based on type if not provided (fallback)
        const type = itemToEquip.type;
        if (type === 'WEAPON') slot = 'weapon';
        else if (type === 'HELMET') slot = 'helmet';
        else if (type === 'CHEST') slot = 'chest';
        else if (type === 'LEGS') slot = 'legs';
        else if (type === 'SHOES') slot = 'shoes';
        else if (type === 'SHOULDER') slot = 'shoulderL'; // Default
        else if (type === 'RING') slot = 'finger1'; // Default
        else if (type === 'GLOVES') slot = 'gloves';
        else if (type === 'ACCESSORY') slot = 'accessory';
    }

    if (!slot || !(slot in newProfile.equipped)) return profile;

    const slotKey = slot as keyof typeof newProfile.equipped;
    const currentlyEquipped = newProfile.equipped[slotKey];

    // Remove from inventory
    newProfile.inventory.splice(inventoryIndex, 1);
    
    // Return current item to inventory
    if (currentlyEquipped) {
      newProfile.inventory.push(currentlyEquipped);
    }
    
    // Equip new item
    newProfile.equipped[slotKey] = itemToEquip;

    await GameService.saveGame(newProfile);
    return newProfile;
  },

  unequipItem: async (profile: PlayerProfile, slotKey: string): Promise<PlayerProfile> => {
    const newProfile = { ...profile };
    const key = slotKey as keyof typeof newProfile.equipped;
    const item = newProfile.equipped[key];

    if (item) {
      newProfile.equipped[key] = null;
      newProfile.inventory.push(item);
      await GameService.saveGame(newProfile);
    }
    return newProfile;
  },

  useItem: async (profile: PlayerProfile, inventoryIndex: number): Promise<{ success: boolean, newProfile: PlayerProfile, message?: string }> => {
    const newProfile = { ...profile };
    const item = newProfile.inventory[inventoryIndex];
    
    if (item.type !== 'CONSUMABLE' && item.type !== 'BUFF') {
      return { success: false, newProfile: profile, message: 'Not usable' };
    }

    const maxHp = newProfile.stats.vit * 10;
    const maxMana = newProfile.stats.int * 10;

    if (item.id.includes('pot')) {
      const heal = item.value || 25;
      newProfile.currentHp = Math.min(maxHp, (newProfile.currentHp || 0) + heal);
    } else if (item.id.includes('mana')) {
      const mana = item.value || 20;
      newProfile.currentMana = Math.min(maxMana, (newProfile.currentMana || 0) + mana);
    }

    newProfile.inventory.splice(inventoryIndex, 1);
    await GameService.saveGame(newProfile);
    return { success: true, newProfile };
  },

  calculateTotalStats: (profile: PlayerProfile): PlayerStats => {
    const stats = { ...profile.stats };
    const equippedItems = Object.values(profile.equipped);
    
    equippedItems.forEach(item => {
      if (item && item.stats) {
        Object.entries(item.stats).forEach(([key, val]) => {
          if (key in stats) {
            stats[key as keyof PlayerStats] += val;
          }
        });
      }
    });
    return stats;
  },

  purchaseItem: async (profile: PlayerProfile, item: any): Promise<{ success: boolean, newProfile?: PlayerProfile, message?: string }> => {
    if (profile.iron < item.cost && item.currency === 'IRON') return { success: false, message: 'Not enough Iron' };
    if (profile.crystals < item.cost && item.currency === 'CRYSTALS') return { success: false, message: 'Not enough Crystals' };

    const newProfile = { ...profile };
    
    // Deduct Currency
    if (item.currency === 'IRON') newProfile.iron -= item.cost;
    else newProfile.crystals -= item.cost;

    const newItem: Item = {
      id: item.name.toLowerCase().replace(' ', '_') + '_' + Date.now(),
      name: item.name,
      type: item.type,
      rarity: item.rarity,
      value: item.cost,
      icon: item.icon,
      description: item.desc,
      stats: item.stats
    };

    newProfile.inventory.push(newItem);
    await GameService.saveGame(newProfile);
    return { success: true, newProfile };
  },

  allocatePoint: async (profile: PlayerProfile, stat: keyof PlayerStats): Promise<PlayerProfile> => {
    if ((profile.unspentPoints || 0) <= 0) return profile;
    const newProfile = { ...profile };
    newProfile.stats[stat] += 1;
    newProfile.unspentPoints -= 1;
    
    if (stat === 'vit') newProfile.currentHp = newProfile.stats.vit * 10;
    if (stat === 'int') newProfile.currentMana = newProfile.stats.int * 10;

    await GameService.saveGame(newProfile);
    return newProfile;
  },

  batchAllocateStats: async (profile: PlayerProfile, newStats: PlayerStats, newUnspent: number): Promise<PlayerProfile> => {
      const newProfile = { ...profile };
      newProfile.stats = { ...newStats };
      newProfile.unspentPoints = newUnspent;

      // Update max vitals based on new stats
      newProfile.currentHp = newProfile.stats.vit * 10;
      newProfile.currentMana = newProfile.stats.int * 10;

      await GameService.saveGame(newProfile);
      return newProfile;
  },

  spinWheel: async (profile: PlayerProfile): Promise<{ newProfile: PlayerProfile, reward: WheelReward }> => {
    const reward = WHEEL_LOOT_TABLE[Math.floor(Math.random() * WHEEL_LOOT_TABLE.length)];
    const newProfile = { ...profile, lastSpinTime: Date.now() };

    if (reward.type === 'CURRENCY') {
      if (reward.id.includes('iron')) newProfile.iron += reward.value;
    } 

    if (reward.type === 'ITEM' || reward.type === 'STAT' || reward.type === 'BUFF') {
      const item: Item = {
         id: reward.id + '_' + Date.now(),
         name: reward.label,
         type: reward.type === 'STAT' ? 'STAT' : (reward.type === 'BUFF' ? 'BUFF' : 'CONSUMABLE'),
         rarity: reward.tier as any,
         value: 0,
         icon: reward.icon,
         description: reward.description
      };
      newProfile.inventory.push(item);
    }

    await GameService.saveGame(newProfile);
    return { newProfile, reward };
  },

  performSystemSync: async (profile: PlayerProfile): Promise<PlayerProfile> => {
    const newProfile = { ...profile };
    newProfile.dailyQuestCompleted = true;
    newProfile.currentMana = Math.min(newProfile.stats.int * 10, (newProfile.currentMana || 0) + 10);
    await GameService.saveGame(newProfile);
    return newProfile;
  },

  performCampfire: async (profile: PlayerProfile, bonusExp: number = 0): Promise<PlayerProfile> => {
    const newProfile = { ...profile };
    newProfile.dailyQuestCompleted = true;
    newProfile.currentHp = newProfile.stats.vit * 10;
    newProfile.currentMana = newProfile.stats.int * 10;
    
    if (bonusExp > 0) {
        newProfile.currentXp += bonusExp;
        if (newProfile.currentXp >= newProfile.requiredXp) {
            newProfile.level += 1;
            newProfile.currentXp -= newProfile.requiredXp;
            newProfile.requiredXp = Math.floor(newProfile.requiredXp * 1.5);
            newProfile.unspentPoints = (newProfile.unspentPoints || 0) + 3;
        }
    }
    
    await GameService.saveGame(newProfile);
    return newProfile;
  }
};
