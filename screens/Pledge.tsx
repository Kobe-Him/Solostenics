import React, { useState } from 'react';
import CyberButton from '../components/ui/CyberButton';
import { motion } from 'framer-motion';

interface PledgeProps {
  onNext: () => void;
}

const Pledge: React.FC<PledgeProps> = ({ onNext }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="relative flex flex-col h-full w-full bg-[#050505] p-6">
       <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px]"></div>
       
       <header className="z-10 w-full flex justify-end items-center pb-8">
          <div className="flex items-center gap-2 text-primary/60">
             <span className="material-symbols-outlined text-sm animate-pulse">lock</span>
             <span className="font-mono text-[10px] tracking-widest">ENCRYPTED_CHANNEL</span>
          </div>
       </header>

       <main className="relative z-10 flex flex-col items-start justify-center flex-1 w-full gap-8">
          
          <div className="space-y-4">
             <motion.h1 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="font-display font-bold text-5xl text-white uppercase leading-[0.85]"
             >
                The<br/>Only<br/>Way<br/>Is<br/><span className="text-primary text-6xl">Through</span>.
             </motion.h1>
             <div className="w-24 h-2 bg-primary"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-sm text-gray-400 leading-relaxed border-l-2 border-white/20 pl-4"
          >
             <p className="mb-4">
                "I am not asking for your money. Money is cheap."
             </p>
             <p className="text-white font-bold">
                "I am asking for your sweat. Your pain. Your absolute refusal to stay the same."
             </p>
          </motion.div>

          <div className="w-full mt-4 bg-[#0a0a0a] border border-primary/30 p-4">
             <label className="flex items-start gap-x-4 cursor-pointer group">
                <div className="relative flex items-center">
                   <input 
                     type="checkbox" 
                     checked={agreed}
                     onChange={(e) => setAgreed(e.target.checked)}
                     className="appearance-none w-6 h-6 border border-primary bg-transparent checked:bg-primary transition-all"
                   />
                   {agreed && <span className="material-symbols-outlined text-black absolute inset-0 text-sm pointer-events-none">check</span>}
                </div>
                <div>
                   <p className="font-display text-xl font-bold text-white uppercase tracking-wide group-hover:text-primary transition-colors">
                      I Pledge to Grind.
                   </p>
                   <p className="text-[10px] text-gray-500 font-mono mt-1">
                      By checking this, you accept that the System will not be kind.
                   </p>
                </div>
             </label>
          </div>
       </main>

       <div className="z-20 w-full pt-8">
          <CyberButton onClick={onNext} disabled={!agreed} icon="door_open">
             ENTER THE DUNGEON
          </CyberButton>
       </div>
    </div>
  );
};

export default Pledge;