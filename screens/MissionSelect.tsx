import React, { useState } from 'react';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface MissionSelectProps {
  onNext: (data: Partial<UserData>) => void;
}

const MissionSelect: React.FC<MissionSelectProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<'STRENGTH' | 'HYPERTROPHY' | 'AGILITY' | null>(null);

  const handleNext = () => {
    if (selected) onNext({ missionClass: selected });
  };

  const Card = ({ id, label, icon, desc }: { id: any, label: string, icon: string, desc: string }) => (
    <button 
      onClick={() => setSelected(id)}
      className={`group w-full relative flex items-center justify-between p-0 bg-transparent focus:outline-none transition-all duration-300`}
    >
      <div className={`absolute inset-0 border bg-black/80 transition-all duration-300 
         ${selected === id ? 'border-primary shadow-glow' : 'border-primary/40 hover:border-primary'}
      `}></div>
      
      <div className="relative w-full flex items-center h-24 px-5 py-4 gap-5 z-10">
        <div className={`flex-shrink-0 w-14 h-14 flex items-center justify-center border 
           ${selected === id ? 'border-primary bg-primary/20' : 'border-primary/30 bg-primary/5'}
        `}>
          <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
        </div>
        <div className="flex-1 flex flex-col items-start text-left">
           <h2 className="text-2xl font-display font-bold tracking-widest text-white group-hover:text-primary transition-colors">{label}</h2>
           <p className="font-mono text-xs text-gray-400 mt-1 uppercase tracking-tight group-hover:text-white transition-colors">{desc}</p>
        </div>
        <div className="h-full flex items-center justify-center">
           <div className={`w-1.5 h-1.5 transform rotate-45 transition-all ${selected === id ? 'bg-primary shadow-glow' : 'bg-primary/30'}`}></div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Background Texture - Reliable Link */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ 
         backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')`,
         backgroundSize: 'cover',
         backgroundPosition: 'center'
      }}></div>

      <div className="relative z-10 p-6 flex flex-col h-full">
         <header className="w-full text-center mb-8">
            <div className="flex justify-between items-center border-b border-primary/30 pb-2 mb-4">
               <span className="font-mono text-[10px] text-primary/70 tracking-widest">SYS.VER.0.9.1</span>
               <span className="font-mono text-[10px] text-critical tracking-widest animate-pulse">NET_UNSTABLE</span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-[0.1em] text-white drop-shadow-glow">
               SELECT MISSION CLASS
            </h1>
         </header>

         <div className="flex flex-col gap-4 flex-1 justify-center">
            <Card id="STRENGTH" label="STRENGTH" icon="swords" desc="Raw Power. Heavy Load." />
            <Card id="HYPERTROPHY" label="HYPERTROPHY" icon="shield" desc="Mass / Size. Volume Focus." />
            <Card id="AGILITY" label="AGILITY" icon="bolt" desc="Shredded / Lean. High Tempo." />
         </div>

         <div className="mt-8 border-t border-primary/20 pt-3">
            <p className="text-center font-mono text-sm text-primary tracking-wider animate-pulse mb-4">
               SYSTEM_AWAITING_INPUT...
            </p>
            <CyberButton onClick={handleNext} disabled={!selected} icon="check">
               CONFIRM CLASS
            </CyberButton>
         </div>
      </div>
    </div>
  );
};

export default MissionSelect;