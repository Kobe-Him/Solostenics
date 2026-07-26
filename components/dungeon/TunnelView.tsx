
import React from 'react';
import { motion } from 'framer-motion';

interface TunnelViewProps {
  secondsRemaining: number;
  totalDuration: number;
}

const TunnelView: React.FC<TunnelViewProps> = ({ secondsRemaining, totalDuration }) => {
  const progress = ((totalDuration - secondsRemaining) / totalDuration) * 100;

  return (
    <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center overflow-hidden pointer-events-none">
        {/* The Tunnel Animation */}
        <div className="absolute inset-0 perspective-[500px]">
            {/* Grid Floor */}
            <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[50vh] bg-[linear-gradient(transparent_0%,rgba(0,255,255,0.2)_100%),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] origin-bottom transform rotate-x-[60deg] animate-[tunnel_1s_linear_infinite]"></div>
            
            {/* Ceiling */}
            <div className="absolute top-0 left-[-50%] right-[-50%] h-[50vh] bg-[linear-gradient(rgba(0,255,255,0.2)_0%,transparent_100%),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] origin-top transform rotate-x-[-60deg] animate-[tunnel_1s_linear_infinite]"></div>
            
            <style>{`
                @keyframes tunnel {
                    from { background-position: 0 0; }
                    to { background-position: 0 40px; }
                }
            `}</style>
        </div>

        {/* HUD */}
        <div className="relative z-10 text-center space-y-8 w-full max-w-md px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#00FFFF]"></span>
                    <h2 className="text-sm font-mono text-primary tracking-widest uppercase">Auto-Traversal Engaged</h2>
                </div>
                
                <div className="text-8xl font-display font-bold text-white drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] tabular-nums">
                    {secondsRemaining}
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-2 tracking-[0.2em] uppercase">
                    Recovering Stamina...
                </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                <motion.div 
                    className="h-full bg-primary shadow-[0_0_10px_#00FFFF]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.5 }}
                />
            </div>

            <div className="pt-12 opacity-50">
                <p className="text-[9px] text-white/40 font-mono uppercase border border-white/10 px-3 py-1 inline-block">
                    Input Locked // Breathe
                </p>
            </div>
        </div>
    </div>
  );
};

export default TunnelView;
