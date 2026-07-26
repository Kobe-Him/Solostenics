
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TacticalOverlayProps {
  playerHP: number;
  playerMana: number;
  enemyName: string;
  secondsRemaining: number;
  onSkill: (skillId: string) => void;
}

// --- CARD COMPONENT ---
const TacticalCard = ({ 
    type, 
    title, 
    icon, 
    cost, 
    effect, 
    desc, 
    onClick, 
    disabled,
    index
}: any) => {
    
    // THEME CONFIGURATION
    const theme = {
        GREEN: { 
            main: 'border-green-500', 
            text: 'text-green-500', 
            bg: 'bg-green-950/40',
            glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
            pattern: 'radial-gradient(circle, rgba(34,197,94,0.1) 1px, transparent 1px)',
            iconBg: 'bg-green-900/30'
        },
        RED: { 
            main: 'border-critical', 
            text: 'text-critical', 
            bg: 'bg-red-950/40',
            glow: 'shadow-[0_0_20px_rgba(255,0,60,0.15)]',
            pattern: 'repeating-linear-gradient(45deg, rgba(255,0,60,0.05) 0px, rgba(255,0,60,0.05) 2px, transparent 2px, transparent 8px)',
            iconBg: 'bg-red-900/30'
        },
        BLUE: { 
            main: 'border-primary', 
            text: 'text-primary', 
            bg: 'bg-cyan-950/40',
            glow: 'shadow-[0_0_20px_rgba(0,255,255,0.15)]',
            pattern: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, .05) 25%, rgba(0, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, .05) 75%, rgba(0, 255, 255, .05) 76%, transparent 77%, transparent)',
            iconBg: 'bg-cyan-900/30'
        }
    }[type as 'GREEN' | 'RED' | 'BLUE'] || { main: '', text: '', bg: '', glow: '', pattern: '', iconBg: '' };

    const bgSize = type === 'BLUE' ? '30px 30px' : type === 'GREEN' ? '10px 10px' : '100% 100%';

    return (
        <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
                delay: 0.1 + (index * 0.1), 
                type: "spring", 
                stiffness: 100, 
                damping: 15 
            }}
            whileHover={!disabled ? { scale: 1.02, x: 5 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative w-full h-36 flex flex-row items-stretch overflow-hidden transition-all duration-300 group
                border-l-4 ${disabled ? 'border-gray-700 bg-gray-900/50 opacity-50 grayscale cursor-not-allowed' : `${theme.main} ${theme.bg} ${theme.glow} cursor-pointer`}
                border-t border-r border-b border-white/10 rounded-sm
            `}
        >
             {/* BACKGROUND PATTERN */}
             {!disabled && (
                 <div className="absolute inset-0 pointer-events-none opacity-50 z-0" 
                      style={{ backgroundImage: theme.pattern, backgroundSize: bgSize }}>
                 </div>
             )}

             {/* COST TAG (Absolute Top Right) */}
             <div className={`absolute top-0 right-0 px-3 py-1 font-mono text-[10px] font-bold z-20 flex items-center gap-1 ${disabled ? 'bg-gray-800 text-gray-500' : 'bg-black/60 backdrop-blur-sm border-l border-b border-white/10 text-white'}`}>
                 <span className={`material-symbols-outlined text-[10px] ${disabled ? '' : theme.text}`}>bolt</span>
                 {cost > 0 ? `${cost} MANA` : 'RECOVERS 10'}
             </div>

             {/* LEFT: ICON */}
             <div className={`w-28 relative flex items-center justify-center border-r border-white/10 z-10 ${disabled ? 'bg-black/20' : theme.iconBg}`}>
                 {/* Icon Glow */}
                 {!disabled && <div className={`absolute w-16 h-16 rounded-full opacity-20 blur-xl ${theme.bg.replace('/40', '')}`}></div>}
                 
                 <span className={`material-symbols-outlined text-5xl ${disabled ? 'text-gray-600' : theme.text} drop-shadow-md relative z-10`}>
                     {icon}
                 </span>
             </div>

             {/* RIGHT: CONTENT */}
             <div className="flex-1 p-4 flex flex-col justify-center text-left relative z-10 pl-5">
                 <h3 className={`font-display font-black text-2xl uppercase tracking-wider leading-none mb-1 ${disabled ? 'text-gray-500' : 'text-white'}`}>
                     {title}
                 </h3>
                 
                 <div className={`h-0.5 w-12 mb-3 ${disabled ? 'bg-gray-700' : theme.text.replace('text-', 'bg-')}`}></div>
                 
                 <p className={`font-mono text-xs font-bold uppercase mb-1 ${disabled ? 'text-gray-600' : theme.text}`}>
                     {effect}
                 </p>
                 <p className="font-mono text-[10px] text-gray-400 leading-tight max-w-[220px]">
                     {desc}
                 </p>
             </div>

             {/* HOVER SCANLINE */}
             {!disabled && (
                 <div className="absolute top-0 bottom-0 w-[2px] bg-white/50 opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-700 ease-in-out left-0 z-30 blur-[2px]"></div>
             )}
        </motion.button>
    );
};

// --- ACTIVE STATE ANIMATIONS ---

const BreathingCircle = () => {
    return (
        <div className="relative flex flex-col items-center justify-center h-full">
            <div className="relative">
                {/* Expanding Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-green-500/20"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.4, 1] }} 
                />
                <motion.div
                    className="absolute inset-0 rounded-full border border-green-500/10"
                    animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 0.2, times: [0, 0.4, 1] }} 
                />
                
                {/* Core Circle */}
                <motion.div
                    className="w-48 h-48 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-900/10 relative z-10 backdrop-blur-sm"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, times: [0, 0.4, 1] }} 
                >
                    <motion.div 
                        className="text-center"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    >
                        <span className="material-symbols-outlined text-5xl text-green-400 mb-2">spa</span>
                        <p className="text-green-400 font-display font-bold text-2xl tracking-widest">BREATHE</p>
                    </motion.div>
                </motion.div>
            </div>
            
            <div className="mt-16 text-center w-full">
                <motion.p 
                    key="txt-in"
                    animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 6 }}
                    className="absolute left-0 right-0 text-green-400 font-mono text-xl font-bold uppercase tracking-widest"
                >
                    INHALE (4s)
                </motion.p>
                <motion.p 
                    key="txt-out"
                    animate={{ opacity: [0, 1, 0], y: [-10, 0, 10] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 4, repeatDelay: 4 }}
                    className="absolute left-0 right-0 text-green-400 font-mono text-xl font-bold uppercase tracking-widest"
                >
                    EXHALE (6s)
                </motion.p>
            </div>
        </div>
    );
};

const BloodlustHype = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full w-full">
            {/* Massive Pulsing Text */}
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                className="relative z-10 mb-10"
            >
                <h1 className="text-[120px] leading-[0.8] font-black font-display text-critical italic tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,60,0.8)] stroke-black" style={{ WebkitTextStroke: '3px black' }}>
                    KILL<br/>MODE
                </h1>
            </motion.div>
            
            {/* Status Bar */}
            <div className="w-full bg-critical/10 border-y-2 border-critical py-3 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center opacity-20">
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ff003c_10px,#ff003c_20px)]"></div>
                </div>
                <p className="text-critical font-bold text-2xl font-display uppercase tracking-[0.3em] animate-pulse relative z-10">
                    PAIN ACCEPTED
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-sm px-4">
                <div className="bg-black/80 p-4 border border-critical/50 text-right shadow-[0_0_15px_rgba(255,0,60,0.1)]">
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">REWARD</p>
                    <p className="text-white font-black font-display text-4xl">2X LOOT</p>
                </div>
                <div className="bg-black/80 p-4 border border-critical/50 text-left shadow-[0_0_15px_rgba(255,0,60,0.1)]">
                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">BAD REP</p>
                    <p className="text-critical font-black font-display text-4xl">-10 HP</p>
                </div>
            </div>
        </div>
    );
};

const MobilityChecklist = () => {
    const steps = [
        { id: 1, text: "Arm Circles", time: "10x", detail: "Full Range Fwd/Back" },
        { id: 2, text: "Scapula Pushups", time: "10x", detail: "Squeeze Blades" },
        { id: 3, text: "Wrist Rotations", time: "15s", detail: "Clockwise / Counter" },
        { id: 4, text: "Cat-Cow Stretch", time: "20s", detail: "Spine Fluidity" },
    ];

    return (
        <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center px-4">
            <div className="flex items-center gap-5 mb-10 border-b border-primary/30 pb-6">
                <div className="w-16 h-16 border-2 border-primary bg-primary/10 flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                    <span className="material-symbols-outlined text-primary text-3xl animate-spin-slow">settings</span>
                </div>
                <div>
                    <h3 className="text-white font-bold font-display text-3xl uppercase tracking-widest">Maintenance</h3>
                    <p className="text-xs text-primary font-mono tracking-wider">JOINT_LUBRICATION_SEQUENCE</p>
                </div>
            </div>

            <div className="space-y-4">
                {steps.map((step, i) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.4 }} // Staggered appearance
                        className="flex items-center gap-4 p-4 border-l-4 border-primary bg-gradient-to-r from-primary/10 to-transparent"
                    >
                        <div className="text-xs font-mono text-primary font-bold opacity-60">0{step.id}</div>
                        <div className="flex-1">
                            <span className="block text-white text-lg font-bold uppercase tracking-wide">{step.text}</span>
                            <span className="block text-[10px] text-gray-400 font-mono uppercase">{step.detail}</span>
                        </div>
                        <div className="px-3 py-1 bg-black border border-primary/30 rounded text-primary font-mono text-sm font-bold shadow-[0_0_5px_rgba(0,255,255,0.2)]">
                            {step.time}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="mt-10 text-center"
            >
                <p className="text-primary/60 text-xs font-mono uppercase tracking-[0.2em] animate-pulse mb-2">
                    &gt; OPTIMIZING PERFORMANCE
                </p>
                <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-primary"
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN COMPONENT ---

const TacticalOverlay: React.FC<TacticalOverlayProps> = ({ 
    playerHP, 
    playerMana, 
    enemyName, 
    secondsRemaining,
    onSkill 
}) => {
  const [selectedAction, setSelectedAction] = useState<'PROVOKE' | 'STRETCH' | 'HEAL' | null>(null);
  const [healTriggered, setHealTriggered] = useState(false);

  const handleAction = (action: 'PROVOKE' | 'STRETCH' | 'HEAL') => {
      if (action === 'HEAL') {
          if (playerMana >= 25) { // Updated cost to 25
              onSkill('HEAL');
              setHealTriggered(true);
              setTimeout(() => setHealTriggered(false), 1500);
          } else {
              return; 
          }
      }
      setSelectedAction(action);
      if (action !== 'HEAL') onSkill(action);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col p-6 pointer-events-auto overflow-hidden">
       {/* Top Bar */}
       <header className="flex justify-between items-start mb-6 z-20 border-b border-white/10 pb-4">
           <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-1">
                   <div className="w-2 h-2 bg-critical rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                   <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">TACTICAL PHASE</p>
               </div>
               <h2 className="text-3xl font-display font-bold text-white uppercase tracking-wide">{enemyName}</h2>
           </div>
           
           <div className="text-right">
               <p className="text-[9px] text-primary/60 font-mono uppercase mb-1">TIME REMAINING</p>
               <div className="text-6xl font-display font-bold text-white tabular-nums leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                   {secondsRemaining}<span className="text-2xl align-top text-gray-600 font-normal ml-1">s</span>
               </div>
           </div>
       </header>

       {/* Healing Feedback Overlay */}
       <AnimatePresence>
           {healTriggered && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 1.1 }}
                 className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm"
               >
                   <div className="bg-green-950/90 border-2 border-green-500 px-10 py-8 rounded-sm shadow-[0_0_50px_rgba(34,197,94,0.6)] text-center">
                       <span className="material-symbols-outlined text-6xl text-green-400 mb-4 animate-bounce">favorite</span>
                       <p className="text-green-400 font-display font-black text-6xl tracking-tighter drop-shadow-md">
                           +30 HP
                       </p>
                       <p className="text-green-200/80 font-mono text-xs tracking-[0.3em] mt-4 uppercase">Vital Signs Stabilized</p>
                   </div>
               </motion.div>
           )}
       </AnimatePresence>

       <div className="flex-1 relative z-10 w-full max-w-lg mx-auto flex flex-col">
           
           <AnimatePresence mode="wait">
               {!selectedAction ? (
                   /* --- CARD DEALER VIEW --- */
                   <motion.div 
                        key="dealer"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col h-full"
                   >
                       {/* Player Status Bar */}
                       <div className="grid grid-cols-2 gap-4 mb-8">
                           <div className="bg-white/5 border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20"></div>
                               <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">INTEGRITY</span>
                               <div className="flex items-baseline gap-1">
                                   <span className="text-3xl font-display font-bold text-white">{playerHP}</span>
                                   <span className="text-xs text-gray-600 font-bold">/100</span>
                               </div>
                           </div>
                           <div className="bg-blue-950/20 border border-blue-500/20 p-4 flex flex-col justify-between relative overflow-hidden group">
                               <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/50 shadow-[0_0_10px_#3b82f6]"></div>
                               <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1 group-hover:text-blue-300 transition-colors">MANA FLUX</span>
                               <div className="flex items-baseline gap-1">
                                   <span className="text-3xl font-display font-bold text-blue-400">{Math.floor(playerMana)}</span>
                                   <span className="text-xs text-blue-500/50 font-bold">%</span>
                               </div>
                           </div>
                       </div>

                       <p className="text-center text-[10px] text-gray-500 font-mono uppercase tracking-[0.3em] mb-6">
                           Select Combat Protocol
                       </p>

                       <div className="flex-1 flex flex-col gap-4 justify-start overflow-y-auto no-scrollbar pb-4">
                           {/* Option A: HEAL (Green) */}
                           <TacticalCard 
                                type="GREEN"
                                title="POTION OF BREATH"
                                icon="spa"
                                cost={25}
                                effect="+30 HP • PURGE DEBUFFS"
                                desc="Instantly restores 30 Health. Removes Stiffness and other Debuffs."
                                disabled={playerMana < 25}
                                onClick={() => handleAction('HEAL')}
                                index={0}
                           />

                           {/* Option B: PROVOKE (Red) */}
                           <TacticalCard 
                                type="RED"
                                title="NEURAL OVERRIDE"
                                icon="favorite"
                                cost={0}
                                effect="+10 MANA • 2X REWARDS"
                                desc="Instant Mana recharge. High Risk: Bad form drains HP."
                                onClick={() => handleAction('PROVOKE')}
                                index={1}
                           />

                           {/* Option C: MOBILITY (Blue) */}
                           <TacticalCard 
                                type="BLUE"
                                title="JOINT LUBRICATION"
                                icon="accessibility_new"
                                cost={0}
                                effect="+10 HP • EASY FORM"
                                desc="Widens perfect form window by 15%. Prevents Recoil damage from bad reps."
                                onClick={() => handleAction('STRETCH')}
                                index={2}
                           />
                       </div>
                   </motion.div>
               ) : (
                   /* --- ACTIVE ACTION VIEW --- */
                   <motion.div
                        key="action"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="h-full flex flex-col"
                   >
                        {/* Protocol Header */}
                        <div className="flex items-center gap-3 mb-4 opacity-50">
                             <div className="h-px flex-1 bg-white/20"></div>
                             <span className="text-[10px] font-mono tracking-[0.2em] text-white uppercase">EXECUTING PROTOCOL</span>
                             <div className="h-px flex-1 bg-white/20"></div>
                        </div>

                        {/* Content Area - Flex Grow to center */}
                        <div className="flex-1 relative flex items-center justify-center">
                            {selectedAction === 'HEAL' && <BreathingCircle />}
                            {selectedAction === 'PROVOKE' && <BloodlustHype />}
                            {selectedAction === 'STRETCH' && <MobilityChecklist />}
                        </div>
                   </motion.div>
               )}
           </AnimatePresence>
       </div>
    </div>
  );
};

export default TacticalOverlay;
