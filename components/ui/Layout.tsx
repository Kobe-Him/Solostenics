import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  step: string;
  showHud?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, step, showHud = true, onBack }) => {
  return (
    <div className="min-h-screen w-full relative flex flex-col font-mono selection:bg-critical selection:text-white overflow-hidden bg-background-dark">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-background-dark">
         <div className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)', 
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
              }}>
         </div>
         {/* Vignette */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
      </div>

      {/* Scanline Overlay - More subtle */}
      <div className="scanline-overlay fixed inset-0 z-50 opacity-[0.15] pointer-events-none h-screen w-screen mix-blend-overlay"></div>

      {/* GLOBAL BACK BUTTON */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={onBack}
          className="fixed top-4 left-4 z-[60] group flex items-center gap-1 pl-2 pr-3 py-1.5 bg-black border border-primary/30 hover:border-primary text-primary/80 hover:text-primary transition-all duration-300 rounded-sm backdrop-blur-md shadow-lg"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
          <span className="text-[10px] font-mono tracking-widest font-bold">BACK</span>
        </motion.button>
      )}

      {/* HUD Header */}
      {showHud && (
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="relative z-40 w-full p-4 border-b border-primary/20 bg-background-dark/80 backdrop-blur-md flex justify-between items-center pl-24" // Increased padding to clear button
        >
          <div className="flex items-center gap-2 text-primary/90">
            <span className="material-symbols-outlined text-[20px] animate-pulse">terminal</span>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest leading-none font-bold">SYS_ROOT // {step}</span>
              <span className="text-[8px] opacity-60 leading-none mt-0.5">V.1.0.4 [STABLE]</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <span className="text-[8px] text-primary/60">NET_STATUS</span>
                <span className="text-[10px] text-primary tracking-widest drop-shadow-glow">CONNECTED</span>
             </div>
             <div className="w-2 h-2 bg-primary shadow-glow animate-pulse"></div>
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Decorative Corners - Animated */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="fixed top-4 left-4 w-4 h-4 border-l border-t border-primary/40 pointer-events-none z-40"></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="fixed top-4 right-4 w-4 h-4 border-r border-t border-primary/40 pointer-events-none z-40"></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="fixed bottom-4 left-4 w-4 h-4 border-l border-b border-primary/40 pointer-events-none z-40"></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="fixed bottom-4 right-4 w-4 h-4 border-r border-b border-primary/40 pointer-events-none z-40"></motion.div>
    </div>
  );
};

export default Layout;