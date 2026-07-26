
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import { GameService } from '../services/GameService';

interface BootSequenceProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, onSkip }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      // Phase 0: Context (Walking)
      await new Promise(r => setTimeout(r, 2500));
      setPhase(1); // Truck Incoming (Longer build up)
      
      // Phase 1: Impact Time (The Crash)
      await new Promise(r => setTimeout(r, 2500)); 
      setPhase(2); // Glitch/Death
      
      // Phase 2: Reboot
      await new Promise(r => setTimeout(r, 3000));
      setPhase(3); // Awakening
    };
    sequence();
  }, []);

  const handleWipe = async () => {
      if (window.confirm("WARNING: This will permanently delete your character save file. Proceed?")) {
          await GameService.resetGame();
          window.location.reload();
      }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-center font-mono overflow-hidden">
      
      {/* DEV BUTTONS */}
      <div className="absolute top-6 right-6 z-[100] flex gap-2">
          {onSkip && (
            <button 
              onClick={onSkip}
              className="border border-white/10 bg-black/50 text-white/30 text-[9px] px-3 py-1 hover:bg-white/10 hover:text-primary hover:border-primary/50 transition-all uppercase tracking-widest font-mono backdrop-blur-md cursor-pointer flex items-center gap-2 group"
            >
              <span>[ SKIP ]</span>
              <span className="material-symbols-outlined text-[10px] group-hover:text-primary transition-colors">fast_forward</span>
            </button>
          )}
          <button 
              onClick={handleWipe}
              className="border border-red-900/30 bg-black/50 text-red-700/50 text-[9px] px-3 py-1 hover:bg-red-900/20 hover:text-red-500 hover:border-red-500/50 transition-all uppercase tracking-widest font-mono backdrop-blur-md cursor-pointer flex items-center gap-2"
            >
              <span>[ WIPE SAVE ]</span>
              <span className="material-symbols-outlined text-[10px]">delete_forever</span>
          </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE 0: The Setup */}
        {phase === 0 && (
          <motion.div
            key="p0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 p-6"
          >
            <p className="text-gray-500 text-sm mb-2">DATE: TODAY</p>
            <p className="text-gray-500 text-sm">TIME: 11:59 PM</p>
            <motion.h2 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="text-white text-xl font-display uppercase tracking-widest mt-8"
            >
              Another wasted day.
            </motion.h2>
             <motion.p
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.5 }}
               className="text-primary/40 text-xs mt-4"
             >
                (You look at your phone while crossing the street...)
             </motion.p>
          </motion.div>
        )}

        {/* PHASE 1: The Truck (Longer, Clearer Approach) */}
        {phase === 1 && (
          <motion.div
            key="p1"
            className="absolute inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
          >
             {/* Sound Effects Text */}
             <div className="absolute z-40 flex flex-col items-center gap-4">
                 <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: 1.2 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-yellow-500 font-display font-bold text-4xl uppercase tracking-tighter"
                 >
                    SCREEEECH!
                 </motion.h1>
                 <motion.h1
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 1], scale: 2 }}
                    transition={{ duration: 0.3, delay: 1.5 }}
                    className="text-critical font-display font-bold text-6xl uppercase tracking-tighter"
                 >
                    HONK!
                 </motion.h1>
             </div>

             {/* The Headlights - Approaching from Z-depth */}
             <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 40, opacity: 1 }}
                transition={{ duration: 2.2, ease: "easeIn" }} // Slow start, fast finish
                className="flex gap-8 items-center"
             >
                {/* Left Light */}
                <div className="w-20 h-20 rounded-full bg-[#ffffee] shadow-[0_0_80px_30px_rgba(255,255,200,0.9)] blur-sm"></div>
                {/* Right Light */}
                <div className="w-20 h-20 rounded-full bg-[#ffffee] shadow-[0_0_80px_30px_rgba(255,255,200,0.9)] blur-sm"></div>
             </motion.div>

             {/* White Out Flash */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 0, 1] }}
               transition={{ duration: 2.2, times: [0, 0.95, 1] }}
               className="absolute inset-0 bg-white z-50"
             ></motion.div>
          </motion.div>
        )}

        {/* PHASE 2: The Glitch */}
        {phase === 2 && (
          <motion.div
            key="p2"
            initial={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center bg-black relative z-10"
          >
             <motion.div 
               animate={{ x: [-2, 2, -2, 2, 0], opacity: [1, 0.5, 1] }}
               transition={{ duration: 0.2, repeat: Infinity }}
               className="text-critical text-6xl font-bold font-display"
             >
                DEAD
             </motion.div>
             <div className="mt-8 font-mono text-xs text-primary/50">
                <p>Initialize_Soul_Transfer...</p>
             </div>
          </motion.div>
        )}

        {/* PHASE 3: The Awakening */}
        {phase === 3 && (
          <motion.div
            key="p3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-md space-y-8 relative z-10 px-6"
          >
            <div className="border border-primary/30 bg-black p-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.05)_50%)] bg-[length:100%_4px]"></div>
               
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2, ease: "easeInOut" }}
                 className="h-1 bg-primary mb-6 shadow-glow"
               ></motion.div>

               <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 leading-none">
                 SYSTEM<br /><span className="text-primary">DETECTED</span>
               </h1>
               <p className="text-primary/70 text-sm font-mono leading-relaxed mb-6">
                 Congratulations. You have been selected as a Player for the Savage System.
               </p>
               <p className="text-gray-500 text-xs font-mono">
                 &gt; INITIATING_BOOT_SEQUENCE...
               </p>
            </div>

            <motion.div
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 2.5 }}
            >
              <CyberButton onClick={onComplete} icon="power_settings_new" className="animate-pulse">
                Wake Up
              </CyberButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BootSequence;
