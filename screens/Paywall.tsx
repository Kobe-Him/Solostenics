
import React from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';

interface PaywallProps {
  onNext: (plan: 'SOLO' | 'HUNTER') => void;
}

const Paywall: React.FC<PaywallProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

       <header className="pt-4 px-4 pb-2 text-center relative z-10 flex-shrink-0">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-2 py-0.5 border border-primary/30 bg-primary/10 rounded-full mb-2"
          >
             <span className="text-[9px] font-mono text-primary tracking-widest uppercase">System_Shop_v1.0</span>
          </motion.div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-wider mb-1 drop-shadow-glow">
             Select Difficulty
          </h1>
          <p className="font-mono text-[10px] text-gray-400 max-w-xs mx-auto leading-tight">
             Choose how you want to survive in the System.
          </p>
       </header>

       {/* Main content - Compact Layout */}
       <div className="flex-1 flex flex-col justify-center gap-3 px-4 pb-4 relative z-10 max-w-md mx-auto w-full">
          
          {/* OPTION 1: HUNTER PASS (Premium) */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative border border-primary bg-[#0f1111] overflow-hidden group hover:shadow-glow transition-all duration-300 flex-shrink-0"
          >
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
             
             {/* Badge */}
             <div className="absolute top-0 right-0 bg-primary text-black font-bold text-[8px] px-2 py-0.5 font-mono tracking-widest">
                RECOMMENDED
             </div>

             <div className="p-4 relative z-10">
                <div className="flex justify-between items-end mb-2">
                   <div>
                      <h2 className="font-display text-xl font-bold text-white tracking-wide italic group-hover:text-primary transition-colors">HUNTER PASS</h2>
                      <p className="font-mono text-[9px] text-primary">OPTIMIZED GROWTH</p>
                   </div>
                   <div className="text-right">
                      <span className="block text-xl font-display font-bold text-white">$9.99</span>
                      <span className="text-[9px] text-gray-500 font-mono">/ MONTH</span>
                   </div>
                </div>

                <div className="w-full h-px bg-primary/30 mb-3"></div>

                <ul className="space-y-1.5 mb-4">
                   <li className="flex items-center gap-2 text-[11px] text-gray-200">
                      <span className="material-symbols-outlined text-primary text-xs">block</span>
                      <span>No Ads <span className="text-gray-500">(Focus Mode)</span></span>
                   </li>
                   <li className="flex items-center gap-2 text-[11px] text-gray-200">
                      <span className="material-symbols-outlined text-primary text-xs">cached</span>
                      <span><span className="text-white font-bold">Extra Spin</span> (Fate)</span>
                   </li>
                   <li className="flex items-center gap-2 text-[11px] text-gray-200">
                      <span className="material-symbols-outlined text-primary text-xs">shield</span>
                      <span><span className="text-white font-bold">Streak Protection</span></span>
                   </li>
                   <li className="flex items-center gap-2 text-[11px] text-gray-200">
                      <span className="material-symbols-outlined text-primary text-xs">palette</span>
                      <span><span className="text-white font-bold">Shadow Skins</span></span>
                   </li>
                   <li className="flex items-center gap-2 text-[11px] text-gray-200">
                      <span className="material-symbols-outlined text-primary text-xs">verified</span>
                      <span><span className="text-white font-bold">"OG Supporter"</span> Badge</span>
                   </li>
                </ul>

                <CyberButton onClick={() => onNext('HUNTER')} variant="primary" fullWidth className="!h-10 text-sm">
                   ACTIVATE SYSTEM
                </CyberButton>
             </div>
          </motion.div>

          {/* OPTION 2: SOLO PASS (Free) */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative border border-white/10 bg-black p-3 opacity-90 transition-all duration-300 group hover:opacity-100 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] flex-shrink-0"
          >
             {/* Subtle White Glow on Hover */}
             <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-colors"></div>

             <div className="flex justify-between items-end mb-2 relative z-10">
                <div>
                   <h2 className="font-display text-lg font-bold text-gray-400 tracking-wide group-hover:text-white transition-colors">SOLO PASS</h2>
                   <p className="font-mono text-[9px] text-gray-600 group-hover:text-gray-400">E-RANK STANDARD</p>
                </div>
                <div className="text-right">
                   <span className="block text-lg font-display font-bold text-gray-400 group-hover:text-white">FREE</span>
                </div>
             </div>

             <div className="w-full h-px bg-white/10 mb-2 relative z-10"></div>

             <ul className="space-y-1 mb-3 relative z-10">
                <li className="flex items-center gap-2 text-[10px] text-gray-400 group-hover:text-gray-300">
                   <span className="material-symbols-outlined text-gray-600 text-xs group-hover:text-white">ad_units</span>
                   <span>Ad-Supported Recovery</span>
                </li>
                <li className="flex items-center gap-2 text-[10px] text-gray-400 group-hover:text-gray-300">
                   <span className="material-symbols-outlined text-gray-600 text-xs group-hover:text-white">warning</span>
                   <span>Manual Streak Maintenance</span>
                </li>
             </ul>

             <div className="relative z-10">
               <button 
                  onClick={() => onNext('SOLO')}
                  className="w-full py-2 border border-white/20 text-gray-500 font-mono text-[10px] font-bold uppercase hover:bg-white/10 hover:text-white hover:border-white/60 transition-all duration-200"
               >
                  ACCEPT SOLO MISSION
               </button>
             </div>
          </motion.div>

          <p className="text-center font-mono text-[8px] text-gray-600 mt-1">
             "The System is fair. Effort is currency."
          </p>
       </div>
    </div>
  );
};

export default Paywall;
