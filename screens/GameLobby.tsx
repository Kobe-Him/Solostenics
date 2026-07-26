
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step, PlayerProfile, DungeonRecord, Item, PlayerStats } from '../types';
import { GameService, WHEEL_LOOT_TABLE, WheelReward } from '../services/GameService';
import CyberButton from '../components/ui/CyberButton';
import { Haptics } from '../services/Haptics';

type ModalType = 'GEAR' | 'SHOP' | 'SKILLS' | 'TRIBUTE' | 'STATS' | 'DUNGEONS' | 'PROGRESSION' | 'GUILDS' | 'ROULETTE' | 'CAMPFIRE' | 'DAILY_OPTIONS' | 'HISTORY' | 'BATTLE_PASS' | null;

interface GameLobbyProps {
  onNavigate?: (step: Step) => void;
  onUpdateProfile?: (profile: PlayerProfile) => void;
  onSelectExercise?: (exercise: string) => void;
  profile: PlayerProfile;
}

// --- AUDIO SYSTEM ---
const playUiSound = (type: 'CLICK' | 'CONFIRM' | 'ERROR' | 'OPEN' | 'TICK' | 'CHIME') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;

    if (type === 'CLICK') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'CONFIRM') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'ERROR') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'OPEN') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    } else if (type === 'TICK') {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
    } else if (type === 'CHIME') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);
    }
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const NavButton = ({ icon, label, onClick, hologram }: { icon: string, label: string, onClick: () => void, hologram?: boolean }) => (
  <button 
    onClick={() => { playUiSound('CLICK'); onClick(); }} 
    className="flex flex-col items-center justify-center gap-1 group relative py-3 flex-1 active:bg-white/5 transition-colors rounded-lg"
  >
     {hologram && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-t from-primary/20 to-transparent blur-xl pointer-events-none rounded-full"></div>
     )}
     <div className={`relative z-10 transition-transform duration-300 group-hover:-translate-y-1`}>
        <span className={`material-symbols-outlined text-3xl md:text-4xl ${hologram ? 'text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]' : 'text-gray-400 group-hover:text-white'}`}>
           {icon}
        </span>
     </div>
     <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${hologram ? 'text-primary' : 'text-gray-500 group-hover:text-white'}`}>
        {label}
     </span>
  </button>
);

interface ModalWrapperProps {
  children?: React.ReactNode;
  onClose: () => void;
}

const ModalWrapper = ({ children, onClose }: ModalWrapperProps) => (
   <motion.div 
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
   >
      <div className="absolute inset-0" onClick={() => { playUiSound('CLICK'); onClose(); }}></div>
      <motion.div 
         initial={{ scale: 0.9, y: 50, opacity: 0 }}
         animate={{ scale: 1, y: 0, opacity: 1 }}
         exit={{ scale: 0.9, y: 50, opacity: 0 }}
         transition={{ type: "spring", damping: 25, stiffness: 300 }}
         className="relative z-10 w-full max-w-md bg-[#050505] border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden flex flex-col max-h-[85vh] h-full"
      >
         {/* Close Button */}
         <button onClick={() => { playUiSound('CLICK'); onClose(); }} className="absolute top-4 right-4 text-white/50 hover:text-white z-20 bg-black/50 rounded-full p-1 transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
         </button>
         
         {/* Content Container */}
         <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {children}
         </div>

         {/* Decorative Corners */}
         <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary pointer-events-none"></div>
         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary pointer-events-none"></div>
      </motion.div>
   </motion.div>
);

const VengeanceGauge = ({ value }: { value: number }) => {
   const isFull = value >= 2;
   
   return (
      <div className={`
         relative flex flex-col items-start gap-1 p-5 border-2 rounded-sm transition-all duration-500 overflow-hidden group
         ${isFull 
            ? 'border-purple-400 bg-purple-900/30 shadow-[0_0_40px_rgba(168,85,247,0.5)]' 
            : 'border-purple-800/50 bg-[#0a0a0a] shadow-[0_0_15px_rgba(88,28,135,0.3)]'}
      `}>
         {/* Background Elements */}
         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_10s_linear_infinite] pointer-events-none"></div>
         {isFull && <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>}
         
         {/* Header Label */}
         <div className="flex justify-between w-full relative z-10 items-end mb-2">
            <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-xl ${isFull ? 'text-white animate-[spin_3s_linear_infinite]' : 'text-purple-500'}`}>bolt</span>
                <span className={`text-sm font-display font-black tracking-[0.25em] uppercase italic ${isFull ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-purple-500'}`}>
                    Vengeance
                </span>
            </div>
            <span className={`text-xl font-display font-black italic ${isFull ? 'text-white drop-shadow-[0_0_10px_white]' : 'text-purple-700'}`}>
               {value} / 2
            </span>
         </div>

         {/* The Bars */}
         <div className="flex gap-1 w-full h-6 relative z-10"> {/* Taller Bars */}
            {/* Bar 1 */}
            <div className="flex-1 h-full bg-black/80 border border-purple-500/30 skew-x-[-15deg] overflow-hidden relative">
               <motion.div 
                  className={`h-full w-full ${value >= 1 ? 'bg-[#a855f7] shadow-[0_0_20px_#a855f7]' : 'opacity-0'}`}
                  initial={{ x: '-100%' }}
                  animate={{ x: value >= 1 ? '0%' : '-100%' }}
                  transition={{ type: 'spring', stiffness: 100 }}
               >
                   {/* Internal Shine */}
                   <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
               </motion.div>
            </div>

            {/* Bar 2 */}
            <div className="flex-1 h-full bg-black/80 border border-purple-500/30 skew-x-[-15deg] overflow-hidden relative">
               <motion.div 
                  className={`h-full w-full ${value >= 2 ? 'bg-gradient-to-r from-[#d946ef] to-[#a855f7] shadow-[0_0_30px_#d946ef]' : 'opacity-0'}`}
                  initial={{ x: '-100%' }}
                  animate={{ x: value >= 2 ? '0%' : '-100%' }}
                  transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
               >
                   <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
                   {value >= 2 && (
                       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] animate-[shimmer_1s_infinite]"></div>
                   )}
               </motion.div>
            </div>
         </div>

         {/* Flavor Text */}
         <div className="relative z-10 w-full mt-2 flex justify-between items-center">
             <div className="h-px bg-purple-500/30 flex-1 mr-4"></div>
             <p className={`text-[9px] font-mono font-bold tracking-wider uppercase ${isFull ? 'text-white animate-pulse drop-shadow-[0_0_5px_#d946ef]' : 'text-purple-700'}`}>
                {isFull ? "MAXIMUM POWER // OVERDRIVE" : "CHARGE TO UNLEASH"}
             </p>
         </div>
      </div>
   );
};

// ==========================================
// VIEWS
// ==========================================

const HologramBody = () => (
    <div className="w-full h-full relative flex items-center justify-center opacity-80">
        <svg viewBox="0 0 400 600" className="w-full h-full drop-shadow-[0_0_15px_#00FFFF]">
            <defs>
                <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {/* Hexagon Head */}
            <polygon points="200,50 230,70 230,110 200,130 170,110 170,70" fill="none" stroke="#00FFFF" strokeWidth="2" />
            <circle cx="200" cy="90" r="10" fill="url(#cyberGradient)" />
            {/* Neck */}
            <line x1="200" y1="130" x2="200" y2="160" stroke="#00FFFF" strokeWidth="2" />
            {/* Shoulders */}
            <polyline points="100,180 150,160 250,160 300,180" fill="none" stroke="#00FFFF" strokeWidth="2" />
            {/* Torso Core */}
            <polygon points="150,160 250,160 220,300 180,300" fill="url(#cyberGradient)" stroke="#00FFFF" strokeWidth="2" />
            {/* Spine */}
            <line x1="200" y1="160" x2="200" y2="300" stroke="#00FFFF" strokeWidth="1" strokeDasharray="5 5" />
            {/* Arms Left */}
            <polyline points="100,180 70,280 50,380" fill="none" stroke="#00FFFF" strokeWidth="2" />
            <circle cx="70" cy="280" r="6" fill="#00FFFF" />
            {/* Arms Right */}
            <polyline points="300,180 330,280 350,380" fill="none" stroke="#00FFFF" strokeWidth="2" />
            <circle cx="330" cy="280" r="6" fill="#00FFFF" />
            {/* Hips */}
            <polygon points="180,300 220,300 240,340 160,340" fill="none" stroke="#00FFFF" strokeWidth="2" />
            {/* Legs Left */}
            <polyline points="160,340 140,460 120,580" fill="none" stroke="#00FFFF" strokeWidth="2" />
            <circle cx="140" cy="460" r="8" fill="#00FFFF" />
            {/* Legs Right */}
            <polyline points="240,340 260,460 280,580" fill="none" stroke="#00FFFF" strokeWidth="2" />
            <circle cx="260" cy="460" r="8" fill="#00FFFF" />
            
            {/* Decorative Scanning Rings */}
            <circle cx="200" cy="230" r="150" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.3" strokeDasharray="10 20" />
            <circle cx="200" cy="230" r="250" fill="none" stroke="#00FFFF" strokeWidth="0.5" opacity="0.1" />
        </svg>
    </div>
);

type EquipmentSlot = 'weapon' | 'helmet' | 'chest' | 'shoulderL' | 'shoulderR' | 'legs' | 'shoes' | 'finger1' | 'finger2';

