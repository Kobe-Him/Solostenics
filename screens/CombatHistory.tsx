
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface CombatHistoryProps {
  onNext: (data: Partial<UserData>) => void;
}

const CombatHistory: React.FC<CombatHistoryProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<'ROOKIE' | 'VETERAN' | 'ACTIVE' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelect = (val: 'ROOKIE' | 'VETERAN' | 'ACTIVE') => {
    setSelected(val);
    if (val === 'ROOKIE') setFeedback("Fresh meat. Good. No bad habits.");
    if (val === 'VETERAN') setFeedback("Failure is data. We won't fail again.");
    if (val === 'ACTIVE') setFeedback("We will break your form to build a better one.");
  };

  const handleNext = () => {
    if (selected) onNext({ experience: selected });
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-background-dark">
      
      {/* Header Area */}
      <div className="flex-shrink-0 px-6 pt-6 pb-2">
          <div className="relative group p-3 border-l-2 border-primary bg-black/20">
             <h1 className="font-display text-3xl font-bold text-white tracking-tight leading-none mb-1">
                COMBAT<br/>HISTORY
             </h1>
             <p className="font-mono text-[10px] text-primary/80 leading-relaxed">
                &gt; QUERY: EXPERIENCE WITH SYSTEM?
             </p>
          </div>
      </div>

      {/* Content Area - Flex Grow to Fill */}
      <div className="flex-1 px-6 flex flex-col justify-center gap-3 w-full">
         {/* ROOKIE */}
         <button 
           onClick={() => handleSelect('ROOKIE')}
           className={`relative p-3 flex items-center gap-3 transition-all duration-200 border bg-[#0a0a0a] group text-left
             ${selected === 'ROOKIE' 
                ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                : 'border-primary/30 hover:bg-[#0f1515] hover:border-primary/60'}
           `}
         >
            <div className={`w-3 h-3 border flex-shrink-0 ${selected === 'ROOKIE' ? 'bg-primary border-primary' : 'border-primary/60'}`}></div>
            <div className="flex flex-col text-left">
               <span className={`font-display font-bold text-base tracking-wide ${selected === 'ROOKIE' ? 'text-white' : 'text-gray-300'}`}>ROOKIE</span>
               <span className="font-mono text-[9px] text-white/50 tracking-wider">0 XP // FRESH MEAT</span>
            </div>
         </button>

         {/* VETERAN */}
         <button 
           onClick={() => handleSelect('VETERAN')}
           className={`relative p-3 flex items-center gap-3 transition-all duration-200 border bg-[#0a0a0a] group text-left
             ${selected === 'VETERAN' 
                ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                : 'border-primary/30 hover:bg-[#0f1515] hover:border-primary/60'}
           `}
         >
            <div className={`w-3 h-3 border flex-shrink-0 ${selected === 'VETERAN' ? 'bg-primary border-primary' : 'border-primary/60'}`}></div>
            <div className="flex flex-col text-left">
               <span className={`font-display font-bold text-base tracking-wide ${selected === 'VETERAN' ? 'text-white' : 'text-gray-300'}`}>VETERAN</span>
               <span className="font-mono text-[9px] text-critical tracking-wider font-bold">[ FAILED BEFORE ]</span>
            </div>
         </button>

         {/* ACTIVE */}
         <button 
           onClick={() => handleSelect('ACTIVE')}
           className={`relative p-3 flex items-center gap-3 transition-all duration-200 border bg-[#0a0a0a] group text-left
             ${selected === 'ACTIVE' 
                ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                : 'border-primary/30 hover:bg-[#0f1515] hover:border-primary/60'}
           `}
         >
            <div className={`w-3 h-3 border flex-shrink-0 ${selected === 'ACTIVE' ? 'bg-primary border-primary' : 'border-primary/60'}`}></div>
            <div className="flex flex-col text-left">
               <span className={`font-display font-bold text-base tracking-wide ${selected === 'ACTIVE' ? 'text-white' : 'text-gray-300'}`}>ACTIVE</span>
               <span className="font-mono text-[9px] text-primary tracking-wider">TRAINING IN PROGRESS</span>
            </div>
         </button>
      
         {/* Feedback Area - Fixed Height to prevent jumps */}
         <div className="h-12 mt-2 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {feedback && (
                <motion.div 
                  key={feedback}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="w-full p-2 border-l-2 border-primary bg-primary/5"
                >
                  <p className="font-mono text-[10px] text-white leading-tight">
                    <span className="text-primary">&gt; SYS:</span> "{feedback}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
      
      {/* Footer */}
      <div className="flex-shrink-0 p-4 bg-background-dark border-t border-primary/20 z-50">
         <CyberButton onClick={handleNext} disabled={!selected} icon="input" fullWidth className="!h-12 text-sm">
            CONFIRM INPUT
         </CyberButton>
      </div>
    </div>
  );
};

export default CombatHistory;
