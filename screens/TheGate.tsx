import React from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';

interface TheGateProps {
  onNext: () => void;
}

const TheGate: React.FC<TheGateProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full p-6 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2323_1px,transparent_1px),linear-gradient(to_bottom,#0f2323_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* Top Status */}
      <header className="flex items-center justify-between py-4 z-20 w-full uppercase text-[10px] tracking-widest text-primary/80 mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">wifi</span>
          <span>NET: -85dBm</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="animate-pulse text-critical">REC ●</span>
          <span>PWR: 98%</span>
        </div>
      </header>

      {/* Main Visual - CSS Cyber Gate */}
      <div className="relative group w-full aspect-square mb-8 border border-primary/30 bg-black overflow-hidden flex items-center justify-center">
        {/* Animated Tunnel Grid */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className="absolute border border-primary/30"
                    style={{ width: `${i * 20}%`, height: `${i * 20}%` }}
                    animate={{ 
                        scale: [1, 2],
                        opacity: [0.1, 1, 0]
                    }}
                    transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 0.5 
                    }}
                />
            ))}
            <div className="absolute w-1 h-full bg-primary/20 blur-sm"></div>
            <div className="absolute h-1 w-full bg-primary/20 blur-sm"></div>
        </div>

        {/* Lock Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-black/90 border border-primary p-6 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.2)]"
           >
              <span className="material-symbols-outlined text-5xl text-primary animate-pulse">lock</span>
           </motion.div>
        </div>
      </div>

      {/* Text */}
      <div className="w-full space-y-4 text-center mb-auto">
         <motion.h1 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="font-display text-4xl font-bold tracking-widest text-white uppercase leading-none drop-shadow-[2px_0_rgba(255,0,60,1)]"
         >
            SIGNAL DETECTED...
         </motion.h1>
         <div className="h-[1px] w-24 bg-primary mx-auto my-3"></div>
         <p className="font-mono text-primary text-sm tracking-widest opacity-80">
            &gt; A NEW PLAYER HAS ENTERED.
         </p>
      </div>

      {/* Button */}
      <CyberButton onClick={onNext} icon="arrow_forward_ios">
         OPEN THE GATE
      </CyberButton>
    </div>
  );
};

export default TheGate;