const GearView = ({ profile, onUpdateProfile, onClose, initialTab = 'BODY' }: { profile: PlayerProfile, onUpdateProfile: (p: PlayerProfile) => void, onClose?: () => void, initialTab?: 'BODY' | 'BAG' }) => {
   const [activeTab, setActiveTab] = useState<'BODY' | 'BAG'>(initialTab);
   const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);

   const getRarityColor = (rarity?: string) => {
       switch(rarity) {
           case 'COMMON': return '#ffffff';
           case 'UNCOMMON': return '#22c55e';
           case 'RARE': return '#3b82f6';
           case 'EPIC': return '#a855f7';
           case 'LEGENDARY': return '#eab308';
           case 'MYTHIC': return '#ef4444';
           default: return '#00FFFF';
       }
   };

   // --- ACTIONS ---
   const handleEquip = async (item: Item) => {
       if (!selectedSlot) return;
       playUiSound('CONFIRM');
       const index = profile.inventory.indexOf(item);
       if (index > -1) {
           const newProfile = await GameService.equipItem(profile, index, selectedSlot);
           onUpdateProfile(newProfile);
           setSelectedSlot(null);
       }
   };

   const handleUnequip = async (slot: EquipmentSlot) => {
       playUiSound('CLICK');
       const newProfile = await GameService.unequipItem(profile, slot);
       onUpdateProfile(newProfile);
       setSelectedSlot(null);
   };

   const handleUse = async (item: Item) => {
       playUiSound('CLICK');
       const index = profile.inventory.indexOf(item);
       const result = await GameService.useItem(profile, index);
       if (result.success) {
           playUiSound('CONFIRM');
           onUpdateProfile(result.newProfile);
       } else {
           playUiSound('ERROR');
       }
   };

   const getCompatibleItems = (slot: EquipmentSlot): Item[] => {
       let targetType = '';
       if (slot === 'weapon') targetType = 'WEAPON';
       else if (slot === 'helmet') targetType = 'HELMET';
       else if (slot === 'chest') targetType = 'CHEST';
       else if (slot === 'shoulderL' || slot === 'shoulderR') targetType = 'SHOULDER';
       else if (slot === 'legs') targetType = 'LEGS';
       else if (slot === 'shoes') targetType = 'SHOES';
       else if (slot === 'finger1' || slot === 'finger2') targetType = 'RING';
       
       return profile.inventory.filter(item => item.type === targetType);
   };

   const slotItems = selectedSlot ? getCompatibleItems(selectedSlot) : [];

   // --- HELPER RENDER NODE ---
   const renderNode = (slot: EquipmentSlot, defaultIcon: string, label: string) => {
        const item = profile.equipped[slot];
        const isEquipped = !!item;
        const rarityColor = isEquipped ? getRarityColor(item.rarity) : '#333';
        
        return (
            <div className="flex flex-col items-center group relative">
                <button 
                    onClick={() => { playUiSound('CLICK'); setSelectedSlot(slot); }} 
                    className={`
                        w-14 h-14 bg-black/80 flex items-center justify-center transition-all duration-300 relative
                        ${isEquipped ? 'border-2' : 'border border-dashed border-gray-600 hover:border-white/50 hover:bg-white/10'}
                        ${selectedSlot === slot ? 'scale-110 shadow-[0_0_15px_white]' : ''}
                    `}
                    style={{ borderColor: isEquipped ? rarityColor : undefined }}
                >
                    <span 
                        className={`material-symbols-outlined text-2xl ${isEquipped ? 'text-white' : 'text-gray-500'}`}
                        style={{ color: isEquipped ? rarityColor : undefined }}
                    >
                        {isEquipped ? item.icon : defaultIcon}
                    </span>
                    {/* Level Badge if equipped */}
                    {isEquipped && (
                        <div className="absolute -bottom-2 -right-2 bg-black border text-[8px] font-mono px-1 font-bold shadow-md" style={{ borderColor: rarityColor, color: rarityColor }}>
                            Lvl.1
                        </div>
                    )}
                </button>
                {/* Always show name underneath for blocky style */}
                <span className="font-mono text-[8px] text-gray-500 mt-2 uppercase font-bold tracking-widest text-center w-full truncate px-1">
                    {isEquipped ? item.name : label}
                </span>
            </div>
        );
   }

   return (
       <div className="h-full flex flex-col relative bg-[#050505]">
           {/* CLOSE BUTTON */}
           {onClose && (
               <button onClick={() => { playUiSound('CLICK'); onClose(); }} className="absolute top-4 right-4 z-50 p-2 bg-black border border-white/20 text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all cursor-pointer">
                   <span className="material-symbols-outlined font-bold">close</span>
               </button>
           )}

           {/* TOP TOGGLE */}
           <div className="z-30 p-4 pb-2 flex justify-center w-full bg-gradient-to-b from-[#050505] via-[#050505] to-transparent shrink-0">
                <div className="flex bg-black border border-primary/30 p-1 rounded-full relative shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute top-1 bottom-1 bg-primary/20 rounded-full border border-primary/50"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ 
                            width: 'calc(50% - 4px)',
                            left: activeTab === 'BODY' ? '4px' : '50%'
                        }}
                    />
                    <button 
                        onClick={() => { playUiSound('CLICK'); setActiveTab('BODY'); setSelectedSlot(null); }}
                        className={`relative z-10 w-32 py-2 font-mono text-[10px] font-bold tracking-widest transition-colors ${activeTab === 'BODY' ? 'text-white' : 'text-gray-500'}`}
                    >
                        CHARACTER
                    </button>
                    <button 
                        onClick={() => { playUiSound('CLICK'); setActiveTab('BAG'); setSelectedSlot(null); }}
                        className={`relative z-10 w-32 py-2 font-mono text-[10px] font-bold tracking-widest transition-colors ${activeTab === 'BAG' ? 'text-white' : 'text-gray-500'}`}
                    >
                        INVENTORY
                    </button>
                </div>
           </div>

           {/* CONTENT AREA */}
           <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'BODY' ? (
                        <motion.div 
                            key="body"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="h-full flex flex-col pt-10 px-4"
                        >
                            {/* DESTINY STYLE GRID LAYOUT */}
                            <div className="flex justify-between items-center w-full h-[60%]">
                                {/* LEFT SLOTS */}
                                <div className="flex flex-col gap-6 items-center">
                                    {renderNode('helmet', 'skull', 'Helmet')}
                                    {renderNode('chest', 'security', 'Chest')}
                                    {renderNode('shoulderL', 'shield', 'Arms')}
                                </div>
                                
                                {/* CENTER AVATAR PLACEHOLDER */}
                                <div className="flex-1 h-full mx-4 flex flex-col items-center justify-center relative">
                                    {/* Stats overlay */}
                                    <div className="absolute top-0 right-0 text-right">
                                        <div className="flex items-center gap-1 justify-end">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">stars</span>
                                            <span className="font-display font-black text-3xl text-yellow-500 italic leading-none">{profile.level * 10}</span>
                                        </div>
                                        <p className="font-mono text-[8px] text-gray-500 tracking-widest uppercase">POWER LEVEL</p>
                                    </div>

                                    {/* Blocky Avatar Graphic with Connector Lines */}
                                    <div className="w-full h-full max-w-[250px] flex flex-col items-center justify-center overflow-visible relative">
                                        <svg width="100%" height="100%" viewBox="0 0 200 300" className="absolute inset-0 pointer-events-none">
                                            {/* Connecting Lines */}
                                            {/* Left side: Helmet, Chest, Arms */}
                                            <line x1="100" y1="50" x2="20" y2="50" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            <line x1="100" y1="120" x2="20" y2="120" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            <line x1="60" y1="150" x2="20" y2="190" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            
                                            {/* Right side: Weapon, Legs, Class */}
                                            <line x1="140" y1="150" x2="180" y2="50" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            <line x1="100" y1="200" x2="180" y2="120" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            <line x1="100" y1="250" x2="180" y2="190" stroke="#00FFFF" strokeWidth="1" strokeDasharray="4 2" opacity="0.4"/>
                                            
                                            {/* Blocky Figure */}
                                            {/* Head */}
                                            <rect x="80" y="30" width="40" height="40" fill="#2d3748" stroke="#718096" strokeWidth="2" />
                                            {/* Torso */}
                                            <rect x="70" y="80" width="60" height="90" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
                                            {/* Left Arm */}
                                            <rect x="40" y="80" width="20" height="80" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
                                            {/* Right Arm */}
                                            <rect x="140" y="80" width="20" height="80" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
                                            {/* Left Leg */}
                                            <rect x="75" y="180" width="20" height="90" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
                                            {/* Right Leg */}
                                            <rect x="105" y="180" width="20" height="90" fill="#1a202c" stroke="#4a5568" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                {/* RIGHT SLOTS */}
                                <div className="flex flex-col gap-6 items-center">
                                    {renderNode('weapon', 'swords', 'Weapon')}
                                    {renderNode('legs', 'directions_run', 'Legs')}
                                    {renderNode('shoes', 'do_not_step', 'Class')}
                                </div>
                            </div>

                            {/* SELECTION DRAWER */}
                            {selectedSlot && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/20 p-4 h-[40%] overflow-y-auto z-40 shadow-[0_-10px_30px_rgba(0,0,0,1)]"
                                >
                                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                        <h3 className="font-display font-bold text-lg text-white uppercase">{selectedSlot} Inventory</h3>
                                        <button onClick={() => setSelectedSlot(null)} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                                    </div>
                                    
                                    {slotItems.length === 0 ? (
                                        <p className="text-gray-500 font-mono text-xs text-center mt-8">No compatible items found.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {slotItems.map((item, i) => {
                                                const rarityColor = getRarityColor(item.rarity);
                                                return (
                                                    <div key={i} className="flex items-center gap-3 bg-white/5 border p-2 hover:bg-white/10 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                                        <div className="w-10 h-10 bg-black border flex items-center justify-center shrink-0" style={{ borderColor: rarityColor, color: rarityColor }}>
                                                            <span className="material-symbols-outlined">{item.icon}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-white text-xs truncate uppercase" style={{ color: rarityColor }}>{item.name}</h4>
                                                            <p className="text-[9px] font-mono text-gray-400">{item.description}</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleEquip(item)}
                                                            className="px-4 py-2 bg-black border border-white/30 text-[10px] font-bold text-white hover:bg-white hover:text-black transition-colors"
                                                        >
                                                            EQUIP
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        /* INVENTORY LIST VIEW */
                        <motion.div 
                            key="bag"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 p-4 overflow-y-auto no-scrollbar pb-20"
                        >
                            {profile.inventory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-50">
                                    <span className="material-symbols-outlined text-6xl mb-4">backpack</span>
                                    <p className="font-mono text-xs uppercase tracking-widest">Inventory Empty</p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {profile.inventory.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 p-3 hover:border-primary/50 transition-all group">
                                            <div className="w-12 h-12 flex items-center justify-center bg-black border border-white/10 group-hover:border-primary/30" style={{ color: getRarityColor(item.rarity) }}>
                                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-sm truncate" style={{ color: getRarityColor(item.rarity) }}>{item.name}</h4>
                                                <p className="font-mono text-[9px] text-gray-500 uppercase">{item.rarity} {item.type}</p>
                                                {item.stats && <p className="font-mono text-[9px] text-primary mt-0.5">{Object.entries(item.stats).map(([k,v]) => `${k}+${v}`).join(' ')}</p>}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {['CONSUMABLE', 'BUFF'].includes(item.type) ? (
                                                    <button onClick={() => handleUse(item)} className="px-3 py-1 bg-white/5 border border-white/20 text-[9px] font-bold text-white hover:bg-white hover:text-black">USE</button>
                                                ) : (
                                                    <div className="text-[9px] text-gray-500 font-mono">USE LOADOUT TAB</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {!spinning && !result && (
                    <button
                        onClick={handleSpin}
                        disabled={!!timeLeft}
                        className="w-full mt-4 py-4 bg-[#39ff14] border-4 border-black rounded-xl text-black font-display font-black text-4xl shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[4px_8px_0_#000] active:translate-y-1 active:shadow-[0px_0px_0_#000] transition-all disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_#000]"
                    >
                        {timeLeft ? `SPIN : ${timeLeft}` : 'SPIN !'}
                    </button>
                )}
           </div>
       </div>
   );
};

const ShopView = ({ profile, onPurchase, onClose }: { profile: PlayerProfile, onPurchase: (item: any) => void, onClose?: () => void }) => {
    const [confirmItem, setConfirmItem] = useState<any>(null);
    const [justBought, setJustBought] = useState<string | null>(null);

    // EXPANDED SHOP TO COVER ALL 9 SLOTS + CONSUMABLES
    const SHOP_ITEMS = [
        // 1. Weapon
        { name: "Iron Dagger", cost: 100, currency: 'IRON' as const, type: 'WEAPON', rarity: 'COMMON', icon: 'swords', description: "Sharp enough. +1 STR", stats: { str: 1 } },
        { name: "Shadow Blade", cost: 2500, currency: 'IRON' as const, type: 'WEAPON', rarity: 'RARE', icon: 'colorize', description: "Vibrates with power. +5 AGI", stats: { agi: 5 } },
        // 2. Helmet
        { name: "Recruit Helm", cost: 150, currency: 'IRON' as const, type: 'HELMET', rarity: 'COMMON', icon: 'skull', description: "Standard Issue. +2 VIT", stats: { vit: 2 } },
        { name: "Tactical Visor", cost: 800, currency: 'IRON' as const, type: 'HELMET', rarity: 'UNCOMMON', icon: 'visibility', description: "Scanner Enhanced. +3 INT", stats: { int: 3 } },
        // 3. Chest
        { name: "Leather Vest", cost: 200, currency: 'IRON' as const, type: 'CHEST', rarity: 'COMMON', icon: 'security', description: "Light protection. +3 VIT", stats: { vit: 3 } },
        { name: "Plated Mail", cost: 1000, currency: 'IRON' as const, type: 'CHEST', rarity: 'RARE', icon: 'shield', description: "Heavy Defense. +8 VIT", stats: { vit: 8 } },
        // 4. Shoulder L
        { name: "Left Pad", cost: 75, currency: 'IRON' as const, type: 'SHOULDER', rarity: 'COMMON', icon: 'shield', description: "Left Guard. +1 VIT", stats: { vit: 1 } },
        // 5. Shoulder R
        { name: "Right Pad", cost: 75, currency: 'IRON' as const, type: 'SHOULDER', rarity: 'COMMON', icon: 'shield', description: "Right Guard. +1 VIT", stats: { vit: 1 } },
        // 6. Finger 1
        { name: "Bronze Ring", cost: 500, currency: 'IRON' as const, type: 'RING', rarity: 'UNCOMMON', icon: 'diamond', description: "+2 STR", stats: { str: 2 } },
        // 7. Finger 2
        { name: "Silver Band", cost: 500, currency: 'IRON' as const, type: 'RING', rarity: 'UNCOMMON', icon: 'diamond', description: "+2 INT", stats: { int: 2 } },
        { name: "Gold Ring", cost: 1200, currency: 'IRON' as const, type: 'RING', rarity: 'RARE', icon: 'diamond', description: "+4 STR", stats: { str: 4 } },
        // 8. Legs
        { name: "Canvas Pants", cost: 120, currency: 'IRON' as const, type: 'LEGS', rarity: 'COMMON', icon: 'accessibility_new', description: "Flexible. +1 AGI", stats: { agi: 1 } },
        { name: "Exo-Legs", cost: 1500, currency: 'IRON' as const, type: 'LEGS', rarity: 'EPIC', icon: 'directions_run', description: "Hydraulic assist. +5 STR", stats: { str: 5 } },
        // 9. Shoes
        { name: "Running Shoes", cost: 100, currency: 'IRON' as const, type: 'SHOES', rarity: 'COMMON', icon: 'do_not_step', description: "Good grip. +2 AGI", stats: { agi: 2 } },
        { name: "Combat Boots", cost: 600, currency: 'IRON' as const, type: 'SHOES', rarity: 'UNCOMMON', icon: 'do_not_step', description: "Heavy tread. +3 VIT", stats: { vit: 3 } },
        // Consumables
        { name: "Recovery Pot", cost: 50, currency: 'IRON' as const, type: 'CONSUMABLE', rarity: 'COMMON', icon: 'local_drink', description: "Restores 50 HP." },
        { name: "XP Booster", cost: 10, currency: 'CRYSTALS' as const, type: 'BUFF', rarity: 'RARE', icon: 'rocket_launch', description: "+50% XP for 1 Run." },
    ];

    const getRarityColor = (rarity?: string) => {
        switch(rarity) {
            case 'UNCOMMON': return '#22c55e';
            case 'RARE': return '#3b82f6';
            case 'EPIC': return '#a855f7';
            case 'LEGENDARY': return '#eab308';
            default: return '#ffffff';
        }
    };

    const confirmBuy = async () => {
        if (!confirmItem) return;
        playUiSound('CLICK');
        const res = await GameService.purchaseItem(profile, confirmItem);
        if (res.success) {
            playUiSound('CONFIRM');
            onPurchase(confirmItem); 
            setJustBought(`+1 ${confirmItem.name}`);
            setConfirmItem(null);
            setTimeout(() => setJustBought(null), 2000);
        } else {
            playUiSound('ERROR');
            alert(res.message);
            setConfirmItem(null);
        }
    };

    return (
       <div className="h-full flex flex-col relative bg-[#050505]">
          {onClose && (
              <button onClick={() => { playUiSound('CLICK'); onClose(); }} className="absolute top-4 right-4 z-50 p-2 bg-black border border-white/20 text-gray-400 hover:text-white hover:border-red-500 hover:bg-red-500/20 transition-all cursor-pointer">
                  <span className="material-symbols-outlined font-bold">close</span>
              </button>
          )}

          {/* CONFIRMATION POPUP */}
          <AnimatePresence>
              {confirmItem && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                      <div className="bg-[#111] border border-white/20 p-6 max-w-sm w-full text-center shadow-[0_0_30px_rgba(0,0,0,1)]">
                          <h3 className="font-display font-bold text-xl text-white mb-4">Confirm Purchase</h3>
                          <div className="w-16 h-16 mx-auto bg-black border mb-4 flex items-center justify-center" style={{ borderColor: getRarityColor(confirmItem.rarity), color: getRarityColor(confirmItem.rarity) }}>
                              <span className="material-symbols-outlined text-3xl">{confirmItem.icon}</span>
                          </div>
                          <p className="font-bold text-white uppercase text-lg mb-2" style={{ color: getRarityColor(confirmItem.rarity) }}>{confirmItem.name}</p>
                          <p className="font-mono text-gray-400 text-sm mb-6">Cost: {confirmItem.cost} {confirmItem.currency}</p>
                          <div className="flex gap-4">
                              <button onClick={() => setConfirmItem(null)} className="flex-1 py-3 bg-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-colors border border-white/20">Cancel</button>
                              <button onClick={confirmBuy} className="flex-1 py-3 bg-primary text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Confirm</button>
                          </div>
                      </div>
                  </motion.div>
              )}
              {justBought && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-20 left-1/2 -translate-x-1/2 bg-green-500/90 text-black px-6 py-3 font-display font-black text-xl italic uppercase shadow-[0_0_20px_rgba(34,197,94,0.5)] z-50 border border-green-300">
                      {justBought}
                  </motion.div>
              )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-4 pt-4 px-4">
             <h2 className="font-display font-bold text-2xl text-white">SUPPLY DEPOT</h2>
             <div className="flex gap-4 text-sm font-mono font-bold mr-12">
                 <span className="text-white bg-white/10 px-3 py-1 rounded shadow-inner">{profile.iron} IRON</span>
                 <span className="text-blue-400 bg-blue-900/30 px-3 py-1 rounded shadow-inner">{profile.crystals} CRYS</span>
             </div>
          </div>
          <div className="space-y-3 overflow-y-auto no-scrollbar pb-4 px-4">
              {SHOP_ITEMS.map((item, i) => {
                  const rarityColor = getRarityColor(item.rarity);
                  return (
                      <div key={i} className="flex flex-col bg-[#0a0a0a] border border-white/10 p-3 hover:border-white/30 transition-all relative overflow-hidden group" style={{ borderLeftColor: rarityColor, borderLeftWidth: '3px' }}>
                          <div className="flex items-center gap-4 relative z-10">
                              <div className="w-12 h-12 flex items-center justify-center bg-black border border-white/10 text-2xl shadow-inner" style={{ color: rarityColor }}>
                                  <span className="material-symbols-outlined">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-sm uppercase" style={{ color: rarityColor }}>{item.name}</h4>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 border ${item.currency === 'IRON' ? 'border-gray-500 text-gray-400 bg-black' : 'border-blue-500 text-blue-400 bg-blue-900/30'}`}>
                                          {item.cost} {item.currency === 'IRON' ? 'I' : 'C'}
                                      </span>
                                  </div>
                                  <p className="font-mono text-[10px] text-gray-500 leading-tight mt-1">{item.description}</p>
                                  {item.stats && <p className="font-mono text-[9px] text-primary mt-1">{Object.entries(item.stats).map(([k,v]) => `${k.toUpperCase()}+${v}`).join(' ')}</p>}
                              </div>
                          </div>
                          <button 
                              onClick={() => { playUiSound('CLICK'); setConfirmItem(item); }}
                              className="mt-3 w-full py-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                          >
                              PURCHASE
                          </button>
                      </div>
                  );
              })}
          </div>
       </div>
    );
};

const DungeonView = ({ onEnter, profile, onSelectExercise }: { onEnter?: () => void, profile: PlayerProfile, onSelectExercise?: (ex: string) => void }) => {
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [mapPos, setMapPos] = useState({ x: -250, y: -250 });
   const STEP = 120;

   const moveMap = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      playUiSound('CLICK');
      setMapPos(prev => {
         let newX = prev.x;
         let newY = prev.y;
         if (dir === 'UP') newY += STEP;
         if (dir === 'DOWN') newY -= STEP;
         if (dir === 'LEFT') newX += STEP;
         if (dir === 'RIGHT') newX -= STEP;
         return { x: newX, y: newY };
      });
   };

   // DYNAMIC STATUS BASED ON LEVEL
   const getStatus = (reqLvl: number) => profile.level >= reqLvl ? 'OPEN' : 'LOCKED';

   const DUNGEONS = [
      { id: 'E-1', name: 'SLIME BASIN', exercise: 'PUSH-UPS', gem: 'TOPAZ', lvl: '1-5', reqLvl: 1, x: 250, y: 250, color: 'yellow', icon: 'square' },
      { id: 'E-2', name: 'EMBER PITS', exercise: 'PUSH-UPS', gem: 'RUBY', lvl: '5-10', reqLvl: 5, x: 450, y: 150, color: 'red', icon: 'diamond' },
      { id: 'D-1', name: 'MISTY LAGOON', exercise: 'PUSH-UPS', gem: 'SAPPHIRE', lvl: '11-20', reqLvl: 11, x: 650, y: 450, color: 'blue', icon: 'water_drop' },
      { id: 'C-1', name: 'JUNGLE RUINS', exercise: 'PUSH-UPS', gem: 'EMERALD', lvl: '21-30', reqLvl: 21, x: 150, y: 650, color: 'emerald', icon: 'hexagon' },
      { id: 'B-1', name: 'VOID RIFT', exercise: 'PUSH-UPS', gem: 'AMETHYST', lvl: '31-40', reqLvl: 31, x: 800, y: 300, color: 'purple', icon: 'star' },
      { id: 'A-1', name: 'SKY CITADEL', exercise: 'PUSH-UPS', gem: 'ALL', lvl: '50+', reqLvl: 50, x: 500, y: 850, color: 'white', icon: 'crown' },
   ].map(d => ({ ...d, status: getStatus(d.reqLvl) }));

   const getStyles = (color: string, isLocked: boolean) => {
      if (isLocked) return 'border-gray-600 text-gray-600 shadow-none grayscale';
      const map: Record<string, string> = {
         yellow: 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]',
         red: 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
         blue: 'border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
         emerald: 'border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
         purple: 'border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
         white: 'border-white text-white shadow-[0_0_20px_white]',
      };
      return map[color] || 'border-white text-white';
   };

   const getBgGlow = (color: string) => {
       const map: Record<string, string> = {
           yellow: 'bg-yellow-500', red: 'bg-red-500', blue: 'bg-blue-500', emerald: 'bg-emerald-500', purple: 'bg-purple-500', white: 'bg-white'
       };
       return map[color] || 'bg-white';
   };

   const selectedDungeon = DUNGEONS.find(d => d.id === selectedId);

   return (
      <div className="flex flex-col h-full relative">
         <div className="flex justify-between items-end border-b border-primary/20 pb-2 mb-4 relative z-20">
            <h2 className="font-display font-bold text-2xl text-white">WORLD MAP</h2>
            <div className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full shadow-[0_0_5px_#00FFFF]"></span>
               <span className="font-mono text-[10px] text-primary tracking-widest">LIVE_FEED</span>
            </div>
         </div>

         <div className="flex-1 relative bg-black border border-primary/30 rounded-sm overflow-hidden group shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] perspective-[1000px]">
             <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_3px]"></div>
             <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>

             <motion.div 
               className="absolute left-1/2 top-1/2 w-[1000px] h-[1000px] bg-[#0a0a0a]"
               animate={{ x: mapPos.x, y: mapPos.y, rotateX: 20, scale: 1 }}
               transition={{ type: "spring", mass: 0.5, stiffness: 80, damping: 15 }} 
               style={{ transformOrigin: 'center center', transformStyle: 'preserve-3d', marginLeft: -500, marginTop: -500 }}
             >
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>
                <div className="absolute inset-0 opacity-70 pointer-events-none mix-blend-screen">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" className="w-full h-full object-cover filter brightness-0 invert opacity-100" alt="world_map" />
                </div>
                <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 border border-primary/10 rounded-full animate-pulse pointer-events-none"></div>

                {DUNGEONS.map((d) => (
                   <button
                      key={d.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedId(d.id); playUiSound('CONFIRM'); }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group/marker z-30 outline-none"
                      style={{ left: d.x, top: d.y }}
                   >
                      {d.status === 'OPEN' && (
                          <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${getBgGlow(d.color)}`}></div>
                      )}
                      <div className={`relative w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-300 ${selectedId === d.id ? 'scale-125 border-white text-white shadow-[0_0_25px_white] z-40' : getStyles(d.color, d.status === 'LOCKED')}`}>
                         <span className="material-symbols-outlined text-sm md:text-lg">{d.status === 'LOCKED' ? 'lock' : d.icon}</span>
                      </div>
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 transition-all duration-300 pointer-events-none ${selectedId === d.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                         <div className="bg-black/90 border border-primary/30 px-3 py-1 text-[8px] font-mono text-white whitespace-nowrap shadow-lg">{d.name}</div>
                         <div className="w-px h-3 bg-primary/30 absolute left-1/2 -top-3 -translate-x-1/2"></div>
                      </div>
                   </button>
                ))}
             </motion.div>

             <div className="absolute inset-4 z-40 pointer-events-none flex flex-col justify-between items-center">
                 <button onClick={() => moveMap('UP')} className="pointer-events-auto w-12 h-8 bg-black/50 border border-primary/20 hover:bg-primary/20 hover:border-primary text-primary/50 hover:text-primary transition-all flex items-center justify-center backdrop-blur-sm active:scale-95"><span className="material-symbols-outlined">keyboard_arrow_up</span></button>
                 <div className="w-full flex justify-between items-center px-0">
                    <button onClick={() => moveMap('LEFT')} className="pointer-events-auto w-8 h-12 bg-black/50 border border-primary/20 hover:bg-primary/20 hover:border-primary text-primary/50 hover:text-primary transition-all flex items-center justify-center backdrop-blur-sm active:scale-95"><span className="material-symbols-outlined">keyboard_arrow_left</span></button>
                    <button onClick={() => moveMap('RIGHT')} className="pointer-events-auto w-8 h-12 bg-black/50 border border-primary/20 hover:bg-primary/20 hover:border-primary text-primary/50 hover:text-primary transition-all flex items-center justify-center backdrop-blur-sm active:scale-95"><span className="material-symbols-outlined">keyboard_arrow_right</span></button>
                 </div>
                 <button onClick={() => moveMap('DOWN')} className="pointer-events-auto w-12 h-8 bg-black/50 border border-primary/20 hover:bg-primary/20 hover:border-primary text-primary/50 hover:text-primary transition-all flex items-center justify-center backdrop-blur-sm active:scale-95"><span className="material-symbols-outlined">keyboard_arrow_down</span></button>
             </div>
             <div className="absolute bottom-3 right-3 z-30 font-mono text-[8px] text-primary/40 bg-black/40 px-2 py-1 border border-white/5 backdrop-blur-md pointer-events-none">POS: {Math.round(mapPos.x)}, {Math.round(mapPos.y)}</div>
         </div>

         <AnimatePresence>
            {selectedDungeon && (
                <motion.div 
                   initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-primary/50 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50"
                >
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-display font-bold text-xl text-white leading-none">{selectedDungeon.name}</h3>
                                <span className={`text-[8px] px-1 font-mono border ${selectedDungeon.gem === 'RUBY' ? 'border-red-500 text-red-500' : 'border-primary text-primary'}`}>{selectedDungeon.gem}</span>
                              </div>
                              <p className="font-mono text-[10px] text-primary/70 uppercase tracking-wider">REC. LVL {selectedDungeon.lvl} • {selectedDungeon.exercise}</p>
                           </div>
                           <button onClick={() => { playUiSound('CLICK'); setSelectedId(null); }} className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                        <div className="flex gap-2 mb-2">
                           <div className="bg-white/5 border border-white/10 px-2 py-1 text-[9px] font-mono text-gray-300">3 BATTLES</div>
                           <div className="bg-white/5 border border-white/10 px-2 py-1 text-[9px] font-mono text-gray-300">BOSS: ELITE</div>
                        </div>
                        <button 
                          onClick={() => { 
                             if(selectedDungeon.status === 'OPEN' && onEnter) { 
                                playUiSound('CONFIRM'); 
                                if (onSelectExercise) onSelectExercise(selectedDungeon.exercise);
                                onEnter(); 
                             } else { 
                                playUiSound('ERROR'); 
                             } 
                          }}
                          className={`w-full py-3 font-display font-bold text-lg uppercase tracking-widest border transition-all ${selectedDungeon.status === 'OPEN' ? 'bg-primary text-black border-primary hover:bg-white hover:border-white shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'bg-transparent text-gray-600 border-gray-800 cursor-not-allowed'}`}
                        >
                           {selectedDungeon.status === 'OPEN' ? 'ENTER GATE' : 'LOCKED'}
                        </button>
                    </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

const InventoryView = ({ profile, onUpdateProfile }: { profile: PlayerProfile, onUpdateProfile: (p: PlayerProfile) => void }) => {
   const handleUse = async (index: number) => {
       playUiSound('CLICK');
       if (profile.inventory[index].type === 'COSMETIC') {
           // just Equip logic if needed, for now just alert
           alert("Equipped!");
           return;
       }
       const result = await GameService.useItem(profile, index);
       if (result.success) {
           playUiSound('CONFIRM');
           if (onUpdateProfile) onUpdateProfile(result.newProfile);
       } else {
           playUiSound('ERROR');
       }
   };

   return (
      <div className="h-full flex flex-col">
         <div className="flex justify-between items-center mb-4 border-b border-primary/20 pb-2">
            <h2 className="font-display font-bold text-2xl text-white">INVENTORY</h2>
            <span className="font-mono text-xs text-primary">{profile.inventory.length}/20</span>
         </div>
         {profile.inventory.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                 <span className="material-symbols-outlined text-4xl mb-2 opacity-50">backpack</span>
                 <p className="font-mono text-xs uppercase tracking-widest">Inventory Empty</p>
             </div>
         ) : (
             <div className="grid grid-cols-1 gap-2 overflow-y-auto no-scrollbar pb-4">
                 {profile.inventory.map((item, i) => (
                     <div key={i} className="flex items-center gap-3 bg-[#0a0a0a] border border-white/10 p-3 group hover:border-primary/50 transition-all">
                         <div className="w-10 h-10 flex items-center justify-center bg-black border border-white/10 text-xl">
                             <span className="material-symbols-outlined text-white">{item.icon || 'circle'}</span>
                         </div>
                         <div className="flex-1 min-w-0">
                             <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                             <p className="font-mono text-[9px] text-gray-500 uppercase">{item.rarity} {item.type}</p>
                         </div>
                         <button 
                             onClick={() => handleUse(i)}
                             className="px-3 py-1 text-[10px] font-bold border border-white/20 hover:bg-white hover:text-black transition-colors uppercase"
                         >
                             USE
                         </button>
                     </div>
                 ))}
             </div>
         )}
      </div>
   );
};

const SkillsView = () => {
    const progressions = [
        {
            title: 'Push Progression',
            active: true,
            nodes: [
                { name: 'WALL PUSH-UPS', status: 'COMPLETED', color: 'bg-primary border-primary shadow-[0_0_15px_rgba(0,255,255,0.4)]', icon: 'check_circle', text: 'text-black' },
                { name: 'INCLINE PUSH-UPS', status: 'COMPLETED', color: 'bg-primary border-primary shadow-[0_0_15px_rgba(0,255,255,0.4)]', icon: 'check_circle', text: 'text-black' },
                { name: 'KNEE PUSH-UPS', status: 'ACTIVE', color: 'bg-yellow-500 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse', icon: 'play_arrow', text: 'text-black' },
                { name: 'STANDARD PUSH-UPS', status: 'LOCKED', color: 'bg-black border-gray-700', icon: 'lock', text: 'text-gray-500' },
                { name: 'ONE-ARM PUSH-UPS', status: 'S-TIER', color: 'bg-black border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.3)]', icon: 'star', text: 'text-purple-400' }
            ]
        },
        { title: 'Pull Progression', active: false },
        { title: 'Core Progression', active: false },
        { title: 'Leg Progression', active: false },
        { title: 'Cardio Progression', active: false }
    ];

    return (
        <div className="h-full flex flex-col p-6 bg-[#050505] overflow-y-auto no-scrollbar gap-8 pb-20">
            {progressions.map((prog, idx) => (
                <div key={idx} className="flex flex-col">
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4 border-b border-primary/20 pb-2 flex justify-between items-end">
                        <span>{prog.title}</span>
                        {!prog.active && <span className="text-[10px] text-gray-500 bg-gray-900 px-2 py-1 rounded">COMING SOON</span>}
                    </h2>
                    
                    {prog.active ? (
                        <div className="flex-1 flex gap-4 overflow-x-auto no-scrollbar pb-8 items-center relative min-h-[200px]">
                            {/* The Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-[1000px] h-1 bg-gray-800 -translate-y-1/2 z-0">
                                <div className="h-full w-[40%] bg-primary shadow-[0_0_10px_cyan]"></div>
                            </div>

                            {prog.nodes?.map((node, i) => (
                                <div key={i} className={`relative z-10 flex flex-col items-center justify-center p-4 min-w-[160px] h-[160px] rounded-md border-2 ${node.color} shrink-0`}>
                                    <span className={`material-symbols-outlined text-4xl mb-2 ${node.text}`}>{node.icon}</span>
                                    <h4 className={`font-bold uppercase text-center text-sm leading-tight ${node.text}`}>{node.name}</h4>
                                    <p className={`font-mono text-[10px] mt-2 font-bold tracking-widest ${node.text} opacity-80`}>{node.status}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-[120px] border border-dashed border-gray-800 flex items-center justify-center bg-white/5 rounded-md">
                            <p className="font-mono text-gray-600 text-xs tracking-widest uppercase">
                                <span className="material-symbols-outlined text-sm align-middle mr-2">construction</span>
                                IN DEVELOPMENT
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const TributeView = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-yellow-500 mb-4 animate-pulse">volunteer_activism</span>
        <h2 className="text-2xl font-display font-bold text-white uppercase">Support the System</h2>
        <p className="font-mono text-xs text-gray-400 mt-2 max-w-[250px] mb-6">Donate $1 to unlock the Permanent OG Supporter Badge and keep the servers running.</p>
        <button onClick={() => playUiSound('CONFIRM')} className="bg-yellow-500 text-black font-bold px-6 py-3 uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.4)]">
             Donate $1
        </button>
    </div>
);

const BattlePassView = () => {
    const TIERS = [1, 2, 3, 4, 5, 6, 7];
    return (
        <div className="h-full flex flex-col p-4 overflow-hidden bg-[#050505]">
            <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">badge</span> HUNTER PASS
                </h2>
                <button onClick={() => playUiSound('CLICK')} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold uppercase hover:scale-105 transition-transform shadow-lg border border-purple-400">
                    Activate Premium ($9.99)
                </button>
            </div>
            
            <div className="flex-1 overflow-x-auto no-scrollbar relative flex flex-col justify-center">
                
                {/* Premium Track */}
                <div className="flex items-center gap-2 mb-2 w-max px-2">
                    <div className="w-24 shrink-0 text-center text-purple-400 font-bold text-xs uppercase bg-purple-900/30 p-2 rounded h-[100px] flex items-center justify-center border border-purple-500/50 shadow-inner">PREMIUM</div>
                    {TIERS.map(t => (
                        <div key={`p-${t}`} className="w-[120px] h-[100px] shrink-0 bg-gradient-to-br from-purple-900/50 to-black border border-purple-500/50 rounded flex flex-col items-center justify-center relative hover:scale-105 transition-transform cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <span className="absolute top-1 left-2 font-mono text-[10px] text-purple-300 font-bold">{t}</span>
                            <span className="material-symbols-outlined text-3xl text-purple-400 mb-1">workspace_premium</span>
                            <span className="text-[10px] font-bold text-white uppercase">Epic Loot</span>
                        </div>
                    ))}
                </div>

                {/* Path line */}
                <div className="w-max px-2 min-w-full">
                    <div className="w-full h-2 bg-gray-800 rounded-full my-4 relative">
                        <div className="absolute left-0 top-0 h-full w-[25%] bg-primary rounded-full shadow-[0_0_10px_cyan]"></div>
                    </div>
                </div>

                {/* Free Track */}
                <div className="flex items-center gap-2 mt-2 w-max px-2">
                    <div className="w-24 shrink-0 text-center text-gray-400 font-bold text-xs uppercase bg-white/5 p-2 rounded h-[100px] flex items-center justify-center border border-white/10">FREE</div>
                    {TIERS.map(t => (
                        <div key={`f-${t}`} className="w-[120px] h-[100px] shrink-0 bg-black border border-white/10 rounded flex flex-col items-center justify-center relative hover:border-white/30 transition-colors">
                            <span className="absolute top-1 left-2 font-mono text-[10px] text-gray-500 font-bold">{t}</span>
                            {t % 2 !== 0 ? (
                                <>
                                    <span className="material-symbols-outlined text-3xl text-gray-400 mb-1">diamond</span>
                                    <span className="text-[10px] font-bold text-white uppercase">100 Iron</span>
                                </>
                            ) : (
                                <span className="text-gray-700 font-mono text-xs">--</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GuildsView = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-700 mb-4">groups</span>
        <h2 className="text-2xl font-display font-bold text-gray-500 uppercase">Guild Network</h2>
        <p className="font-mono text-xs text-gray-600 mt-2">OFFLINE. CONNECTION TO CLAN SERVER FAILED.</p>
    </div>
);

const StatsView = ({ profile, onUpdateProfile }: { profile: PlayerProfile, onUpdateProfile: (p: PlayerProfile) => void }) => {
    // Local state for pending changes
    const [localStats, setLocalStats] = useState<PlayerStats>(profile.stats);
    const [localUnspent, setLocalUnspent] = useState<number>(profile.unspentPoints || 0);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setLocalStats(profile.stats);
        setLocalUnspent(profile.unspentPoints || 0);
        setHasChanges(false);
    }, [profile]);

    const handleIncrement = (stat: keyof PlayerStats) => {
        if (localUnspent > 0) {
            playUiSound('TICK');
            setLocalStats(prev => ({ ...prev, [stat]: prev[stat] + 1 }));
            setLocalUnspent(prev => prev - 1);
            setHasChanges(true);
        }
    };

    const handleDecrement = (stat: keyof PlayerStats) => {
        if (localStats[stat] > profile.stats[stat]) {
            playUiSound('CLICK');
            setLocalStats(prev => ({ ...prev, [stat]: prev[stat] - 1 }));
            setLocalUnspent(prev => prev + 1);
        }
    };

    const handleConfirm = async () => {
        playUiSound('CONFIRM');
        const newProfile = await GameService.batchAllocateStats(profile, localStats, localUnspent);
        onUpdateProfile(newProfile);
    };

    return (
        <div className="h-full flex flex-col p-4 relative overflow-hidden bg-[#050505]">
             {/* Background Grid */}
             <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

             {/* Header */}
             <div className="text-center mb-4 relative z-10">
                 <div className="inline-block border-b-2 border-primary/30 pb-1 px-8">
                    <h2 className="font-display font-bold text-2xl text-white tracking-[0.3em] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">STATUS</h2>
                 </div>
             </div>

             {/* Level & Job Info */}
             <div className="flex items-start justify-between mb-4 relative z-10 px-2">
                 <div className="flex flex-col items-center pl-4">
                     <span className="text-6xl font-display font-black text-white leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                         {profile.level}
                     </span>
                     <span className="text-[10px] font-mono text-primary font-bold tracking-[0.2em] mt-1">LEVEL</span>
                 </div>
                 <div className="flex flex-col items-end gap-1.5 text-right mt-2">
                     <div className="flex items-center gap-3">
                         <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">JOB</span>
                         <span className="text-xs font-bold text-white font-sans tracking-wide">NONE</span>
                     </div>
                     <div className="flex items-center gap-3">
                         <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">TITLE</span>
                         <span className="text-xs font-bold text-white font-sans tracking-wide">NONE</span>
                     </div>
                 </div>
             </div>

             {/* Vengeance Gauge (Replaces Vitals) */}
             <div className="mb-6 relative z-10">
                <VengeanceGauge value={profile.vengeanceGauge} />
             </div>

             {/* Stats Grid Layout - Explicit Columns */}
             <div className="border border-primary/30 p-4 bg-black/40 relative z-10 flex-1 flex flex-col justify-center">
                 {/* Corner Accents */}
                 <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                 <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>

                 <div className="grid grid-cols-2 gap-x-4 gap-y-6 content-center w-full">
                     {/* Column 1 Row 1 */}
                     <StatRow 
                        label="STR" 
                        value={localStats.str} 
                        baseValue={profile.stats.str}
                        onIncrement={() => handleIncrement('str')} 
                        onDecrement={() => handleDecrement('str')}
                        canAdd={localUnspent > 0} 
                        canRemove={localStats.str > profile.stats.str}
                        icon="fitness_center" 
                     />
                     {/* Column 2 Row 1 */}
                     <StatRow 
                        label="VIT" 
                        value={localStats.vit} 
                        baseValue={profile.stats.vit}
                        onIncrement={() => handleIncrement('vit')} 
                        onDecrement={() => handleDecrement('vit')}
                        canAdd={localUnspent > 0} 
                        canRemove={localStats.vit > profile.stats.vit}
                        icon="favorite" 
                     />
                     
                     {/* Column 1 Row 2 */}
                     <StatRow 
                        label="AGI" 
                        value={localStats.agi} 
                        baseValue={profile.stats.agi}
                        onIncrement={() => handleIncrement('agi')} 
                        onDecrement={() => handleDecrement('agi')}
                        canAdd={localUnspent > 0} 
                        canRemove={localStats.agi > profile.stats.agi}
                        icon="directions_run" 
                     />
                     {/* Column 2 Row 2 */}
                     <StatRow 
                        label="INT" 
                        value={localStats.int} 
                        baseValue={profile.stats.int}
                        onIncrement={() => handleIncrement('int')} 
                        onDecrement={() => handleDecrement('int')}
                        canAdd={localUnspent > 0} 
                        canRemove={localStats.int > profile.stats.int}
                        icon="psychology" 
                     />
                     
                     {/* Column 1 Row 3 */}
                     <StatRow 
                        label="PER" 
                        value={localStats.sen} 
                        baseValue={profile.stats.sen}
                        onIncrement={() => handleIncrement('sen')} 
                        onDecrement={() => handleDecrement('sen')}
                        canAdd={localUnspent > 0} 
                        canRemove={localStats.sen > profile.stats.sen}
                        icon="visibility" 
                     />
                     
                     {/* Column 2 Row 3 - Available Points */}
                     <div className="flex flex-col justify-center items-end pr-2">
                         <span className="text-[9px] text-gray-500 font-mono uppercase tracking-tight mb-1">Available Points</span>
                         <span className="font-display font-bold text-4xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                             {localUnspent}
                         </span>
                     </div>
                 </div>
             </div>

             {/* Confirmation Button */}
             <AnimatePresence>
                 {hasChanges && (localUnspent < profile.unspentPoints) && (
                     <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="absolute bottom-6 left-6 right-6 z-20"
                     >
                         <button 
                            onClick={handleConfirm}
                            className="w-full py-4 bg-primary border border-primary text-black font-display font-bold text-xl uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                         >
                             CONFIRM NEURAL LINK
                         </button>
                     </motion.div>
                 )}
             </AnimatePresence>
        </div>
    );
};

const StatRow = ({ label, value, baseValue, onIncrement, onDecrement, canAdd, canRemove, icon }: any) => {
    // If modified, use a highlight box style
    const isModified = value > baseValue;
    
    return (
    <div className={`flex items-center justify-between py-1 px-1 rounded-sm transition-all ${isModified ? 'border border-primary/30 bg-primary/5' : ''}`}>
        <div className="flex items-center gap-2 text-primary font-mono font-bold text-base">
            <span className="material-symbols-outlined text-xs opacity-70">{icon}</span>
            <span className="tracking-widest">{label}</span>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-center leading-none w-8 text-center">
                {/* Value Display - Always White per request "Regular 11" */}
                <span className={`font-display font-bold text-xl text-white`}>
                    {value}
                </span>
                {/* Delta Indicator */}
                {isModified && (
                    <span className="text-[8px] font-bold text-yellow-400 font-mono mt-0.5">
                        (+{value - baseValue})
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                {/* Plus Button - Left of pair */}
                <button 
                    onClick={onIncrement}
                    disabled={!canAdd}
                    className={`w-6 h-6 flex items-center justify-center border rounded-[2px] transition-all ${
                        canAdd 
                        ? 'border-primary text-primary hover:bg-primary hover:text-black cursor-pointer shadow-[0_0_5px_rgba(0,255,255,0.4)]' 
                        : 'border-white/10 text-white/10 cursor-not-allowed'
                    }`}
                >
                    <span className="material-symbols-outlined text-[10px] font-bold">add</span>
                </button>

                {/* Minus Button - Right of Plus per request */}
                <button 
                    onClick={onDecrement}
                    disabled={!canRemove}
                    className={`w-6 h-6 flex items-center justify-center border rounded-[2px] transition-all ${
                        canRemove 
                        ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black cursor-pointer' 
                        : 'border-white/10 text-white/10 cursor-not-allowed hidden' // Hide if can't remove to keep clean? Or just dim. Sticking to dim per logic but prompt implied toggle visibility.
                    }`}
                    style={{ opacity: canRemove ? 1 : 0, pointerEvents: canRemove ? 'auto' : 'none' }} // Hide visually if no points added to keep clean look
                >
                    <span className="material-symbols-outlined text-[10px] font-bold">remove</span>
                </button>
            </div>
        </div>
    </div>
    );
};

const ProgressionView = ({ profile }: { profile: PlayerProfile }) => {
    const nextRank = profile.rank === 'E' ? 'D' : profile.rank === 'D' ? 'C' : 'S'; // Simplified
    
    return (
        <div className="h-full flex flex-col p-4">
            <h2 className="font-display font-bold text-2xl text-white mb-6 border-b border-primary/20 pb-2">HUNTER RANK</h2>
            
            <div className="flex-1 flex flex-col items-center justify-center mb-8">
                <div className="relative w-40 h-40 flex items-center justify-center border-4 border-primary rounded-full mb-6 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                    <span className="text-8xl font-black font-display text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{profile.rank}</span>
                    <div className="absolute -bottom-4 bg-black border border-primary px-3 py-1">
                        <span className="font-mono text-xs text-primary font-bold">CURRENT RANK</span>
                    </div>
                </div>
                
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs font-mono text-gray-400">
                        <span>XP PROGRESS</span>
                        <span>{profile.currentXp} / {profile.requiredXp}</span>
                    </div>
                    <div className="h-4 bg-gray-900 border border-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${Math.min(100, (profile.currentXp / profile.requiredXp) * 100)}%` }}></div>
                    </div>
                    <p className="text-center text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                        {profile.requiredXp - profile.currentXp} XP TO RANK {nextRank}
                    </p>
                </div>
            </div>

            <div className="p-4 text-center">
                 <p className="text-xs text-gray-400 font-mono mb-2 uppercase">Vengeance Gauge</p>
                 <VengeanceGauge value={profile.vengeanceGauge} />
            </div>
        </div>
    );
};

const HistoryView = ({ history }: { history: DungeonRecord[] }) => (
    <div className="h-full flex flex-col p-4">
        <h2 className="font-display font-bold text-2xl text-white mb-4 border-b border-primary/20 pb-2">COMBAT LOGS</h2>
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {history.length === 0 ? (
                <div className="text-center text-gray-600 mt-10 font-mono text-xs">NO RECORDS FOUND</div>
            ) : (
                history.slice().reverse().map((rec, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-3 flex justify-between items-center hover:bg-white/10 transition-colors">
                        <div>
                            <p className="font-bold text-white text-sm uppercase">{rec.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{new Date(rec.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-primary font-bold font-mono text-sm">{rec.reps} REPS</p>
                            <p className="text-[10px] text-yellow-500 font-mono">+{rec.iron} IRON</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

const DailyOptionsView = ({ onSync, onCampfire, onDungeon, onClose }: { onSync: () => void, onCampfire: () => void, onDungeon: () => void, onClose: () => void }) => (
    <div className="h-full flex flex-col p-6 items-center justify-center space-y-6">
        <h2 className="font-display font-bold text-3xl text-white text-center mb-4">DAILY PROTOCOL</h2>
        
        <button 
            onClick={() => { playUiSound('CONFIRM'); onDungeon(); }}
            className="w-full p-6 border border-critical bg-critical/10 hover:bg-critical/20 transition-all group relative overflow-hidden"
        >
            <div className="relative z-10 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-critical mb-2 group-hover:scale-110 transition-transform">swords</span>
                <span className="font-display font-bold text-2xl text-white uppercase tracking-widest">COMBAT</span>
                <span className="font-mono text-[10px] text-critical mt-2 uppercase tracking-wider">High Risk • Max Rewards</span>
            </div>
        </button>

        <button 
            onClick={() => { playUiSound('CONFIRM'); onCampfire(); }}
            className="w-full p-6 border border-blue-500 bg-blue-500/10 hover:bg-blue-500/20 transition-all group relative overflow-hidden"
        >
            <div className="relative z-10 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-blue-500 mb-2 group-hover:scale-110 transition-transform">fireplace</span>
                <span className="font-display font-bold text-2xl text-white uppercase tracking-widest">RECOVERY</span>
                <span className="font-mono text-[10px] text-blue-500 mt-2 uppercase tracking-wider">Maintain Streak • Low Rewards</span>
            </div>
        </button>

        <button onClick={onClose} className="text-xs font-mono text-gray-500 hover:text-white mt-4 uppercase tracking-widest">Cancel</button>
    </div>
);

const PROMPTS = [
    "What is one physical habit you want to improve today?",
    "How many hours of sleep did you get last night, and what is your goal for tonight?",
    "What is one thing you accomplished yesterday that you're proud of?",
    "Describe how your body feels right now in three words.",
    "What is your main focus for today's rest and recovery?"
];

const CampfireView = ({ onComplete }: { onComplete: (bonusExp: number) => void }) => {
    const [activeTab, setActiveTab] = useState<'MEDITATE' | 'JOURNAL'>('MEDITATE');
    const [entry, setEntry] = useState('');
    const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
    
    // Tracking completion
    const [journalDone, setJournalDone] = useState(false);
    const [meditationDone, setMeditationDone] = useState(false);

    // Watch for journal typing
    useEffect(() => {
        if (entry.trim().length >= 10) setJournalDone(true);
        else setJournalDone(false);
    }, [entry]);

    const isBothDone = journalDone && meditationDone;
    const canComplete = journalDone || meditationDone;

    return (
        <div className="h-full flex flex-col p-4 text-center overflow-y-auto no-scrollbar relative bg-[#050505]">
            <h2 className="font-display font-bold text-2xl text-white mb-1 uppercase tracking-widest text-orange-500">Campfire Rest</h2>
            <p className="font-mono text-[10px] text-gray-500 mb-4 uppercase">Mindful Recovery Protocol</p>
            
            {/* Tabs */}
            <div className="flex bg-black border border-white/20 p-1 mb-4">
                <button 
                    onClick={() => setActiveTab('MEDITATE')} 
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'MEDITATE' ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Meditate {meditationDone && '✓'}
                </button>
                <button 
                    onClick={() => setActiveTab('JOURNAL')} 
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'JOURNAL' ? 'bg-orange-500 text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Journal {journalDone && '✓'}
                </button>
            </div>

            {/* View Content */}
            <div className="flex-1 min-h-[250px]">
                {activeTab === 'MEDITATE' && (
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full aspect-video bg-black border border-white/10 mb-4 rounded overflow-hidden shadow-[0_0_15px_rgba(249,115,22,0.1)] relative">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://www.youtube.com/embed/inpok4MKVLM" 
                                title="3 Minute Guided Meditation" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </div>
                        <p className="text-xs font-mono text-gray-400 mb-4">Take 3 minutes to breathe. Click the button below when finished to log your session.</p>
                        <button 
                            onClick={() => { playUiSound('TICK'); setMeditationDone(true); }}
                            disabled={meditationDone}
                            className={`w-full py-3 font-bold uppercase tracking-widest border transition-colors ${meditationDone ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/10 border-white/30 text-white hover:bg-white hover:text-black'}`}
                        >
                            {meditationDone ? 'Meditation Logged ✓' : 'Log Meditation Session'}
                        </button>
                    </div>
                )}

                {activeTab === 'JOURNAL' && (
                    <div className="w-full flex flex-col text-left h-full">
                        <h3 className="font-mono text-xs text-orange-400 mb-2 uppercase tracking-widest"><span className="material-symbols-outlined text-[12px] mr-1 align-text-bottom">edit_document</span> Daily Reflection</h3>
                        <p className="font-bold text-sm text-white mb-3 bg-white/5 p-3 border-l-2 border-orange-500">{prompt}</p>
                        <textarea 
                            className="w-full flex-1 min-h-[120px] bg-black border border-white/20 text-white p-3 font-mono text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none mb-4"
                            placeholder="Type your reflection here..."
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                        />
                        {journalDone && <p className="text-green-500 font-mono text-[10px] text-center mb-2 uppercase tracking-widest">Journal Logged ✓</p>}
                    </div>
                )}
            </div>
            
            {/* Completion Block */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="font-mono text-[9px] text-gray-500 mb-2 uppercase tracking-widest">
                    {isBothDone ? 'MAXIMUM MINDFULNESS ACHIEVED (+50 EXP)' : 'COMPLETE BOTH FOR +50 BONUS EXP'}
                </p>
                <CyberButton onClick={() => { playUiSound('CONFIRM'); onComplete(isBothDone ? 50 : 0); }} disabled={!canComplete} icon="check">
                    {!canComplete ? "COMPLETE AN ACTIVITY" : (isBothDone ? "VERIFY & REST (BONUS +50)" : "VERIFY & REST")}
                </CyberButton>
            </div>
        </div>
    );
};

const WHEEL_COLORS = [
    '#9c27b0', // purple
    '#e91e63', // pink
    '#f44336', // red
    '#ff9800', // orange
    '#ffeb3b', // yellow
    '#4caf50', // green
    '#03a9f4', // light blue
    '#2196f3', // blue
];

const RouletteView = ({ profile, onUpdateProfile }: { profile: PlayerProfile, onUpdateProfile: (p: PlayerProfile) => void }) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<WheelReward | null>(null);
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const [targetRotation, setTargetRotation] = useState(0);

    // 12-hour cooldown check
    useEffect(() => {
        const checkCooldown = () => {
            if (!profile.lastSpinTime) {
                setTimeLeft(null);
                return;
            }
            const cooldownMs = 12 * 60 * 60 * 1000;
            const now = Date.now();
            const elapsed = now - profile.lastSpinTime;
            
            if (elapsed < cooldownMs) {
                const remaining = cooldownMs - elapsed;
                const hours = Math.floor(remaining / (1000 * 60 * 60));
                const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft(null);
            }
        };

        checkCooldown();
        const interval = setInterval(checkCooldown, 60000);
        return () => clearInterval(interval);
    }, [profile.lastSpinTime]);

    const handleSpin = async () => {
        if (spinning || timeLeft) return;
        setResult(null);
        
        // 1. Get backend result first
        const { newProfile, reward } = await GameService.spinWheel(profile);
        
        // 2. Calculate exact mathematical rotation to land on the reward
        const index = WHEEL_LOOT_TABLE.findIndex(r => r.id === reward.id);
        const sliceAngle = 360 / WHEEL_LOOT_TABLE.length;
        const offset = (index * sliceAngle) + (sliceAngle / 2);
        
        // If winning slice is at 90 deg, we rotate 360 - 90 = 270 deg to bring it to top (0 deg).
        // Add 5 full spins (1800 deg) for the animation effect.
        const alignment = 360 - offset;
        const finalRotation = targetRotation + (360 * 5) + (alignment - (targetRotation % 360));
        
        setTargetRotation(finalRotation);
        setSpinning(true);
        playUiSound('CLICK');
        
        // 3. Wait animation
        await new Promise(r => setTimeout(r, 3000));
        
        setResult(reward);
        onUpdateProfile(newProfile);
        setSpinning(false);
        playUiSound('CHIME');
    };

    return (
        <div className="h-full flex flex-col items-center p-6 text-center bg-[#050505] overflow-y-auto no-scrollbar">
            
            {/* The Visual Wheel */}
            <div className="relative w-72 h-72 mb-10 shrink-0 mt-8">
                {/* Center Pointer */}
                <svg className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 z-40 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" viewBox="0 0 100 100">
                    <polygon points="10,10 90,10 50,80" fill="white" stroke="black" strokeWidth="8" strokeLinejoin="round" />
                </svg>
                
                {/* Spinning Container (SVG PIE CHART) */}
                <motion.div 
                    className="w-full h-full rounded-full border-[10px] border-white ring-4 ring-black relative bg-black shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden"
                    animate={{ rotate: targetRotation }}
                    transition={spinning ? { duration: 3, ease: "circOut" } : { duration: 0 }}
                >
                    <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 transform -rotate-90">
                        {WHEEL_LOOT_TABLE.map((item, i) => {
                            const total = WHEEL_LOOT_TABLE.length;
                            const angle = 360 / total;
                            const startAngle = i * angle;
                            const endAngle = (i + 1) * angle;

                            const startRad = startAngle * (Math.PI / 180);
                            const endRad = endAngle * (Math.PI / 180);

                            const x1 = 100 + 100 * Math.cos(startRad);
                            const y1 = 100 + 100 * Math.sin(startRad);
                            const x2 = 100 + 100 * Math.cos(endRad);
                            const y2 = 100 + 100 * Math.sin(endRad);

                            const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`;
                            const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
                            
                            return (
                                <path 
                                    key={`slice-${i}`}
                                    d={pathData}
                                    fill={color}
                                    stroke="black"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>

                    {/* Loot Items positioned in a circle over the SVG */}
                    {WHEEL_LOOT_TABLE.map((item, i) => {
                        const sliceAngle = 360 / WHEEL_LOOT_TABLE.length;
                        const angle = (i * sliceAngle) + (sliceAngle / 2); // Center of the slice
                        
                        return (
                            <div 
                                key={i} 
                                className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center font-display font-black text-white whitespace-nowrap"
                                style={{ 
                                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-85px)`,
                                    textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 4px 4px rgba(0,0,0,0.5)'
                                }}
                            >
                                <span className="text-[14px] leading-tight mb-1">{item.label}</span>
                                <span className="material-symbols-outlined text-4xl" style={{ color: item.type === 'CURRENCY' ? 'gold' : 'white' }}>{item.icon}</span>
                            </div>
                        );
                    })}
                </motion.div>
                
                {/* Center Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-[6px] border-black flex items-center justify-center z-20 shadow-xl text-black font-display font-black text-2xl">
                     ?
                </div>
            </div>

            {/* Controls & Results */}
            <div className="min-h-[140px] w-full flex flex-col items-center justify-start mt-6">
                <AnimatePresence mode="wait">
                    {result && !spinning && (
                        <motion.div 
                            key="result"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center w-full max-w-[280px]"
                        >
                            <p className="text-[10px] text-gray-400 font-mono uppercase mb-2 tracking-widest">REWARD OBTAINED</p>
                            <div className="bg-white/10 p-4 border-2 border-white mb-4 w-full">
                                <span className="material-symbols-outlined text-4xl mb-2 text-white">{result.icon}</span>
                                <h3 className="font-display font-bold text-white text-xl uppercase tracking-wider">{result.label}</h3>
                            </div>
                            <button onClick={() => setResult(null)} className="text-[10px] text-gray-500 font-mono underline hover:text-white uppercase">Close Result</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            {/* Loot Table Legend */}
            <div className="w-full mt-8 border-t border-white/10 pt-6">
                <h3 className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">Possible Rewards</h3>
                <div className="grid grid-cols-2 gap-2 text-left">
                    {WHEEL_LOOT_TABLE.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[10px]" style={{ color: getRarityColor(item.tier) }}>{item.icon}</span>
                            <span className="font-mono text-[9px] uppercase" style={{ color: getRarityColor(item.tier) }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- GameLobby Main Component ---
const GameLobby: React.FC<GameLobbyProps> = ({ onNavigate, profile, onUpdateProfile, onSelectExercise }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const prevLevel = useRef(profile.level);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  // Calculate HP/Mana - Numbers based logic
  const maxHp = profile.stats.vit * 10;
  const maxMana = profile.stats.int * 10;
  const currentHp = profile.currentHp !== undefined ? profile.currentHp : maxHp; 
  const currentMana = profile.currentMana !== undefined ? profile.currentMana : maxMana;

  const hpPercent = Math.min(100, Math.max(0, (currentHp / maxHp) * 100));
  const manaPercent = Math.min(100, Math.max(0, (currentMana / maxMana) * 100));
  
  const dailyQuestProgress = profile.dailyQuestCompleted ? 100 : 0;

  const closeModal = () => setActiveModal(null);
  
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
      if (profile.level > prevLevel.current) {
          setShowLevelUp(true);
          prevLevel.current = profile.level;
          setTimeout(() => setShowLevelUp(false), 4000);
      }
  }, [profile.level]);
  
  const handlePurchase = async (item: any) => {
      const res = await GameService.purchaseItem(profile, item);
      if (res.success && res.newProfile) {
          if (onUpdateProfile) onUpdateProfile(res.newProfile);
      } else {
          alert(res.message);
      }
      setRefreshKey(prev => prev + 1);
  };

  const handleSync = async () => {
      if (profile.dailyQuestCompleted) return;
      const updated = await GameService.performSystemSync(profile);
      if (onUpdateProfile) onUpdateProfile(updated);
      setRefreshKey(prev => prev + 1);
  };

  const handleCampfireComplete = async (bonusExp: number = 0) => {
      const updated = await GameService.performCampfire(profile, bonusExp);
      onUpdateProfile(updated);
      closeModal();
  };

  const handleProfileUpdate = (p: PlayerProfile) => {
      if (onUpdateProfile) onUpdateProfile(p);
      setRefreshKey(prev => prev + 1);
  };

  const openModal = (type: ModalType) => {
      playUiSound('OPEN');
      setActiveModal(type);
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden text-white font-sans selection:bg-primary selection:text-black">
       {/* Background Visuals */}
       <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
         <defs>
           <filter id="dragon-edge">
             <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
             <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
           </filter>
         </defs>
       </svg>

       <div className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300FFFF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} 
       />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none z-0"></div>

       <AnimatePresence>
           {showLevelUp && (
               <motion.div 
                  initial={{ opacity: 0, scale: 1.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                  className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
               >
                   <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(0,255,255,0.1)_20deg,transparent_40deg)] z-0"
                   />
                   <h1 className="text-8xl font-black font-display text-transparent bg-clip-text bg-gradient-to-t from-primary to-white drop-shadow-[0_0_30px_rgba(0,255,255,0.8)] z-10 mb-4 tracking-tighter">
                       LEVEL UP
                   </h1>
                   <div className="w-full h-1 bg-white mb-4 relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary animate-pulse"></div>
                   </div>
                   <p className="font-mono text-xl text-primary tracking-[0.5em] z-10">SYSTEM UPGRADE COMPLETE</p>
                   <div className="mt-12 z-10">
                       <span className="text-white font-bold text-2xl border border-primary px-4 py-2 bg-black">+3 STAT POINTS</span>
                   </div>
               </motion.div>
           )}
       </AnimatePresence>

       {/* HEADER SECTION */}
       <header className="relative z-20 p-4 pt-6 flex justify-between items-start flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-center relative" onClick={() => openModal('STATS')}>
                {(profile.streak > 0 || profile.dailyQuestCompleted) && (
                    <div className="absolute -top-1 -right-1 z-20 flex items-center justify-center w-5 h-5 bg-black border border-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]">
                        <span className="material-symbols-outlined text-orange-500 text-[10px] animate-pulse drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]">local_fire_department</span>
                    </div>
                )}
                <div className="w-14 h-14 bg-black border border-primary/50 relative flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.2)] group cursor-pointer active:scale-95 transition-transform">
                   <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black z-0"></div>
                   <span className="material-symbols-outlined text-3xl text-white/50 relative z-10 group-hover:text-primary transition-colors">person</span>
                   <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-primary"></div>
                   <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-primary"></div>
                   <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-primary"></div>
                   <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-primary"></div>
                </div>
                <div className="flex flex-col items-center mt-1 w-full">
                    <span className="text-[8px] font-mono text-primary/70 uppercase tracking-tighter leading-tight text-center">
                        LVL {profile.level}
                    </span>
                    {(profile.streak > 0 || profile.dailyQuestCompleted) && (
                        <span className="text-[8px] font-mono text-orange-500 font-bold uppercase tracking-wider leading-tight text-center mt-0.5">
                            {profile.streak} DAY STREAK
                        </span>
                    )}
                </div>
             </div>

             <div className="flex flex-col gap-2 w-[120px]">
                <div className="relative">
                   <div className="flex justify-between items-end mb-0.5">
                      <span className="text-[7px] font-mono text-white/80 uppercase font-bold tracking-wider">Health</span>
                      <span className="text-[7px] font-mono text-critical font-bold">{Math.round(currentHp)}/{maxHp}</span>
                   </div>
                   <div className="h-2.5 w-full bg-black rounded-full border border-gray-800 relative overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${hpPercent}%` }}
                        className="h-full bg-gradient-to-r from-[#500000] via-[#800000] to-[#FF0000] relative z-10 shadow-[0_0_5px_#FF0000]"
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 blur-[1px]"></div>
                      </motion.div>
                   </div>
                </div>

                <div className="relative">
                   <div className="flex justify-between items-end mb-0.5">
                      <span className="text-[7px] font-mono text-white/80 uppercase font-bold tracking-wider">Mana</span>
                      <span className="text-[7px] font-mono text-cyan-400 font-bold">{Math.round(currentMana)}/{maxMana}</span>
                   </div>
                   <div className="h-2.5 w-full bg-black rounded-full border border-gray-800 relative overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${manaPercent}%` }}
                        className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 relative z-10 shadow-[0_0_12px_rgba(0,255,255,0.6)]"
                      >
                         <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/80 blur-[0.5px]"></div>
                      </motion.div>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex items-start gap-5">
             <div className="relative group cursor-pointer mt-0.5" onClick={() => openModal('PROGRESSION')}>
                <div className="w-14 h-14 bg-[#080808] border border-primary flex items-center justify-center relative shadow-[0_0_10px_#00FFFF] transition-transform group-hover:scale-105"
                     style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                    <div className="absolute inset-[1px] border border-primary/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                    <div className="flex flex-col items-center -mt-0.5">
                       <span className="font-display font-bold text-xl text-primary drop-shadow-[0_0_5px_#00FFFF] leading-none">{profile.rank}</span>
                       <span className="font-mono text-[7px] text-white font-bold leading-none">RANK</span>
                    </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black border border-primary/50 rounded-[2px] px-1 py-px shadow-lg flex items-center gap-0.5 z-10">
                   <span className="material-symbols-outlined text-[8px] text-primary">map</span>
                </div>
             </div>

             <div className="flex flex-col items-end gap-2">
                <div className="flex flex-col items-end gap-0.5">
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gray-400 text-xs">change_history</span>
                      <span className="font-mono text-xs font-bold text-white tracking-wider">{profile.iron}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-blue-400 text-xs drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]">diamond</span>
                      <span className="font-mono text-xs font-bold text-white tracking-wider">{profile.crystals}</span>
                   </div>
                </div>

                <div className="flex gap-1">
                   <button 
                     onClick={() => openModal('SHOP')}
                     className="flex items-center justify-center w-6 h-6 border border-primary/30 bg-[#0a0a0a] rounded hover:border-primary hover:bg-primary/10 transition-all hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                   >
                      <span className="material-symbols-outlined text-primary text-xs">badge</span>
                   </button>
                   <button 
                     onClick={() => {
                        if (profile.dailyQuestCompleted) {
                           openModal('ROULETTE');
                        } else {
                           Haptics.error();
                           playUiSound('ERROR');
                           alert("LOCKED: COMPLETE DAILY PROTOCOL FIRST.");
                        }
                     }}
                     className={`flex items-center justify-center w-6 h-6 border bg-[#0a0a0a] rounded transition-all ${
                        profile.dailyQuestCompleted 
                           ? 'border-primary/30 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                           : 'border-gray-800 opacity-50 cursor-not-allowed'
                     }`}
                   >
                      <span className={`material-symbols-outlined text-xs ${profile.dailyQuestCompleted ? 'text-primary animate-spin-slow' : 'text-gray-500'}`}>
                          {profile.dailyQuestCompleted ? 'cyclone' : 'lock'}
                      </span>
                   </button>
                </div>
             </div>
          </div>
       </header>

       {/* MAIN CONTENT AREA */}
       <main className="flex-1 relative z-10 flex flex-col items-center w-full px-4 pt-2 pb-40 overflow-y-auto no-scrollbar min-h-0">
          <div className="w-full max-w-md relative mt-2 group mb-4 shrink-0">
              <div className="absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-[#0a0a0a] border border-primary/50 p-1 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                 <div className="border border-primary/10 rounded-md p-3 bg-black/60 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-display font-bold text-white text-sm tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                           [ DAILY QUEST ]
                        </span>
                        <span className="text-[9px] font-mono text-primary/70">{profile.dailyQuestCompleted ? "SYNC COMPLETE" : "MAINTAIN LINK"}</span>
                    </div>
                    <div className="h-2 w-full bg-black rounded-full border border-gray-800 relative overflow-hidden mb-3">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${dailyQuestProgress}%` }}
                         className="h-full bg-gradient-to-r from-primary/40 to-primary relative shadow-[0_0_5px_#00FFFF]"
                       ></motion.div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                          onClick={() => openModal('DAILY_OPTIONS')}
                          disabled={profile.dailyQuestCompleted}
                          className={`w-full py-3 border text-[10px] font-mono uppercase tracking-[0.2em] font-bold transition-all ${profile.dailyQuestCompleted ? 'bg-primary/20 border-primary text-primary cursor-default' : 'bg-primary/10 border-primary/50 text-white hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]'}`}
                       >
                          {profile.dailyQuestCompleted ? "SYSTEM LINK ESTABLISHED" : "INITIATE DAILY PROTOCOL"}
                       </button>
                    </div>
                 </div>
              </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative w-full min-h-[200px] my-2 shrink-0">
             <div className="absolute w-[200px] h-[200px] bg-black rounded-full blur-3xl opacity-90"></div>
             <div className="absolute w-[160px] h-[160px] bg-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
             
             {/* EGG MECHANIC REMOVED TO FIT REHAB THEME */}

             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/50 blur-xl rounded-full"></div>
          </div>

          <div className="w-full max-w-xs mb-4 shrink-0">
             <button onClick={() => openModal('DUNGEONS')} className="w-full relative group">
                <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500 rounded-lg"></div>
                <div className="relative border border-primary/80 bg-black p-4 rounded-sm flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.1)] overflow-hidden group-hover:border-primary transition-colors">
                   <div className="absolute inset-0 flex justify-center gap-4 opacity-20 pointer-events-none">
                      <div className="w-0.5 h-full bg-primary shadow-[0_0_2px_#00FFFF]"></div>
                      <div className="w-0.5 h-full bg-primary shadow-[0_0_2px_#00FFFF]"></div>
                      <div className="w-0.5 h-full bg-primary shadow-[0_0_2px_#00FFFF]"></div>
                   </div>
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-primary shadow-[0_0_10px_#00FFFF]"></div>
                   <h2 className="font-display font-bold text-xl text-white tracking-[0.15em] drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] z-10 group-hover:scale-105 transition-transform">
                      [ FIND DUNGEONS ]
                   </h2>
                </div>
             </button>
          </div>

          <button 
             onClick={() => openModal('GUILDS')}
             className="mb-6 relative px-8 py-1 group shrink-0"
          >
             <div className="absolute inset-0 bg-[#0a0a0a] border border-primary/30 transform skew-x-[-20deg] group-hover:bg-primary/10 transition-all"></div>
             <span className="relative font-display font-bold text-primary/80 tracking-[0.2em] text-xs uppercase group-hover:text-white transition-colors">
                Guilds
             </span>
          </button>

       </main>

       <nav className="absolute bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-primary/20 pt-2 pb-8 px-2 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.8)] gap-2">
          <NavButton icon="backpack" label="Loadout" onClick={() => { setActiveModal('GEAR'); }} hologram />
          <NavButton icon="storefront" label="Shop" onClick={() => openModal('SHOP')} />
          <NavButton icon="stars" label="Skills" onClick={() => openModal('SKILLS')} />
          <NavButton icon="badge" label="Pass" onClick={() => openModal('BATTLE_PASS')} />
          <NavButton icon="volunteer_activism" label="Tribute" onClick={() => openModal('TRIBUTE')} />
       </nav>

       <AnimatePresence>
         {activeModal && (
            <ModalWrapper onClose={closeModal}>
               {activeModal === 'GEAR' && <GearView profile={profile} onUpdateProfile={handleProfileUpdate} initialTab="BODY" onClose={closeModal} />}
               {activeModal === 'SHOP' && <ShopView profile={profile} onPurchase={handlePurchase} onClose={closeModal} />}
               {activeModal === 'SKILLS' && <SkillsView />}
               {activeModal === 'TRIBUTE' && <TributeView />}
               {activeModal === 'STATS' && <StatsView profile={profile} onUpdateProfile={handleProfileUpdate} />}
               {activeModal === 'DUNGEONS' && <DungeonView profile={profile} onEnter={() => onNavigate && onNavigate(Step.DUNGEON_RUN)} onSelectExercise={onSelectExercise} />}
               {activeModal === 'PROGRESSION' && <ProgressionView profile={profile} />}
               {activeModal === 'GUILDS' && <GuildsView />}
               {activeModal === 'ROULETTE' && <RouletteView profile={profile} onUpdateProfile={handleProfileUpdate} />}
               {activeModal === 'BATTLE_PASS' && <BattlePassView />}
               {activeModal === 'CAMPFIRE' && <CampfireView onComplete={handleCampfireComplete} />}
               {activeModal === 'HISTORY' && <HistoryView history={profile.history || []} />}
               {activeModal === 'DAILY_OPTIONS' && (
                  <DailyOptionsView 
                     onSync={async () => { await handleSync(); }} 
                     onCampfire={() => setActiveModal('CAMPFIRE')} 
                     onDungeon={() => setActiveModal('DUNGEONS')} 
                     onClose={closeModal}
                  />
               )}
            </ModalWrapper>
         )}
       </AnimatePresence>

    </div>
  );
};

export default GameLobby;
