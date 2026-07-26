import React from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';

interface RealityCheckProps {
  onNext: () => void;
}

const RealityCheck: React.FC<RealityCheckProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full p-6">
      <header className="flex justify-between items-center border-b border-primary/20 pb-4 mb-6">
        <h1 className="text-2xl font-display font-bold uppercase text-white tracking-widest">Projected Growth</h1>
        <div className="text-[10px] text-critical font-bold animate-pulse">REC ●</div>
      </header>

      {/* Stats Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="border border-primary/40 bg-primary/5 p-4 relative"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
          <p className="text-[10px] text-primary/70 mb-1 uppercase tracking-wider">Current Status</p>
          <p className="text-3xl font-display font-bold text-critical animate-pulse">RANK E</p>
          <p className="text-[9px] text-critical/80 mt-1 uppercase">&gt; FAILURE STATE</p>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 0.5, y: 0 }} // Dimmed target
           transition={{ delay: 0.4 }}
           className="border border-primary/40 bg-primary/5 p-4 relative"
        >
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
          <p className="text-[10px] text-primary/70 mb-1 uppercase tracking-wider">Target (90d)</p>
          <p className="text-3xl font-display font-bold text-primary">RANK C</p>
          <p className="text-[9px] text-primary/80 mt-1 uppercase">&gt; ACCEPTABLE</p>
        </motion.div>
      </div>

      {/* Chart Visualization */}
      <div className="flex-1 relative border-x border-primary/20 mb-6 min-h-[150px]">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 150">
           {/* Grid */}
           <line x1="0" y1="37" x2="300" y2="37" stroke="#00FFFF" strokeOpacity="0.1" strokeDasharray="4" />
           <line x1="0" y1="75" x2="300" y2="75" stroke="#00FFFF" strokeOpacity="0.1" strokeDasharray="4" />
           <line x1="0" y1="112" x2="300" y2="112" stroke="#00FFFF" strokeOpacity="0.1" strokeDasharray="4" />
           
           {/* Graph Line Animation */}
           <motion.path 
             d="M0 130 L300 40"
             fill="none"
             stroke="#00FFFF"
             strokeWidth="2"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
           />
           
           {/* Fill Area */}
           <motion.path 
             d="M0 130 L300 40 L300 150 L0 150 Z"
             fill="rgba(0, 255, 255, 0.1)"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 0.5 }}
           />

           {/* Points */}
           <circle cx="0" cy="130" r="3" fill="#FF003C" />
           <circle cx="300" cy="40" r="3" fill="#00FFFF" />
        </svg>
        <div className="absolute bottom-0 w-full flex justify-between px-2 py-1 text-[9px] font-mono text-primary/60 bg-primary/5">
           <span>TODAY</span>
           <span>30D</span>
           <span>60D</span>
           <span className="text-primary font-bold">90D</span>
        </div>
      </div>

      {/* Message */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="bg-panel border-l-2 border-critical p-4 mb-8 font-mono text-sm leading-relaxed"
      >
        <p className="text-white mb-2"><span className="text-primary mr-2">&gt;</span>SYSTEM ANALYSIS: <span className="text-critical font-bold">S-RANK IS YEARS AWAY.</span></p>
        <p className="text-white mb-2"><span className="text-primary mr-2">&gt;</span>DO NOT BE DELUSIONAL.</p>
        <p className="text-white"><span className="text-primary mr-2">&gt;</span>C-RANK IS ACHIEVABLE IN 90 DAYS.</p>
      </motion.div>

      <div className="mt-auto">
        <CyberButton onClick={onNext} variant="primary" icon="check_box_outline_blank">Acknowledge Reality</CyberButton>
        <p className="text-center text-[9px] text-primary/30 mt-3 tracking-widest uppercase">By acknowledging, you accept the pain.</p>
      </div>
    </div>
  );
};

export default RealityCheck;
