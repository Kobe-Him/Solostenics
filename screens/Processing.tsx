import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProcessingProps {
  onComplete: () => void;
}

const LOGS = [
  { text: "CONNECTING...", status: "OK", color: "text-primary" },
  { text: "SYNCING_SHADOW...", status: "OK", color: "text-primary" },
  { text: "ANALYZING_DEFICIT...", status: "WARN", color: "text-critical" },
  { text: "GENERATING_PAIN...", status: "WAIT", color: "text-white" },
  { text: "CALIBRATING...", status: "....", color: "text-primary/50" },
];

const Processing: React.FC<ProcessingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    // Progress bar timer
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // 3 seconds total approx

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Log revealer
    if (progress > 0 && progress % 20 === 0 && logIndex < LOGS.length) {
      setLogIndex(prev => prev + 1);
    }
    if (progress === 100) {
      setTimeout(onComplete, 800);
    }
  }, [progress, logIndex, onComplete]);

  return (
    <div className="flex flex-col h-full justify-center p-8 relative">
       {/* Center Loading Graphic */}
       <div className="mb-12">
          <div className="flex justify-between items-end mb-2 font-mono text-xs">
            <span className="text-white">SYSTEM_LOAD</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full h-4 border border-white/20 p-[2px] relative overflow-hidden">
             <div 
               className="h-full bg-primary/20 absolute left-[2px] top-[2px] bottom-[2px] z-0 transition-all duration-75"
               style={{ width: `${progress}%` }}
             ></div>
             {/* Striped Texture */}
             <div 
               className="h-full absolute left-[2px] top-[2px] bottom-[2px] z-10 opacity-50 transition-all duration-75"
               style={{ 
                 width: `${progress}%`,
                 backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #00FFFF 5px, #00FFFF 10px)'
               }}
             ></div>
          </div>
       </div>

       {/* Logs */}
       <div className="space-y-4 font-mono">
         {LOGS.map((log, i) => (
           <motion.div
             key={i}
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: i <= logIndex ? (i === logIndex ? 1 : 0.5) : 0, x: 0 }}
             className="flex items-center gap-4"
           >
             <span className={`${log.color === 'text-critical' ? 'text-critical' : 'text-primary/50'}`}>&gt;</span>
             <div className="flex-1 border-b border-white/10 pb-1 flex justify-between">
                <span className={`text-sm ${log.color}`}>{log.text}</span>
                <span className="text-xs text-white/40">[{log.status}]</span>
             </div>
           </motion.div>
         ))}
       </div>
    </div>
  );
};

export default Processing;
