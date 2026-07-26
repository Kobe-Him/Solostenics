
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import { UserData } from '../types';

interface BioDataProps {
  onNext: (data: Partial<UserData>) => void;
}

const BioData: React.FC<BioDataProps> = ({ onNext }) => {
  const [step, setStep] = useState<'scanning' | 'inputs' | 'activity'>('scanning');
  
  // Basics State
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [age, setAge] = useState(24);
  const [units, setUnits] = useState<'METRIC' | 'IMPERIAL'>('IMPERIAL');
  
  // Metric Values (Internal storage)
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(75);

  // Imperial Display Values
  const [feet, setFeet] = useState(5);
  const [inches, setInches] = useState(9);
  const [lbs, setLbs] = useState(165);

  const [activityIndex, setActivityIndex] = useState<number | null>(null);

  const ACTIVITY_LEVELS = [
     { label: "SEDENTARY", desc: "No Dungeons (0x)", val: 10 },
     { label: "LIGHT", desc: "Casual Patrol (1-2x)", val: 30 },
     { label: "MODERATE", desc: "Standard Grind (3-4x)", val: 50 },
     { label: "HEAVY", desc: "Veteran Hunter (5-6x)", val: 75 },
     { label: "ATHLETE", desc: "S-Rank Logic (Every Day)", val: 95 },
  ];

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => {
        setStep('inputs');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Sync inputs when unit changes
  useEffect(() => {
     if (units === 'IMPERIAL') {
        const totalInches = heightCm / 2.54;
        setFeet(Math.floor(totalInches / 12));
        setInches(Math.round(totalInches % 12));
        setLbs(Math.round(weightKg * 2.20462));
     } else {
        const totalInches = (feet * 12) + inches;
        setHeightCm(Math.round(totalInches * 2.54));
        setWeightKg(Math.round(lbs / 2.20462));
     }
  }, [units]);

  const handleImperialHeightChange = (f: number, i: number) => {
     setFeet(f);
     setInches(i);
     setHeightCm(Math.round(((f * 12) + i) * 2.54));
  };

  const handleImperialWeightChange = (l: number) => {
     setLbs(l);
     setWeightKg(Math.round(l / 2.20462));
  };

  const handleMetricHeightChange = (cm: number) => {
     setHeightCm(cm);
  };
  
  const handleMetricWeightChange = (kg: number) => {
     setWeightKg(kg);
  };


  // SCANNING SCREEN
  if (step === 'scanning') {
    return (
      <div className="flex flex-col h-full p-4 relative overflow-hidden justify-center items-center">
         <div className="absolute inset-0 pointer-events-none border border-primary/10 m-4"></div>
         
         <div className="absolute top-8 left-8">
            <h1 className="font-display text-xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">SYS.DIAGNOSTICS</h1>
            <span className="text-[10px] text-primary/60 tracking-wider">SECURE CONNECTION ESTABLISHED</span>
         </div>
         
         <div className="relative w-full h-[50vh] flex items-center justify-center max-w-sm overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop" 
                 alt="Shadow Figure"
                 className="w-full h-full object-cover filter brightness-[0.4] contrast-150 grayscale"
               />
               <div className="absolute inset-0 bg-background-dark/30 mix-blend-multiply"></div>
            </div>
            <motion.div 
               className="absolute w-full h-[2px] bg-primary z-20 shadow-[0_0_20px_#00ffff]"
               animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
         </div>

         <div className="w-full max-w-sm mt-4 border border-primary/30 bg-black/60 p-4 font-mono text-xs space-y-2 relative z-20 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <p className="text-primary/90">&gt; ANALYZING SKELETAL FRAME... <span className="text-primary font-bold">COMPLETE</span></p>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.5 }}
              className="text-primary/90"
            >
              &gt; ESTIMATING MUSCLE DENSITY... <span className="text-critical font-bold">SUB-OPTIMAL</span>
            </motion.p>
         </div>
      </div>
    );
  }

  // INPUTS SCREEN
  if (step === 'inputs') {
    return (
      <div className="flex flex-col h-full relative overflow-hidden bg-background-dark">
        {/* Header - Fixed Compact */}
        <header className="flex-shrink-0 border-b border-primary/30 py-3 px-4 flex justify-between items-end bg-background-dark z-20">
           <div>
             <h1 className="text-2xl font-display font-bold tracking-widest text-white leading-none">INITIALIZE VESSEL</h1>
           </div>
           <button 
             onClick={() => setUnits(u => u === 'METRIC' ? 'IMPERIAL' : 'METRIC')}
             className="text-[10px] font-mono border border-primary text-primary px-2 py-0.5 hover:bg-primary hover:text-black transition-all"
           >
             [{units}]
           </button>
        </header>

        {/* Content - Non-scrollable, Flex Fit */}
        <div className="flex-1 w-full p-4 flex flex-col justify-center gap-2 overflow-hidden">
            {/* Gender */}
            <div className="border border-primary/30 bg-black/40 p-2 backdrop-blur-sm">
               <label className="block text-primary text-[10px] font-bold tracking-widest mb-1">BIOLOGICAL_SEX</label>
               <div className="flex w-full gap-2 font-mono">
                  <button onClick={() => setGender('M')} className={`flex-1 h-10 text-lg font-bold border flex items-center justify-center transition-all ${gender === 'M' ? 'bg-primary text-black border-primary' : 'border-primary/30 text-primary/50'}`}>[ M ]</button>
                  <button onClick={() => setGender('F')} className={`flex-1 h-10 text-lg font-bold border flex items-center justify-center transition-all ${gender === 'F' ? 'bg-primary text-black border-primary' : 'border-primary/30 text-primary/50'}`}>[ F ]</button>
               </div>
            </div>

            {/* Age */}
            <div className="border border-primary/30 bg-black/40 p-2 backdrop-blur-sm flex flex-col justify-center">
               <label className="block text-primary text-[10px] font-bold tracking-widest mb-1">AGE</label>
               <div className="flex items-center border-b border-primary/30 bg-primary/5 px-2 py-1">
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(Math.min(99, Math.max(16, Number(e.target.value))))}
                    className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                  />
                  <div className="ml-auto flex gap-1">
                     <button onClick={() => setAge(a => Math.max(16, a-1))} className="w-8 h-8 flex items-center justify-center bg-white/5 text-white border border-white/10">-</button>
                     <button onClick={() => setAge(a => Math.min(99, a+1))} className="w-8 h-8 flex items-center justify-center bg-white/5 text-white border border-white/10">+</button>
                  </div>
               </div>
            </div>

            {/* Height */}
            <div className="border border-primary/30 bg-black/40 p-2 backdrop-blur-sm">
               <label className="block text-primary text-[10px] font-bold tracking-widest mb-1">HEIGHT</label>
               {units === 'IMPERIAL' ? (
                  <div className="flex gap-2">
                     <div className="flex-1 flex items-center border-b border-primary/30 bg-primary/5 px-2 py-1">
                        <input 
                          type="number" value={feet} onChange={(e) => handleImperialHeightChange(Number(e.target.value), inches)}
                          className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                        />
                        <span className="text-gray-500 text-[10px] ml-1">FT</span>
                     </div>
                     <div className="flex-1 flex items-center border-b border-primary/30 bg-primary/5 px-2 py-1">
                        <input 
                          type="number" value={inches} onChange={(e) => handleImperialHeightChange(feet, Number(e.target.value))}
                          className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                        />
                        <span className="text-gray-500 text-[10px] ml-1">IN</span>
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center border-b border-primary/30 bg-primary/5 px-2 py-1">
                     <input 
                       type="number" value={heightCm} onChange={(e) => handleMetricHeightChange(Number(e.target.value))}
                       className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                     />
                     <span className="text-gray-500 text-[10px] ml-1">CM</span>
                  </div>
               )}
            </div>

            {/* Weight */}
            <div className="border border-primary/30 bg-black/40 p-2 backdrop-blur-sm">
               <label className="block text-primary text-[10px] font-bold tracking-widest mb-1">WEIGHT</label>
               <div className="flex items-center border-b border-primary/30 bg-primary/5 px-2 py-1">
                  {units === 'IMPERIAL' ? (
                     <input 
                       type="number" value={lbs} onChange={(e) => handleImperialWeightChange(Number(e.target.value))}
                       className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                     />
                  ) : (
                     <input 
                       type="number" value={weightKg} onChange={(e) => handleMetricWeightChange(Number(e.target.value))}
                       className="bg-transparent text-white font-mono text-2xl w-full focus:outline-none"
                     />
                  )}
                  <span className="text-gray-500 text-[10px] ml-1">{units === 'IMPERIAL' ? 'LBS' : 'KG'}</span>
               </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 bg-background-dark border-t border-primary/20 z-50">
           <CyberButton onClick={() => setStep('activity')} icon="power_settings_new" fullWidth className="!h-12 text-sm">CONFIRM PARAMETERS</CyberButton>
        </div>
      </div>
    );
  }

  // ACTIVITY SCREEN
  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-background-dark">
       {/* Header */}
       <header className="py-3 px-4 flex-shrink-0 bg-background-dark border-b border-primary/10">
         <h1 className="font-display text-2xl font-bold text-white tracking-[0.1em] leading-none mb-1">
            FREQUENCY
         </h1>
         <p className="text-primary text-[10px] font-mono tracking-wider">SELECT WEEKLY OUTPUT</p>
       </header>

       {/* Content - Compact List */}
       <div className="flex-1 w-full px-4 py-2 flex flex-col justify-center gap-2 overflow-hidden">
            {ACTIVITY_LEVELS.map((level, idx) => (
               <button
                 key={idx}
                 onClick={() => setActivityIndex(idx)}
                 className={`w-full text-left p-3 border transition-all duration-200 group relative overflow-hidden flex-shrink-0
                    ${activityIndex === idx 
                       ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(0,255,255,0.2)]' 
                       : 'bg-black/50 border-white/10 hover:border-primary/50 hover:bg-white/5'}
                 `}
               >
                  <div className="relative z-10 flex justify-between items-center">
                     <div>
                        <h3 className={`font-display font-bold text-base tracking-wide transition-colors ${activityIndex === idx ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                           {level.label}
                        </h3>
                        <p className={`font-mono text-[10px] ${activityIndex === idx ? 'text-primary' : 'text-gray-600'}`}>
                           {level.desc}
                        </p>
                     </div>
                     {activityIndex === idx && <div className="w-1.5 h-1.5 bg-primary animate-pulse"></div>}
                  </div>
               </button>
            ))}
       </div>

       {/* Footer */}
       <div className="flex-shrink-0 p-4 bg-background-dark border-t border-primary/20 z-50">
           <CyberButton 
             onClick={() => activityIndex !== null && onNext({ gender, age, height: heightCm, weight: weightKg, activityLevel: ACTIVITY_LEVELS[activityIndex].val })} 
             icon="chevron_right"
             disabled={activityIndex === null}
             fullWidth
             className="!h-12 text-sm"
           >
              CONFIRM INPUT
           </CyberButton>
       </div>
    </div>
  );
};

export default BioData;
