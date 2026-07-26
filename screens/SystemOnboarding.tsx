import React from 'react';
import CyberButton from '../components/ui/CyberButton';

interface SystemOnboardingProps {
  onNext: () => void;
}

const SystemOnboarding: React.FC<SystemOnboardingProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark text-white p-6 relative overflow-hidden">
      {/* Background and Scanlines */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[size:100%_4px]"></div>
      
      <header className="flex items-center justify-between pb-6 border-b border-primary/20 relative z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl animate-pulse">terminal</span>
          <div className="flex flex-col">
            <h1 className="font-display font-bold text-2xl tracking-widest text-white leading-none">SYSTEM TUTORIAL</h1>
            <span className="font-mono text-[10px] text-primary/60 tracking-tighter">V.1.0.4 // INIT_SEQUENCE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center gap-6 relative z-10 py-6">
         {/* Mechanic 1 */}
         <div className="group relative bg-panel p-4 border border-primary/30 hover:border-primary transition-colors">
            <div className="absolute -top-px -left-px w-2 h-2 border-l border-t border-primary"></div>
            <div className="absolute -bottom-px -right-px w-2 h-2 border-r border-b border-primary"></div>
            <div className="flex gap-4">
               <div className="p-3 bg-primary/10 flex items-center justify-center h-12 w-12 border border-primary/20">
                  <span className="material-symbols-outlined text-primary">visibility</span>
               </div>
               <div>
                  <h3 className="font-display font-bold text-lg text-white">AI Vision Tracks Reps</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">System validates form integrity. Cheating results in penalty.</p>
               </div>
            </div>
         </div>

         {/* Mechanic 2 */}
         <div className="group relative bg-panel p-4 border border-primary/30 hover:border-primary transition-colors">
            <div className="absolute -top-px -left-px w-2 h-2 border-l border-t border-primary"></div>
            <div className="absolute -bottom-px -right-px w-2 h-2 border-r border-b border-primary"></div>
            <div className="flex gap-4">
               <div className="p-3 bg-primary/10 flex items-center justify-center h-12 w-12 border border-primary/20">
                  <span className="material-symbols-outlined text-primary">bolt</span>
               </div>
               <div>
                  <h3 className="font-display font-bold text-lg text-white">Earn Stats for Sweat</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">Physical exertion converts to digital currency. Grind required.</p>
               </div>
            </div>
         </div>

         {/* Mechanic 3 */}
         <div className="group relative bg-panel p-4 border border-critical/30 hover:border-critical transition-colors">
            <div className="absolute -top-px -left-px w-2 h-2 border-l border-t border-critical"></div>
            <div className="absolute -bottom-px -right-px w-2 h-2 border-r border-b border-critical"></div>
            <div className="flex gap-4">
               <div className="p-3 bg-critical/10 flex items-center justify-center h-12 w-12 border border-critical/20">
                  <span className="material-symbols-outlined text-critical">pets</span>
               </div>
               <div>
                  <h3 className="font-display font-bold text-lg text-white">Level Up Your Pet</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">Failure to train results in entity degradation. Do not fail.</p>
               </div>
            </div>
         </div>
      </main>

      <footer className="pt-4 relative z-10">
        <CyberButton onClick={onNext} icon="check_box_outline_blank">SYSTEM UNDERSTOOD</CyberButton>
      </footer>
    </div>
  );
};

export default SystemOnboarding;
