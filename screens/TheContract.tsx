import React, { useState } from 'react';
import CyberButton from '../components/ui/CyberButton';

interface TheContractProps {
  onNext: () => void;
}

const TheContract: React.FC<TheContractProps> = ({ onNext }) => {
  const [selectedDay, setSelectedDay] = useState<7 | 14 | 30>(7);

  const getObjectiveText = () => {
    if (selectedDay === 7) return "Maintain streak for 7 days to unlock Iron Supply Crate. Contains basic calisthenics gear.";
    if (selectedDay === 14) return "Survive 14 days of hell. Unlocks +10 Stat Points to distribute into Strength or Agility.";
    if (selectedDay === 30) return "Complete the Awakening Month. Rewards you with the Shadow Dagger (Exclusive Cosmetic Weapon).";
    return "";
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-primary font-mono relative overflow-x-hidden p-4 pt-8">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,249,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,249,249,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>
      
      {/* Top Bar */}
      <div className="relative z-10 w-full flex items-center justify-between pb-4 border-b border-primary/30 mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">terminal</span>
          <span className="text-xs font-bold tracking-widest opacity-70">ID: USER_01</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary animate-pulse"></div>
          <p className="text-primary text-xs font-bold tracking-widest">SYS: ACTIVE</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* Header */}
        <header className="mb-12 text-center relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/30"></div>
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-primary/30"></div>
          <h1 className="font-display text-4xl font-bold tracking-tighter text-white uppercase mb-2 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
             Consistency<br/>Contract
          </h1>
          <p className="text-xs text-primary/70 tracking-widest uppercase">Protocol: Solostenics_v1.0</p>
        </header>

        {/* Timeline */}
        <section className="w-full mb-8">
          <div className="relative py-4">
            {/* Connective Line */}
            <div className="absolute top-[29px] left-4 right-4 h-[2px] bg-primary/20 z-0"></div>
            {/* Active Progress Line */}
            <div 
              className="absolute top-[29px] left-4 h-[2px] bg-primary shadow-[0_0_8px_rgba(6,249,249,0.8)] z-0 transition-all duration-300"
              style={{ width: selectedDay === 7 ? '15%' : selectedDay === 14 ? '50%' : '100%' }}
            ></div>
            
            <div className="grid grid-cols-3 gap-2 relative z-10">
              {/* Day 7 */}
              <div 
                onClick={() => setSelectedDay(7)}
                className={`flex flex-col items-center group cursor-pointer transition-all ${selectedDay === 7 ? 'opacity-100 scale-105' : 'opacity-60'}`}
              >
                <div className="relative mb-4">
                  <div className={`w-8 h-8 bg-background-dark border flex items-center justify-center shadow-glow ${selectedDay === 7 ? 'border-primary bg-primary/20' : 'border-primary'}`}>
                    <span className="material-symbols-outlined text-[16px] text-white">inventory_2</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg font-bold text-white leading-none mb-1">DAY 07</h3>
                  <p className="text-[10px] leading-tight text-primary/80 font-bold uppercase">Supply Crate</p>
                </div>
              </div>

              {/* Day 14 */}
              <div 
                onClick={() => setSelectedDay(14)}
                className={`flex flex-col items-center group cursor-pointer transition-all ${selectedDay === 14 ? 'opacity-100 scale-105' : 'opacity-60'}`}
              >
                <div className="relative mb-4">
                  <div className={`w-8 h-8 bg-background-dark border flex items-center justify-center shadow-glow ${selectedDay === 14 ? 'border-primary bg-primary/20' : 'border-primary'}`}>
                    <span className="material-symbols-outlined text-[16px] text-white">bolt</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg font-bold text-white leading-none mb-1">DAY 14</h3>
                  <p className="text-[10px] leading-tight text-primary/80 font-bold uppercase">+10 STATS</p>
                </div>
              </div>

              {/* Day 30 */}
              <div 
                onClick={() => setSelectedDay(30)}
                className={`flex flex-col items-center group cursor-pointer transition-all ${selectedDay === 30 ? 'opacity-100 scale-105' : 'opacity-60'}`}
              >
                 <div className="relative mb-4">
                  <div className={`w-8 h-8 bg-background-dark border flex items-center justify-center shadow-glow ${selectedDay === 30 ? 'border-primary bg-primary/20' : 'border-primary'}`}>
                    <span className="material-symbols-outlined text-[16px] text-white">swords</span>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-primary"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg font-bold text-white leading-none mb-1">DAY 30</h3>
                  <p className="text-[10px] leading-tight text-primary/80 font-bold uppercase">Shadow WPN</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Box */}
          <div className="mt-8 border-l-2 border-primary/30 pl-4 py-3 relative bg-primary/5 min-h-[100px]">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-[2px] text-[18px]">info</span>
              <div>
                <p className="text-xs text-primary font-bold mb-1">OBJECTIVE: DAY {selectedDay}</p>
                <p className="text-sm text-white font-mono leading-relaxed">
                   {getObjectiveText()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Warning */}
        <div className="mb-8 border border-critical/30 bg-critical/5 p-3 flex items-center gap-3 w-full">
          <span className="material-symbols-outlined text-critical animate-pulse text-[20px]">warning</span>
          <p className="text-critical text-xs font-bold tracking-tight">
             WARNING: MISSED LOGIN VOIDS CONTRACT.<br/>
             STREAK RESET PENALTY APPLIES.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 w-full">
         <CyberButton onClick={onNext} icon="fingerprint">
            UNDERSTOOD
         </CyberButton>
         <div className="flex justify-between mt-2 px-1">
           <div className="h-2 w-2 border-b border-l border-primary"></div>
           <div className="text-[10px] text-primary/40 font-mono self-end">SYS_READY</div>
           <div className="h-2 w-2 border-b border-r border-primary"></div>
         </div>
      </footer>
    </div>
  );
};

export default TheContract;