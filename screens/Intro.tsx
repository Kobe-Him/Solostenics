
import React from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface IntroProps {
  onNext: (data: Partial<UserData>) => void;
}

const WEAKNESSES = [
  { id: 'sugar', label: 'Gluttony', code: 'ERR_001', icon: 'cookie' },
  { id: 'stamina', label: 'Weak Lungs', code: 'ERR_002', icon: 'air' },
  { id: 'discipline', label: 'Lazy', code: 'ERR_003', icon: 'psychology_alt' },
  { id: 'gaming', label: 'Dopamine', code: 'ERR_004', icon: 'sports_esports' },
];

const Intro: React.FC<IntroProps> = ({ onNext }) => {
  const [selected, setSelected] = React.useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onNext({ weakness: selected });
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-background-dark">
      
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-2">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-l-2 border-primary pl-4 py-1"
        >
          <h1 className="text-3xl font-display font-bold text-white uppercase leading-none mb-1">
            Identify<br /><span className="text-critical">Weakness</span>
          </h1>
          <p className="text-primary/80 font-mono text-[10px]">
            &gt; QUERY: WHAT IS YOUR DEFECT?
          </p>
        </motion.div>
      </div>

      {/* Grid Content - Fills available space */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-3 min-h-0">
        {WEAKNESSES.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelected(item.id)}
            className={`
              relative group border flex flex-col justify-center items-center text-center p-2 transition-all duration-200 w-full h-full
              ${selected === item.id 
                ? 'border-critical bg-critical/10 shadow-[0_0_15px_rgba(255,0,60,0.2)]' 
                : 'border-primary/30 bg-background-dark/80 hover:border-primary hover:bg-primary/5'}
            `}
          >
            <div className={`absolute top-2 right-2 text-[8px] font-mono ${selected === item.id ? 'text-critical' : 'text-primary/30'}`}>
              {item.code}
            </div>
            
            <span className={`material-symbols-outlined mb-2 text-3xl transition-all duration-300 ${selected === item.id ? 'text-critical scale-110 drop-shadow-[0_0_5px_rgba(255,0,60,0.8)]' : 'text-white group-hover:text-primary'}`}>{item.icon}</span>
            
            <p className={`font-mono text-sm font-bold uppercase leading-none transition-colors duration-300 ${selected === item.id ? 'text-critical' : 'text-white'}`}>
              {item.label}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 bg-background-dark border-t border-primary/20 z-50">
        <CyberButton 
          variant={selected ? "critical" : "ghost"} 
          onClick={handleConfirm}
          disabled={!selected}
          icon="arrow_forward"
          fullWidth
          className="!h-12 text-sm"
        >
          CONFIRM DEFECT
        </CyberButton>
      </div>
    </div>
  );
};

export default Intro;
