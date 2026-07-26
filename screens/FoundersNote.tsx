import React from 'react';
import CyberButton from '../components/ui/CyberButton';

interface FoundersNoteProps {
  onNext: () => void;
}

const FoundersNote: React.FC<FoundersNoteProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
       {/* Scanline */}
       <div className="absolute inset-0 pointer-events-none opacity-30 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
       
       <header className="w-full flex justify-between items-center px-4 pt-8 pb-2 border-b border-primary/20 bg-[#0a0a0a]/50 backdrop-blur-sm z-20 pl-20">
          <div className="flex items-center gap-2 text-primary text-xs tracking-widest font-mono">
             <span className="w-2 h-2 bg-primary animate-pulse"></span>
             SYS.ONLINE
          </div>
          <div className="text-critical text-xs font-mono tracking-widest border border-critical/30 px-2 py-0.5">
             [SECURE_CH: 001]
          </div>
       </header>

       <main className="flex-1 flex flex-col items-center justify-start pt-8 px-5 w-full max-w-md mx-auto relative z-10">
          <div className="w-full mb-8 relative group">
             <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-primary/50"></div>
             <h1 className="text-3xl font-bold tracking-wider text-white uppercase leading-none pl-2">
                /// INCOMING <br/>
                <span className="text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]">TRANSMISSION...</span>
             </h1>
          </div>

          <div className="w-full aspect-square max-w-[200px] relative mb-6 border border-primary/30 p-1 group">
             {/* Corners */}
             <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
             <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary"></div>
             <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary"></div>
             <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
             
             <div className="w-full h-full relative overflow-hidden">
                <img 
                   src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop" 
                   className="w-full h-full object-cover grayscale contrast-125 brightness-90"
                   alt="Founder"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
             </div>
             <div className="absolute -bottom-6 right-0 text-[10px] font-mono text-gray-500 tracking-widest">IMG_SRC: D_DO.x86</div>
          </div>

          <div className="w-full border-l border-white/20 pl-4 py-2 mt-2">
             <p className="font-mono text-sm leading-relaxed text-gray-200">
                I didn’t build this app for money. I built it because I was tired of being weak. This System isn’t a game. It’s my life. And now, it’s yours. Trust the process.
             </p>
          </div>

          <div className="w-full flex justify-end mt-6 mb-auto">
             <div className="text-right border-r-2 border-critical pr-3">
                <p className="text-primary font-bold tracking-widest uppercase text-sm font-display">— Founder</p>
                <p className="text-white text-xs font-mono uppercase tracking-wide">Donovan Do</p>
             </div>
          </div>
       </main>

       <footer className="w-full p-5 bg-gradient-to-t from-black via-black to-transparent z-20">
          <div className="flex justify-between items-end mb-2 text-[10px] font-mono text-gray-500 uppercase">
             <span>Lat: 34.0522 N</span>
             <span>Packet_Loss: 0%</span>
          </div>
          <CyberButton onClick={onNext} icon="download_done">
             TRANSMISSION RECEIVED
          </CyberButton>
          <div className="text-center mt-3">
             <p className="text-[9px] text-critical/60 font-mono uppercase tracking-widest">/// WARNING: NON-COMPLIANCE WILL RESULT IN SYSTEM PURGE</p>
          </div>
       </footer>
    </div>
  );
};

export default FoundersNote;