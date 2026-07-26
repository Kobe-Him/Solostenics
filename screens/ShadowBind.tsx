
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface ShadowBindProps {
  onNext: (data: Partial<UserData>) => void;
  onHatch?: () => void;
}

const ShadowBind: React.FC<ShadowBindProps> = ({ onNext, onHatch }) => {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col h-full p-6 relative overflow-hidden">
       {/* Dark overlay for atmosphere */}
       <div className="absolute inset-0 bg-black/80 z-0"></div>

       <header className="relative z-10 flex justify-between items-start mb-4 opacity-80">
          <div className="flex flex-col">
            <p className="text-primary/70 text-xs font-mono animate-pulse">// SOUL_LINK_PROTOCOL</p>
            <p className="text-primary/50 text-[10px] font-mono">UNSTABLE_CONNECTION</p>
          </div>
          <span className="material-symbols-outlined text-primary/60 text-sm animate-spin">settings_suggest</span>
       </header>

       <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
          
          {/* Shadow Entity Visual - DRAGON EGG */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="relative w-full max-w-[280px] aspect-square mb-8 flex items-center justify-center group"
          >
             {/* Glow Effect */}
             <div className="absolute inset-0 bg-purple-900/40 blur-3xl animate-pulse"></div>
             
             {/* The Egg Image */}
             <motion.div 
                className="relative z-10 w-48 h-64 overflow-hidden rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_30px_rgba(100,0,255,0.3)] border border-white/10"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             >
                <img 
                  src="https://images.unsplash.com/photo-1610484916962-4dc97573f324?q=80&w=1000&auto=format&fit=crop" 
                  alt="Dark Egg"
                  className="w-full h-full object-cover filter brightness-50 contrast-125 hue-rotate-15"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Cracks/Energy */}
                <div className="absolute inset-0 opacity-50 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/cracked-ground.png')]"></div>
             </motion.div>

             {/* Connection lines */}
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary to-transparent z-0"></div>

             {/* MYSTERY PRIZE TRIGGER - SPEECH BUBBLE STYLE */}
             {onHatch && (
                 <motion.button
                    onClick={onHatch}
                    initial={{ opacity: 0, scale: 0, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 -right-2 z-50 cursor-pointer w-32 focus:outline-none"
                 >
                    <div className="bg-black/90 border-2 border-primary p-3 shadow-[0_0_20px_rgba(0,255,255,0.4)] relative">
                        {/* Connecting Arrow */}
                        <div className="absolute top-6 -left-2 w-3 h-3 bg-black border-l-2 border-b-2 border-primary transform rotate-45"></div>
                        
                        <div className="flex flex-col items-start text-left">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-yellow-400 text-sm animate-bounce">auto_awesome</span>
                                <span className="text-[10px] font-bold text-white uppercase leading-none">MYSTERY</span>
                            </div>
                            <p className="font-display font-bold text-sm text-primary leading-tight uppercase animate-pulse">
                                Hatch Me
                            </p>
                            <div className="h-px w-full bg-white/20 my-1"></div>
                            <p className="font-mono text-[8px] text-gray-400 uppercase tracking-wider">
                                [ CLICK TO BATTLE ]
                            </p>
                        </div>
                    </div>
                 </motion.button>
             )}
          </motion.div>

          <div className="w-full border-l-2 border-primary pl-4 py-3 bg-primary/5 mb-8 backdrop-blur-sm relative z-10">
             <p className="text-white text-sm font-mono leading-relaxed">
               I am your <span className="text-primary font-bold shadow-glow">Shadow</span>.
               <br/>
               If you grow weak, I fade.
               <br/>
               If you quit, I <span className="text-critical font-bold">die</span>.
             </p>
          </div>
       </div>

       <div className="relative z-10 mt-auto pb-4 w-full">
          <div className="flex flex-col gap-2 mb-6 group">
             <label className="text-primary font-display text-xl tracking-widest font-bold uppercase drop-shadow-glow">
                [ NAME YOUR SHADOW ]
             </label>
             <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ENTER_DESIGNATION_"
                  className="w-full bg-[#0a0a0a] border border-primary/50 text-primary placeholder:text-primary/20 p-4 text-lg font-mono focus:border-primary focus:ring-0 focus:outline-none focus:shadow-glow transition-all uppercase"
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={12}
                />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary"></div>
             </div>
          </div>

          <CyberButton 
            onClick={() => name && onNext({ shadowName: name })} 
            disabled={!name}
            icon="fingerprint"
          >
            [ BIND SOUL ]
          </CyberButton>
       </div>
    </div>
  );
};

export default ShadowBind;
