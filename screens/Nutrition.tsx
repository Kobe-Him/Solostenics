import React, { useState } from 'react';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface NutritionProps {
  onNext: (data: Partial<UserData>) => void;
}

const Nutrition: React.FC<NutritionProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<'COOK' | 'RATIONS' | 'SCAVENGE' | null>(null);

  const handleNext = () => {
    if (selected) onNext({ nutrition: selected });
  };

  const Option = ({ id, label, sub, desc, color }: any) => (
    <label className="group cursor-pointer relative w-full">
      <input 
        type="radio" 
        name="nutrition" 
        className="peer sr-only" 
        onChange={() => setSelected(id)}
        checked={selected === id}
      />
      <div className={`
        relative flex items-center justify-between border p-5 bg-[#080808] transition-all
        ${selected === id ? 'border-primary shadow-glow' : 'border-white/20 hover:border-white/50'}
      `}>
         {/* Corner Accents */}
         <div className={`absolute -left-[1px] -top-[1px] w-2 h-2 border-l border-t border-primary ${selected === id ? 'opacity-100' : 'opacity-0'}`}></div>
         <div className={`absolute -right-[1px] -bottom-[1px] w-2 h-2 border-r border-b border-primary ${selected === id ? 'opacity-100' : 'opacity-0'}`}></div>
         
         <div className="flex flex-col gap-1 z-10">
            <span className={`font-display font-bold text-xl tracking-wider transition-colors ${selected === id ? 'text-primary' : 'text-white'}`}>{label}</span>
            <span className={`font-mono text-xs tracking-tight uppercase ${color}`}>{sub}</span>
         </div>
         
         {/* Visual Bar */}
         <div className="h-10 w-16 border-l border-white/10 flex items-center justify-end gap-1 pl-4 opacity-50">
            <div className="h-full w-1 bg-white/20"></div>
            <div className="h-3/4 w-1 bg-white/40"></div>
            <div className={`h-1/2 w-1 ${id === 'RATIONS' ? 'bg-critical' : 'bg-primary'}`}></div>
         </div>
      </div>
    </label>
  );

  return (
    <div className="flex flex-col h-full bg-[#050505]">
      <header className="w-full p-6 border-b border-[#1a1a1a] flex justify-between items-end">
         <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <span className="material-symbols-outlined text-primary text-sm animate-pulse">terminal</span>
               <span className="text-[10px] text-primary/70 tracking-widest font-mono">SYS.V.8.0.1</span>
            </div>
            <h1 className="font-display font-bold text-3xl tracking-widest text-white leading-none uppercase">Nutrition Source</h1>
         </div>
         <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-critical font-mono block mb-1">REQ_INPUT</span>
            <div className="h-2 w-2 bg-critical animate-ping"></div>
         </div>
      </header>

      <main className="flex-1 flex flex-col justify-center p-6 gap-6 relative">
         <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
         <div className="absolute right-6 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
         
         <div className="mb-4">
            <p className="font-mono text-xs text-white/60 uppercase tracking-widest">&gt; Identify fuel intake for analysis_</p>
         </div>

         <Option id="COOK" label="COOK AT BASE" sub="[HOME_PREP]" color="text-primary/60" />
         <Option id="RATIONS" label="RATIONS" sub="[FAST_FOOD]" color="text-critical/60" />
         <Option id="SCAVENGE" label="SCAVENGE" sub="[SNACKS_MISC]" color="text-white/40" />
      </main>

      <footer className="p-6 border-t border-[#1a1a1a]">
         <div className="flex justify-between items-center text-[10px] text-white/30 font-mono mb-4">
            <span>MEM: 64TB</span>
            <span>BAT: 89%</span>
            <span>NET: SECURE</span>
         </div>
         <CyberButton onClick={handleNext} disabled={!selected} icon="data_usage">AWAITING SELECTION</CyberButton>
      </footer>
    </div>
  );
};

export default Nutrition;
