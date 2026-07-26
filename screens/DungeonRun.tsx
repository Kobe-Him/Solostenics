
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';
import GhostOverlay from '../components/dungeon/GhostOverlay';
import TunnelView from '../components/dungeon/TunnelView';
import TacticalOverlay from '../components/dungeon/TacticalOverlay';
import { Haptics } from '../services/Haptics';
import { PlayerProfile } from '../types';

// Declare MediaPipe globals
declare const window: any;

export type EncounterType = 'FODDER' | 'ELITE' | 'BOSS';

export interface Encounter {
  id: number;
  type: EncounterType;
  name: string;
  totalSets: number;
  repsPerSet: number;
  damage: number;
  image: string | null;
  shadowColor: string;
}

interface DungeonRunProps {
  onComplete: (data: { reps: number, name: string }) => void;
  profile: PlayerProfile;
  encounterOverride?: Encounter; // Allow passing a specific boss/egg
  exercise?: string; // e.g. SQUATS, PUSH-UPS
}

type Phase = 'INIT' | 'PERMISSION' | 'LOADING' | 'GATEKEEPER' | 'COMBAT' | 'ENEMY_TURN' | 'SOUL_HARVEST' | 'REST_TRAVERSAL' | 'REST_TACTICAL' | 'REST_STABILIZE' | 'VICTORY' | 'DEFEAT' | 'SAFETY_STOP' | 'EXPLORATION';
type RepState = 'UP' | 'DESCENDING' | 'BOTTOM' | 'ASCENDING';

const DUNGEON_MAP: Encounter[] = [
  { 
      id: 1, 
      type: 'FODDER', 
      name: 'LOOT GOBLIN', 
      totalSets: 1, 
      repsPerSet: 10, 
      damage: 10, 
      image: null,
      shadowColor: '#a855f7' // Purple
  },
  { 
      id: 2, 
      type: 'ELITE', 
      name: 'GATEKEEPER ORC', 
      totalSets: 2, 
      repsPerSet: 10, 
      damage: 15, 
      image: null,
      shadowColor: '#22c55e' // Green
  },
  { 
      id: 3, 
      type: 'BOSS', 
      name: 'DUNGEON KING', 
      totalSets: 3, 
      repsPerSet: 10, 
      damage: 25, 
      image: null,
      shadowColor: '#ef4444' // Red
  },
];

// --- SOUL HARVEST COMPONENT ---
const SoulHarvest = ({ onComplete }: { onComplete: () => void }) => {
  const orbCount = 20; 
  const orbs = Array.from({ length: orbCount });
  const completeCalled = useRef(false);

  // Logic Timer - Independent of Animation Frame
  useEffect(() => {
      const timer = setTimeout(() => {
          if (!completeCalled.current) {
              completeCalled.current = true;
              onComplete();
          }
      }, 5000); // 5 Seconds fixed duration

      return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Dark Overlay to focus attention */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm z-0"
      />

      {/* Initial Impact Flash */}
      <motion.div
         initial={{ opacity: 1 }}
         animate={{ opacity: 0 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="absolute inset-0 bg-white z-10 mix-blend-overlay"
      />

      {/* Soul Orbs */}
      {orbs.map((_, i) => (
        <SoulOrb key={i} index={i} />
      ))}

      {/* HUD Text - Centered & Smaller */}
      <div className="relative z-20 text-center px-4">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-3xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-t from-cyan-500 to-white drop-shadow-[0_0_30px_rgba(0,255,255,0.8)] tracking-widest uppercase"
          >
             System Harvest
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, delay: 0.5 }}
            className="h-1 bg-cyan-400 mt-4 mx-auto shadow-[0_0_15px_cyan] max-w-[200px]"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="font-mono text-xs text-cyan-200 mt-4 tracking-[0.5em] animate-pulse"
          >
             EXTRACTING_XP...
          </motion.p>
      </div>
    </div>
  );
};

const SoulOrb: React.FC<{ index: number }> = ({ index }) => {
  // Start: Monster Position (Top Center)
  const startX = 50 + (Math.random() * 40 - 20); 
  const startY = 25 + (Math.random() * 20 - 10);

  // End: Player Camera (Bottom Center)
  const targetX = 50 + (Math.random() * 10 - 5);
  const targetY = 95; 

  // Longer, more dramatic float
  const duration = 2.0 + Math.random() * 2.0; 
  const delay = Math.random() * 1.5; 

  return (
    <motion.div
      className="absolute w-4 h-4 md:w-6 md:h-6 rounded-full z-20"
      style={{
          background: 'radial-gradient(circle at 30% 30%, white, #00FFFF)',
          boxShadow: '0 0 20px 5px rgba(0, 255, 255, 0.8)',
          filter: 'blur(0.5px)',
      }}
      initial={{ 
          left: `${startX}%`, 
          top: `${startY}%`, 
          scale: 0, 
          opacity: 0 
      }}
      animate={{ 
          left: [`${startX}%`, `${startX + (Math.random() * 40 - 20)}%`, `${targetX}%`], // Curve path
          top: [`${startY}%`, `${startY + 30}%`, `${targetY}%`],
          scale: [0, 1.5, 0.2], 
          opacity: [0, 1, 1, 0]    
      }}
      transition={{ 
          duration: duration, 
          delay: delay,
          ease: "easeInOut",
          times: [0, 0.3, 1]
      }}
    />
  );
};

const MonsterVisual = ({ 
    activeEncounter, 
    hpPercent, 
    enemyHp, 
    maxHp,
    isDead,
    mockMessage
}: { 
    activeEncounter: Encounter, 
    hpPercent: number, 
    enemyHp: number, 
    maxHp: number,
    isDead: boolean,
    mockMessage?: string | null
}) => (
  <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-full max-w-md z-20 flex flex-col items-center justify-center pointer-events-none px-4">
      {/* Monster Health Bar */}
      <motion.div 
        animate={{ opacity: isDead ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="w-72 mb-4 relative z-30"
      >
          <div className="flex justify-between text-xs font-display font-bold text-white uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/20 text-white shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeEncounter.shadowColor }}></span>
                  {activeEncounter.name}
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded border border-white/20 text-white/80 shadow-md tabular-nums">
                  {activeEncounter.id === 999 ? '???' : `${enemyHp}/${maxHp} HP`}
              </span>
          </div>
          <div className="h-4 bg-black/80 border border-white/20 rounded-full relative overflow-hidden shadow-xl">
               <motion.div 
                  className="h-full relative"
                  style={{ backgroundColor: activeEncounter.shadowColor }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${hpPercent}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
               >
                   <div className="absolute top-0 right-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]"></div>
               </motion.div>
          </div>
      </motion.div>

      {/* The Monster Entity */}
      <motion.div
          animate={isDead ? {
              scale: [1, 1.5, 0], // Explode out then vanish
              opacity: [1, 0.5, 0],
              filter: ["brightness(1) blur(0px)", "brightness(10) blur(20px)", "brightness(0) blur(50px)"],
              y: 0
          } : { 
              y: [0, -15, 0],
              scale: 1,
              opacity: 1,
              filter: "brightness(1) blur(0px)"
          }}
          transition={isDead ? { duration: 1.5, ease: "easeInOut" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
      >
          {activeEncounter.id === 999 ? (
             <>
                {/* --- CSS MYSTERY EGG --- */}
                <div className="relative w-48 h-64" style={{ filter: 'url(#dragon-edge)' }}>
                    <div className="absolute -inset-6 bg-blue-500/20 blur-3xl rounded-[50%] opacity-60 animate-pulse"></div>
                    <div className="relative w-full h-full overflow-hidden rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] shadow-[0_0_50px_rgba(0,180,255,0.4)] border border-cyan-500/40 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,#020617)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-transparent to-black opacity-80"></div>
                      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, #0ea5e9 10%, transparent 12%), radial-gradient(circle at 50% 100%, #000 10%, transparent 12%)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}></div>
                      <div className="absolute inset-0 opacity-30 mix-blend-color-dodge" style={{ backgroundImage: `radial-gradient(circle at 50% 0, rgba(255,255,255,0.3) 5%, transparent 60%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.8) 5%, transparent 60%)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}></div>
                      <div className="absolute inset-0 shadow-[inset_15px_-15px_40px_rgba(0,0,0,1),inset_-5px_5px_20px_rgba(255,255,255,0.1)]"></div>
                      <div className="absolute inset-0 bg-cyan-500 mix-blend-overlay opacity-0 animate-pulse-fast"></div>
                    </div>
                </div>

                {/* SAVAGE MOCKERY TEXT BOX */}
                <AnimatePresence>
                    {mockMessage && (
                        <motion.div 
                           initial={{ opacity: 0, y: -10, scale: 0.9 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: 10, scale: 0.9 }}
                           key={mockMessage}
                           className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 bg-black/90 border border-primary p-3 rounded-sm shadow-[0_0_15px_rgba(0,255,255,0.2)] z-50 text-center pointer-events-none"
                        >
                            {/* Speech triangle */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-primary"></div>
                            <p className="font-display font-bold text-white uppercase text-sm leading-tight italic">
                                "{mockMessage}"
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
             </>
          ) : (
             // --- STANDARD IMAGE MONSTER ---
             <>
                {/* Floor Shadow */}
                <motion.div 
                  animate={{ opacity: isDead ? 0 : 1 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/60 blur-2xl rounded-[100%]" 
                />
                
                {/* Back Glow */}
                <motion.div 
                  animate={{ opacity: isDead ? 0 : 0.3 }}
                  className="absolute inset-0 blur-3xl rounded-full scale-75 opacity-30 animate-pulse"
                  style={{ backgroundColor: activeEncounter.shadowColor }}
                />

                {/* Monster Image */}
                {/* Monster Image or Placeholder */}
                {activeEncounter.image ? (
                    <motion.img 
                       key={activeEncounter.id}
                       src={activeEncounter.image}
                       alt="Monster"
                       className="w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-10"
                       style={{ filter: 'contrast(1.1) saturate(1.1)' }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border-4 border-dashed border-gray-700 bg-black/50 relative z-10 rounded-xl">
                        <span className="material-symbols-outlined text-6xl text-gray-500 mb-4 animate-pulse">image_not_supported</span>
                        <p className="font-display font-bold text-gray-500 tracking-[0.2em] uppercase text-center px-4">IMAGES COMING SOON</p>
                    </div>
                )}
             </>
          )}
      </motion.div>
  </div>
);

const DungeonRun: React.FC<DungeonRunProps> = ({ onComplete, profile, encounterOverride, exercise }) => {
  // --- UI STATE ---
  const [phase, setPhase] = useState<Phase>('INIT');
  const [debugMsg, setDebugMsg] = useState("INITIALIZING...");
  
  const [currentEncounterIndex, setCurrentEncounterIndex] = useState(0);
  const [playerHP, setPlayerHP] = useState(profile.currentHp || 100);
  const [playerMana, setPlayerMana] = useState(profile.currentMana || 100); 
  
  // Enemy Logic
  const [enemyMaxHp, setEnemyMaxHp] = useState(100);
  const [enemyCurrentHp, setEnemyCurrentHp] = useState(100);
  const [eggMockery, setEggMockery] = useState<string | null>(null);
  
  const [activeBuffs, setActiveBuffs] = useState({ 
      ironSkin: false, 
      enraged: false, 
      mobility: false, 
      stiffness: false 
  });
  
  const [currentSet, setCurrentSet] = useState(1);
  const [repsInSet, setRepsInSet] = useState(0);
  const [repsTarget, setRepsTarget] = useState(10);
  const [totalReps, setTotalReps] = useState(0);
  
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("text-white");
  const [screenShake, setScreenShake] = useState(false); 
  const [postureWarning, setPostureWarning] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  
  const [restTimer, setRestTimer] = useState(0);
  const [restTotalTime, setRestTotalTime] = useState(0);
  
  const [poseData, setPoseData] = useState<any>(null);

  // --- REFS ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isInitRef = useRef(false);

  // Game Logic Refs
  const repStateRef = useRef<RepState>('UP'); 
  const minAngleRef = useRef(180); 
  const smoothAngleRef = useRef(180); 
  const isFormBrokenRef = useRef(false);
  const bottomStartTimeRef = useRef<number>(0);
  const lastActivityTimeRef = useRef<number>(Date.now());
  
  const phaseRef = useRef<Phase>('INIT');
  const currentEncounterIndexRef = useRef(0);
  const currentSetRef = useRef(1);
  const repsInSetRef = useRef(0);
  const repsTargetRef = useRef(10);
  const totalRepsRef = useRef(0);
  const activeBuffsRef = useRef(activeBuffs);
  const enemyHpRef = useRef(100); // Ref for sync access in loops

  // Constants
  const STALL_TIMEOUT = 6000;
  const START_DESCEND = 165;  
  const UP_THRESHOLD = 160;   
  const BAD_FORM_LIMIT = 110; 
  const GOOD_FORM_LIMIT = 90; 
  const PERFECT_FORM_LIMIT = 75; 
  const HIP_ALIGNMENT_THRESHOLD = 135; 

  // --- SYNC EFFECTS ---
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { activeBuffsRef.current = activeBuffs; }, [activeBuffs]);
  useEffect(() => { enemyHpRef.current = enemyCurrentHp; }, [enemyCurrentHp]);
  
  // Watchdog for Soul Harvest to prevent getting stuck
  useEffect(() => {
      if (phase === 'SOUL_HARVEST') {
          const timer = setTimeout(() => {
              // Safety valve: Force proceed if animation callback didn't trigger
              console.warn("Soul Harvest Watchdog Triggered");
              handleSoulHarvestComplete();
          }, 8000); // 6s animation + 2s buffer
          return () => clearTimeout(timer);
      }
  }, [phase]);

  const getCurrentEncounter = () => {
      return encounterOverride || DUNGEON_MAP[currentEncounterIndex];
  }

  useEffect(() => {
    const encounter = getCurrentEncounter();
    // Calculate Max HP based on sets * reps * 10 dmg (standard)
    const maxHP = encounter.totalSets * encounter.repsPerSet * 10;
    setEnemyMaxHp(maxHP);
    setEnemyCurrentHp(maxHP);
    enemyHpRef.current = maxHP;
    
    setRepsTarget(encounter.repsPerSet);
    repsTargetRef.current = encounter.repsPerSet;
    currentEncounterIndexRef.current = currentEncounterIndex;
    currentSetRef.current = currentSet;
  }, [currentEncounterIndex, encounterOverride]);

  // Set updates
  useEffect(() => {
      const encounter = getCurrentEncounter();
      setRepsTarget(encounter.repsPerSet);
      repsTargetRef.current = encounter.repsPerSet;
      currentSetRef.current = currentSet;
  }, [currentSet, currentEncounterIndex, encounterOverride]);

  useEffect(() => {
     let interval: any;
     if (['REST_TRAVERSAL', 'REST_TACTICAL', 'REST_STABILIZE'].includes(phase)) {
        interval = setInterval(() => {
           setRestTimer(prev => {
              if (prev <= 1) {
                 handlePhaseTimeout(); 
                 return 0;
              }
              return prev - 1;
           });
        }, 1000);
     }
     return () => clearInterval(interval);
  }, [phase]);

  const handlePhaseTimeout = () => {
      const p = phaseRef.current;
      if (p === 'REST_TRAVERSAL') {
          startRestPhase('REST_TACTICAL', 35); 
      } else if (p === 'REST_TACTICAL') {
          startRestPhase('REST_STABILIZE', 5);
      } else if (p === 'REST_STABILIZE') {
          handleResumeCombat();
      }
  };

  const startRestPhase = (nextPhase: Phase, duration: number) => {
      setRestTotalTime(duration);
      setRestTimer(duration);
      setPhase(nextPhase);
  };

  // --- INIT ---
  useEffect(() => {
    let attempts = 0;
    const checkScripts = setInterval(() => {
      attempts++;
      const win = window as any;
      const hasPose = !!(win.Pose || win.pose?.Pose || win.MPPose?.Pose);
      const hasCamera = !!(win.Camera || win.camera_utils?.Camera);
      
      if (hasPose && hasCamera) {
        clearInterval(checkScripts);
        setPhase('PERMISSION');
      } else {
        if (attempts % 20 === 0) {
          console.log("Waiting for MediaPipe...", { hasPose, hasCamera });
          setDebugMsg(`ENGINE_SYNC: ${!hasPose ? 'POSE ' : ''}${!hasCamera ? 'CAMERA' : ''}`);
        }
        if (attempts > 50) { // 5 seconds
           setDebugMsg("STALL: Engines taking too long.");
        }
      }
    }, 100);
    return () => {
      clearInterval(checkScripts);
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (cameraRef.current) try { cameraRef.current.stop(); } catch(e) {}
    if (poseRef.current) try { poseRef.current.close(); } catch(e) {}
    if (audioCtxRef.current) try { audioCtxRef.current.close(); } catch(e) {}
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
        const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
  };

  const startEngine = async () => {
    initAudio();
    setPhase('LOADING');
    try {
      const win = window as any;
      const PoseCtor = win.Pose || win.pose?.Pose || win.MPPose?.Pose;
      const CameraCtor = win.Camera || win.camera_utils?.Camera;

      if (!PoseCtor || !CameraCtor) {
        throw new Error("CORE_ENGINE_SYNC_FAILURE");
      }

      const pose = new PoseCtor({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      pose.setOptions({ 
          modelComplexity: 1, 
          smoothLandmarks: true, 
          minDetectionConfidence: 0.5, 
          minTrackingConfidence: 0.5 
      });
      pose.onResults(onResults);
      poseRef.current = pose;

      if (videoRef.current) {
        const camera = new CameraCtor(videoRef.current, {
          onFrame: async () => { 
            if (poseRef.current && videoRef.current) {
                await poseRef.current.send({ image: videoRef.current }); 
            }
          },
          width: 640, height: 480
        });
        await camera.start();
        cameraRef.current = camera;
        setPhase('GATEKEEPER');
        lastActivityTimeRef.current = Date.now(); 
      }
    } catch (err) {
      console.error("Critical Engine Failure:", err);
      setDebugMsg("FAILURE: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if ((phaseRef.current === 'GATEKEEPER' || phaseRef.current === 'REST_STABILIZE') && results.poseLandmarks) {
        setPoseData(results.poseLandmarks);
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w, 0);
    ctx.scale(-1, 1); 

    // CRITICAL: Prevent combat logic if harvesting
    if (results.poseLandmarks && phaseRef.current === 'COMBAT') {
       runCombatLogic(ctx, results.poseLandmarks, w, h);
    }

    ctx.restore();
  };

  // --- GAME LOGIC ---
  const validatePosture = (lm: any) => {
      // 1. Check Visibility of Key Joints (Shoulders, Hips, Knees)
      if (!lm || lm.length < 32) return "SCANNING...";

      const isSquat = exercise === 'SQUATS';
      
      const leftConf = (lm[11].visibility || 0) * (lm[23].visibility || 0) * (lm[25].visibility || 0);
      const rightConf = (lm[12].visibility || 0) * (lm[24].visibility || 0) * (lm[26].visibility || 0);
      
      const isLeft = leftConf > rightConf;
      const shoulder = isLeft ? lm[11] : lm[12];
      const hip = isLeft ? lm[23] : lm[24];
      const knee = isLeft ? lm[25] : lm[26];

      // Must see knees to prevent desk-sitting
      if ((isLeft ? leftConf : rightConf) < 0.3) return "VISIBILITY LOW";

      // 2. Orientation Check (Anti-Sit)
      const dx = Math.abs(shoulder.x - hip.x);
      const dy = Math.abs(shoulder.y - hip.y);
      
      if (isSquat) {
          // Squats must be vertical
          if (dx > dy * 1.1) return "STAND UP";
      } else {
          // Pushups must be horizontal
          if (dy > dx * 1.1) return "GET HORIZONTAL";
      }

      // 3. Hip Angle Check
      const hipAngle = calculateAngle(shoulder, hip, knee);
      if (isSquat) {
          if (hipAngle < 60) return "STRAIGHTEN BACK";
      } else {
          if (hipAngle < 135) return "STRAIGHTEN HIPS";
      }

      return null;
  };

  const runCombatLogic = (ctx: CanvasRenderingContext2D, lm: any, w: number, h: number) => {
    const now = Date.now();

    // 1. STRICT POSTURE CHECK
    const postureError = validatePosture(lm);
    if (postureError) {
        setPostureWarning(postureError);
        return; 
    } else {
        setPostureWarning(null);
    }

    // --- FROM HERE DOWN: ONLY RUNS IF POSTURE IS VALID ---

    if (now - lastActivityTimeRef.current > STALL_TIMEOUT) {
        triggerFeedback("STALLING", "text-yellow-500", -2);
        Haptics.error();
        lastActivityTimeRef.current = now; 
    }

    const isSquat = exercise === 'SQUATS';

    const leftScore = (lm[11].visibility || 0) + (lm[13].visibility || 0) + (lm[15].visibility || 0);
    const rightScore = (lm[12].visibility || 0) + (lm[14].visibility || 0) + (lm[16].visibility || 0);
    const isLeft = leftScore > rightScore;

    let a, b, c;
    if (isSquat) {
        a = isLeft ? lm[23] : lm[24]; // Hip
        b = isLeft ? lm[25] : lm[26]; // Knee
        c = isLeft ? lm[27] : lm[28]; // Ankle
    } else {
        a = isLeft ? lm[11] : lm[12]; // Shoulder
        b = isLeft ? lm[13] : lm[14]; // Elbow
        c = isLeft ? lm[15] : lm[16]; // Wrist
    }
    
    if (!a || !b || !c) return;

    const shoulder = isLeft ? lm[11] : lm[12];
    const hip = isLeft ? lm[23] : lm[24];
    const knee = isLeft ? lm[25] : lm[26];
    
    const rawAngle = calculateAngle(a, b, c);
    smoothAngleRef.current = (smoothAngleRef.current * 0.5) + (rawAngle * 0.5);
    const angle = smoothAngleRef.current;
    const hipAngle = calculateAngle(shoulder, hip, knee);

    if (Math.abs(angle - minAngleRef.current) > 2 || repStateRef.current === 'DESCENDING' || repStateRef.current === 'ASCENDING') {
         lastActivityTimeRef.current = now;
    }

    if (repStateRef.current === 'UP') {
        if (angle < START_DESCEND) {
            repStateRef.current = 'DESCENDING';
            minAngleRef.current = angle;
            isFormBrokenRef.current = false; 
        }
    } 
    else if (repStateRef.current === 'DESCENDING') {
        if (angle < minAngleRef.current) minAngleRef.current = angle;
        
        const hipThreshold = activeBuffsRef.current.mobility ? HIP_ALIGNMENT_THRESHOLD - 10 : HIP_ALIGNMENT_THRESHOLD;
        
        if (hipAngle < hipThreshold) {
            isFormBrokenRef.current = true;
        }

        if (angle < BAD_FORM_LIMIT) {
             if (bottomStartTimeRef.current === 0) bottomStartTimeRef.current = now;
             else if (now - bottomStartTimeRef.current > 3000) {
                 triggerFeedback("STUCK?", "text-yellow-500", -2);
                 bottomStartTimeRef.current = now; 
             }
        } else {
             bottomStartTimeRef.current = 0;
        }

        if (angle > minAngleRef.current + 15) {
            repStateRef.current = 'ASCENDING';
        }
    }
    else if (repStateRef.current === 'ASCENDING') {
        const hipThreshold = activeBuffsRef.current.mobility ? HIP_ALIGNMENT_THRESHOLD - 10 : HIP_ALIGNMENT_THRESHOLD;
        
        if (hipAngle < hipThreshold) {
            isFormBrokenRef.current = true;
        }

        if (angle > UP_THRESHOLD) {
             evaluateRep(minAngleRef.current, isFormBrokenRef.current);
             repStateRef.current = 'UP';
             bottomStartTimeRef.current = 0;
        }
    }

    const color = getSkeletonColor(minAngleRef.current, repStateRef.current);
    drawSkeleton(ctx, lm, w, h, color);
    
    const hipThreshold = activeBuffsRef.current.mobility ? HIP_ALIGNMENT_THRESHOLD - 10 : HIP_ALIGNMENT_THRESHOLD;
    if (hipAngle < hipThreshold && (repStateRef.current === 'DESCENDING' || repStateRef.current === 'ASCENDING')) {
        drawHipWarning(ctx, shoulder, hip, knee, w, h);
    }
  };

  const evaluateRep = (minAngle: number, isFormBroken: boolean) => {
     const encounter = getCurrentEncounter();
     const isEnraged = activeBuffsRef.current.enraged;

     // --- EGG MOCKERY LOGIC ---
     if (encounter.id === 999) {
         const insults = [
             "My shell is harder than your will.",
             "You tremble like a leaf.",
             "Is that your max effort?",
             "I am waiting to hatch, you are waiting to quit.",
             "Do not bore me.",
             "Pathetic depth.",
             "Your form insults my ancestors.",
             "I've seen slime with better posture.",
             "Are you done yet?",
             "Zero threat detected.",
             "My grandmother hits harder.",
             "Is that a rep or a twitch?",
             "Gravity is winning."
         ];
         setEggMockery(insults[Math.floor(Math.random() * insults.length)]);
     }

     if (isFormBroken) {
         triggerFeedback("PATHETIC", "text-critical", isEnraged ? -10 : -5); 
         triggerRecoil();
         triggerFlash('danger');
         Haptics.error();
         playSound('TAKE_DMG');
         return; 
     }

     if (minAngle > BAD_FORM_LIMIT) {
         triggerFeedback("WEAK DEPTH", "text-critical", isEnraged ? -10 : -5);
         triggerRecoil();
         triggerFlash('danger');
         Haptics.error();
         playSound('TAKE_DMG');
         return; 
     }

     setPlayerMana(prev => Math.min(100, prev + 5));

     // DAMAGE CALCULATION
     let damage = 10;
     let feedbackMsg = "GOOD";
     let feedbackCol = "text-yellow-400"; // Changed to yellow for standard

     if (minAngle < PERFECT_FORM_LIMIT) {
         damage = 15;
         feedbackMsg = "CRITICAL HIT!";
         feedbackCol = "text-green-400"; // Green for crit
         setPlayerMana(prev => Math.min(100, prev + 10)); 
         triggerFlash('success');
         Haptics.heavy();
         playSound('CRIT');
     } else {
         triggerFlash('warning');
         Haptics.medium();
         playSound('HIT');
     }

     if (isEnraged) {
         damage *= 2;
         feedbackMsg += " (RAGE)";
     }

     // APPLY DAMAGE
     const newHp = Math.max(0, enemyHpRef.current - damage);
     setEnemyCurrentHp(newHp);
     enemyHpRef.current = newHp;

     triggerFeedback(`${feedbackMsg} -${damage}`, feedbackCol, 0);

     totalRepsRef.current += 1;
     repsInSetRef.current += 1;
     
     setTotalReps(totalRepsRef.current);
     setRepsInSet(repsInSetRef.current);

     // VICTORY CHECK
     if (newHp <= 0) {
         handleEncounterClear();
         return;
     }

     // REST CHECK (Still force breaks per set limit)
     if (repsInSetRef.current >= repsTargetRef.current) {
         handleSetComplete();
     }
  };

  const handleSetComplete = () => {
     const encounter = getCurrentEncounter();
     
     if (currentSetRef.current < encounter.totalSets) {
        performEnemyAttack(encounter);
     } else {
        performEnemyAttack(encounter);
     }
  };

  // --- DEV TOOLS ---
  const forceCompleteSet = () => {
      Haptics.heavy();
      setEnemyCurrentHp(0);
      enemyHpRef.current = 0;
      handleEncounterClear();
  };

  const skipGatekeeper = () => {
      lastActivityTimeRef.current = Date.now();
      setPhase('COMBAT');
  };

  const performEnemyAttack = (encounter: Encounter) => {
      setPhase('ENEMY_TURN');
      Haptics.error();
      
      const buffs = activeBuffsRef.current;
      let dmg = encounter.damage;
      
      if (buffs.enraged) dmg = Math.floor(dmg * 2);
      if (buffs.ironSkin) dmg = Math.floor(dmg * 0.5);

      const dodgeChance = Math.min(50, profile.stats.agi);
      const roll = Math.random() * 100;
      
      if (roll < dodgeChance) {
          triggerFeedback("DODGED!", "text-blue-400", 0);
          playSound('CRIT'); 
          setTimeout(() => {
              setActiveBuffs({ 
                  ironSkin: false, 
                  enraged: false, 
                  mobility: false, 
                  stiffness: false 
              }); 
              startRestPhase('REST_TRAVERSAL', 15);
          }, 1000);
          return;
      }

      playSound('TAKE_DMG');
      triggerRecoil();
      triggerFlash('danger'); // Red Flash on Damage
      
      setTimeout(() => {
          triggerFeedback(`TOOK ${dmg} DMG`, "text-critical", -dmg);
          
          setActiveBuffs({ 
              ironSkin: false, 
              enraged: false, 
              mobility: false, 
              stiffness: false 
          }); 

          setTimeout(() => {
              if (playerHP - dmg <= 0) {
                  setPhase('SAFETY_STOP'); 
              } else {
                  startRestPhase('REST_TRAVERSAL', 15); 
              }
          }, 2000);
      }, 500);
  };

  const handleResumeCombat = () => {
      const encounter = getCurrentEncounter();
      
      if (currentSetRef.current < encounter.totalSets) {
          const nextSet = currentSetRef.current + 1;
          currentSetRef.current = nextSet;
          repsInSetRef.current = 0;
          setCurrentSet(nextSet);
          setRepsInSet(0);
      } else {
          repsInSetRef.current = 0;
          setRepsInSet(0);
      }
      
      setPlayerMana(prev => Math.min(100, prev + 10));

      setPhase('COMBAT'); 
      lastActivityTimeRef.current = Date.now();
  };

  const handleEncounterClear = () => {
      if (phaseRef.current === 'SOUL_HARVEST') return;
      
      // IMMEDIATE OVERRIDE to block render loops
      phaseRef.current = 'SOUL_HARVEST'; 
      
      Haptics.heavy();
      playSound('KILL');
      
      setEnemyCurrentHp(0);
      setPhase('SOUL_HARVEST');
      playSound('ABSORB');
  };

  const handleSoulHarvestComplete = () => {
      // Logic for Override Encounter (Single Boss)
      if (encounterOverride) {
          setPhase('VICTORY');
          return;
      }

      // Normal Dungeon Logic
      if (currentEncounterIndexRef.current >= DUNGEON_MAP.length - 1) {
          setPhase('VICTORY');
      } else {
          const nextIndex = currentEncounterIndexRef.current + 1;
          currentEncounterIndexRef.current = nextIndex;
          currentSetRef.current = 1;
          repsInSetRef.current = 0;

          setCurrentEncounterIndex(nextIndex);
          setCurrentSet(1);
          setRepsInSet(0);
          
          startRestPhase('REST_TRAVERSAL', 15);
      }
  };

  // --- ACTIONS ---
  const handleTacticalSkill = (skill: string) => {
      if (skill === 'HEAL') { 
          setPlayerMana(prev => Math.max(0, prev - 25)); 
          setPlayerHP(prev => Math.min(100, prev + 30));
          setActiveBuffs(prev => ({ ...prev, stiffness: false }));
          Haptics.medium();
      }
      else if (skill === 'PROVOKE') {
          setPlayerMana(prev => Math.min(100, prev + 10)); 
          setActiveBuffs(prev => ({ ...prev, enraged: true }));
          Haptics.heavy();
      }
      else if (skill === 'STRETCH') {
          setPlayerHP(prev => Math.min(100, prev + 10));
          setActiveBuffs(prev => ({ ...prev, mobility: true, stiffness: false }));
          Haptics.light();
      }
  };

  const triggerFeedback = (msg: string, color: string, hpChange: number) => {
      setFeedback(msg);
      setFeedbackColor(color);
      if (hpChange < 0) {
          setPlayerHP(prev => Math.max(0, prev + hpChange));
      }
      setTimeout(() => setFeedback(""), 1500);
  };

  const triggerRecoil = () => {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
  };

  const triggerFlash = (type: 'danger' | 'warning' | 'success') => {
      if (type === 'danger') setFlash('bg-red-500/40');
      if (type === 'warning') setFlash('bg-yellow-500/30');
      if (type === 'success') setFlash('bg-green-500/30');
      setTimeout(() => setFlash(null), 150);
  };

  // --- UTILS ---
  const calculateAngle = (a: any, b: any, c: any) => {
    if (!a || !b || !c) return 180;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const getSkeletonColor = (depth: number, state: RepState) => {
      if (state === 'UP') return '#FFFFFF';
      if (depth < PERFECT_FORM_LIMIT) return '#00FFFF'; 
      if (depth < GOOD_FORM_LIMIT) return '#00FF00'; 
      if (depth < BAD_FORM_LIMIT) return '#FFFF00'; 
      return '#FF003C'; 
  };

  const drawSkeleton = (ctx: CanvasRenderingContext2D, lm: any, w: number, h: number, color: string) => {
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    
    const connections = [
        [11, 12], // Shoulders
        [11, 13], [13, 15], // Left Arm
        [12, 14], [14, 16], // Right Arm
        [11, 23], [12, 24], // Torso
        [23, 24], // Hips
        [23, 25], [25, 27], // Left Leg
        [24, 26], [26, 28]  // Right Leg
    ];

    connections.forEach(([i, j]) => {
      const p1 = lm[i];
      const p2 = lm[j];
      if (p1 && p2 && (p1.visibility || 0) > 0.3 && (p2.visibility || 0) > 0.3) {
        ctx.beginPath();
        ctx.moveTo(p1.x * w, p1.y * h);
        ctx.lineTo(p2.x * w, p2.y * h);
        ctx.stroke();
      }
    });
  };

  const drawHipWarning = (ctx: CanvasRenderingContext2D, s: any, h: any, k: any, w: number, height: number) => {
      if (!s || !h || !k) return;
      ctx.beginPath();
      ctx.moveTo(s.x * w, s.y * height);
      ctx.lineTo(h.x * w, h.y * height);
      ctx.lineTo(k.x * w, k.y * height);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#FF003C'; 
      ctx.stroke();
  };

  const playSound = (type: 'HIT' | 'CRIT' | 'TAKE_DMG' | 'KILL' | 'ABSORB') => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      
      if (type === 'HIT') {
          // Punchy Noise Hit
          const bufferSize = ctx.sampleRate * 0.1; 
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = ctx.createGain();
          
          // Thud Osc
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
          
          noise.connect(noiseGain);
          noiseGain.connect(masterGain);
          osc.connect(masterGain);
          
          noiseGain.gain.setValueAtTime(0.5, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          
          masterGain.gain.setValueAtTime(0.5, now);
          masterGain.gain.linearRampToValueAtTime(0, now + 0.2);
          
          noise.start(now);
          osc.start(now);
          osc.stop(now + 0.2);
          
      } else if (type === 'CRIT') {
          // Sharp Metallic Ching
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
          
          const osc2 = ctx.createOscillator();
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(1200, now);
          osc2.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
          
          const gain = ctx.createGain();
          osc.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);
          
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.linearRampToValueAtTime(0, now + 0.3);
          
          osc.start(now);
          osc2.start(now);
          osc.stop(now + 0.3);
          osc2.stop(now + 0.3);

      } else if (type === 'TAKE_DMG') {
          // Low Dissonant Thud
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(80, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
          
          masterGain.gain.setValueAtTime(0.5, now);
          masterGain.gain.linearRampToValueAtTime(0, now + 0.4);
          
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.4);

      } else if (type === 'KILL') {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
          masterGain.gain.setValueAtTime(0.3, now);
          masterGain.gain.linearRampToValueAtTime(0, now + 0.5);
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.5);

      } else if (type === 'ABSORB') {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.linearRampToValueAtTime(800, now + 3.0); 
          masterGain.gain.setValueAtTime(0, now);
          masterGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
          masterGain.gain.linearRampToValueAtTime(0, now + 3.5);
          osc.connect(masterGain);
          osc.start(now);
          osc.stop(now + 3.5);
      }
  };

  // --- RENDER ---
  const activeEncounter = getCurrentEncounter();
  const monsterHpPercent = (enemyCurrentHp / enemyMaxHp) * 100;

  return (
    <motion.div 
        className="fixed inset-0 bg-[#02040a] text-white font-mono overflow-hidden"
        animate={screenShake ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.2 }}
    >
      {/* SVG FILTERS DEFINITION FOR EGG VISUALS */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
         <defs>
           <filter id="dragon-edge">
             <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
             <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
           </filter>
         </defs>
       </svg>

      {/* SCREEN FLASH OVERLAY */}
      <div className={`absolute inset-0 z-40 pointer-events-none transition-colors duration-150 ${flash || ''}`}></div>

      {/* 0. BACKGROUND LAYER - ATMOSPHERIC BLUE VOID */}
      <div className="absolute inset-0 z-0 bg-[#020617]"> {/* Deep Slate/Black Base */}
          
          {/* Main Blue Glow Center - Behind Monster */}
          <motion.div 
             animate={{ opacity: [0.5, 0.7, 0.5], scale: [1, 1.05, 1] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full h-[80vh]"
             style={{
                 background: 'radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.2) 0%, rgba(14, 165, 233, 0.05) 40%, rgba(2, 6, 23, 0) 70%)'
             }}
          />

          {/* Secondary Deep Blue Pulse */}
          <motion.div 
             animate={{ opacity: [0.2, 0.4, 0.2] }}
             transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,58,138,0.15),transparent_60%)] mix-blend-screen"
          />

          {/* Grid Floor - Cyan Tinted */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{
                   backgroundImage: `
                       linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '60px 60px',
                   // Inverted mask to keep center visible and fade edges
                   maskImage: 'radial-gradient(circle at 50% 30%, black 20%, transparent 90%)' 
               }}
          ></div>
          
          {/* Animated Fog - Subtle Blue Drift */}
          <div className="absolute inset-0 opacity-20 mix-blend-plus-lighter overflow-hidden pointer-events-none">
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_50%)] animate-spin-[60s_linear_infinite]"></div>
          </div>

          {/* Vignette - Strong fade to black at bottom for camera */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,#020617_90%)] pointer-events-none"></div>
      </div>

      {/* 1. MONSTER VISUAL (TOP CENTER) */}
      {(phase === 'COMBAT' || phase === 'ENEMY_TURN' || phase === 'SOUL_HARVEST') && (
          <MonsterVisual 
             activeEncounter={activeEncounter} 
             hpPercent={monsterHpPercent} 
             enemyHp={Math.max(0, enemyCurrentHp)}
             maxHp={enemyMaxHp}
             isDead={phase === 'SOUL_HARVEST'}
             mockMessage={eggMockery}
          />
      )}

      {/* 1.5 SOUL HARVEST OVERLAY */}
      {phase === 'SOUL_HARVEST' && (
          <SoulHarvest onComplete={handleSoulHarvestComplete} />
      )}

      {/* 2. CAMERA CONTAINER - LOWER MIDDLE */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[55vh] z-10 flex flex-col justify-end pointer-events-none">
          {/* Player Frame */}
          <div className="relative w-full h-full border-x-4 border-t-4 border-[#8b6c4e] rounded-t-xl overflow-hidden bg-black shadow-[0_-10px_50px_rgba(0,0,0,0.5)] ring-1 ring-black/50 pointer-events-auto">
              
              {/* The Video */}
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-90 scale-x-[-1]" playsInline muted autoPlay />
              
              {/* The Skeleton Canvas */}
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
              
              {/* POSTURE WARNING OVERLAY */}
              <AnimatePresence>
                  {postureWarning && (
                      <motion.div 
                         initial={{ opacity: 0 }} 
                         animate={{ opacity: 1 }} 
                         exit={{ opacity: 0 }}
                         className="absolute inset-0 z-50 bg-critical/40 backdrop-blur-sm flex items-center justify-center p-4 text-center"
                      >
                          <div className="bg-black border-2 border-critical p-4 shadow-[0_0_50px_red]">
                              <span className="material-symbols-outlined text-5xl text-critical animate-pulse mb-2">warning</span>
                              <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">{postureWarning}</h2>
                              <p className="text-xs font-mono text-critical mt-1 uppercase">FORM DEGRADATION DETECTED</p>
                          </div>
                      </motion.div>
                  )}
              </AnimatePresence>

              {/* GHOST OVERLAY (Gatekeeper + Stabilize) */}
              {(phase === 'GATEKEEPER' || phase === 'REST_STABILIZE') && (
                 <div className="absolute inset-0 z-50">
                     {phase === 'REST_STABILIZE' && (
                         <div className="absolute top-4 w-full text-center">
                             <p className="text-critical font-display font-bold text-xl animate-glitch">SYSTEM STABILIZING</p>
                         </div>
                     )}
                     <GhostOverlay 
                        poseData={poseData} 
                        canvasWidth={640} 
                        canvasHeight={480} 
                        exercise={exercise}
                        onCalibrationComplete={() => {
                            Haptics.heavy();
                            if (phase === 'REST_STABILIZE') {
                                handlePhaseTimeout(); 
                            } else {
                                lastActivityTimeRef.current = Date.now();
                                setPhase('COMBAT');
                            }
                        }} 
                     />
                     
                     {/* DEV TOOL: SKIP GATEKEEPER */}
                     {phase === 'GATEKEEPER' && (
                       <button 
                          onClick={skipGatekeeper}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 border border-primary/50 text-primary text-[10px] uppercase font-bold tracking-widest pointer-events-auto hover:bg-primary hover:text-black transition-all z-50"
                       >
                          [DEV: SKIP GATEKEEPER]
                       </button>
                     )}
                 </div>
              )}

              {/* Decorative scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none z-20"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] z-20 pointer-events-none"></div>
          </div>
          
          {/* Label */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#3b2d23] border border-[#8b6c4e] px-4 py-1 rounded-t-sm shadow-md">
              <p className="text-[10px] font-mono text-[#d4b483] font-bold tracking-widest">PLAYER_CAM_FEED</p>
          </div>
      </div>

      {/* 3. LOADING STATE */}
      {phase === 'INIT' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black gap-4 text-center">
          <p className="animate-pulse text-primary font-display text-xl tracking-[0.5em] uppercase">BOOTING_SYSTEM...</p>
          <p className="text-gray-500 font-mono text-[10px] tracking-tight">{debugMsg}</p>
          {(debugMsg.includes('STALL') || debugMsg.includes('SYNC')) && (
            <div className="flex flex-col gap-2 mt-4 items-center">
               <button 
                onClick={() => setPhase('PERMISSION')}
                className="px-6 py-2 border border-primary/50 text-primary font-display text-xs hover:bg-primary hover:text-black transition-all"
               >
                 FORCE START ENGINE
               </button>
               <button 
                onClick={() => window.location.reload()}
                className="text-[10px] text-gray-600 font-mono underline uppercase"
               >
                 Reload Application
               </button>
            </div>
          )}
        </div>
      )}
      {phase === 'PERMISSION' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          <div className="w-full max-w-md border border-primary/30 bg-black p-8 text-center">
            <h1 className="text-3xl font-display font-bold mb-4 text-white uppercase">Dungeon Access</h1>
            <CyberButton onClick={startEngine} icon="videocam">CONNECT NEURAL LINK</CyberButton>
          </div>
        </div>
      )}
      {phase === 'LOADING' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-primary font-mono text-xs animate-pulse">CALIBRATING_SENSORS...</p>
              <p className="text-[9px] text-gray-500 mt-2">{debugMsg}</p>
          </div>
      )}

      {/* 4. COMBAT HUD */}
      {(phase === 'COMBAT' || phase === 'ENEMY_TURN') && (
        <div className="absolute inset-0 z-40 flex flex-col justify-between p-4 pointer-events-none">
           {/* Top HUD */}
           <div className="flex justify-between items-start pointer-events-auto">
              <div className="w-32 bg-black/40 p-2 border border-white/10 backdrop-blur-sm rounded-sm">
                 <p className="text-[10px] text-gray-400 font-bold mb-1">PLAYER_HP</p>
                 <div className="h-4 bg-gray-900 border border-white/20 skew-x-[-10deg] overflow-hidden mb-2">
                    <motion.div className="h-full bg-white" animate={{ width: `${playerHP}%` }} />
                 </div>
                 
                 <p className="text-[10px] text-blue-400 font-bold mb-1">MANA</p>
                 <div className="h-2 bg-gray-900 border border-blue-500/50 skew-x-[-10deg] overflow-hidden">
                    <motion.div className="h-full bg-blue-500" animate={{ width: `${playerMana}%` }} />
                 </div>
                 <p className="text-[9px] text-primary/50 mt-2 font-mono tracking-tighter">
                     BUFFS: {activeBuffs.ironSkin ? "[IRON SKIN] " : ""}{activeBuffs.enraged ? "[BLOODLUST]" : ""}{activeBuffs.mobility ? "[LUBRICATED]" : ""}
                 </p>

                 {/* DEV TOOL: FORCE COMPLETE SET */}
                 <button 
                    onClick={forceCompleteSet}
                    className="mt-4 px-2 py-1 bg-white/10 border border-white/20 text-[8px] text-white hover:bg-primary hover:text-black transition-colors pointer-events-auto uppercase tracking-widest"
                 >
                    [DEV: FORCE]
                 </button>
              </div>

              <div className="text-right flex flex-col items-end">
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-6xl font-display font-black text-critical drop-shadow-[0_0_15px_red] tracking-tighter leading-none">
                       {activeEncounter.id === 999 ? '???' : enemyCurrentHp}
                    </span>
                    <div className="flex flex-col items-start leading-none">
                       <span className="text-[10px] text-gray-400 font-bold">ENEMY</span>
                       <span className="text-[10px] text-gray-400 font-bold">HP</span>
                    </div>
                 </div>
                 <div className="mt-2 flex items-center gap-2 bg-black/50 px-2 py-1 border border-critical/30 rounded-sm">
                    <span className="text-[10px] font-mono text-gray-400">PHASE</span>
                    <span className="text-lg font-bold text-white font-display leading-none">{currentSet}</span>
                    <span className="text-[10px] font-mono text-gray-400">/ {activeEncounter.totalSets}</span>
                 </div>
              </div>
           </div>

           {/* Feedback Center - Positioned higher now to not cover player */}
           <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-50 pointer-events-none">
                <AnimatePresence>
                    {feedback && (
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1.5, opacity: 1, y: 0 }}
                            exit={{ scale: 2, opacity: 0, y: -50 }}
                            className="relative flex items-center justify-center"
                        >
                            <h1 
                                className={`text-6xl font-black italic ${feedbackColor} tracking-tighter`}
                                style={{ 
                                    textShadow: '0px 0px 20px rgba(0,0,0,1), 4px 4px 0px rgba(0,0,0,1)',
                                    WebkitTextStroke: '2px black'
                                }}
                            >
                                {feedback}
                            </h1>
                        </motion.div>
                    )}
                </AnimatePresence>
           </div>
        </div>
      )}

      {/* 5. REST PROTOCOL PHASES */}
      <AnimatePresence>
          {phase === 'REST_TRAVERSAL' && (
             <TunnelView secondsRemaining={restTimer} totalDuration={25} />
          )}
          {phase === 'REST_TACTICAL' && (
              <TacticalOverlay 
                 playerHP={playerHP}
                 playerMana={playerMana}
                 enemyName={activeEncounter.name}
                 secondsRemaining={restTimer}
                 onSkill={handleTacticalSkill}
              />
          )}
      </AnimatePresence>

      {/* 6. SAFETY STOP / DEFEAT */}
      {phase === 'SAFETY_STOP' && (
         <div className="absolute inset-0 z-50 bg-red-900/90 flex flex-col items-center justify-center p-8 text-center pointer-events-auto">
             <h1 className="text-5xl font-display font-bold text-white mb-4">SYSTEM FAILURE</h1>
             <p className="text-lg font-mono text-red-200 mb-8">
                Vital signs critical. Mission Aborted.
             </p>
             <div className="bg-black/50 p-4 border border-red-500/50 mb-8">
                <p className="text-sm text-white font-bold">REWARD: +10 PITY XP</p>
                <p className="text-[10px] text-gray-400">Get up. Try again.</p>
             </div>
             <CyberButton onClick={() => onComplete({ reps: totalReps, name: activeEncounter.name })} icon="refresh">RETURN TO BASE</CyberButton>
         </div>
      )}

      {/* 7. VICTORY */}
      {phase === 'VICTORY' && (
        <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
              <h1 className="text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-600 mb-2 drop-shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                DUNGEON<br/>CLEARED
              </h1>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 mb-12 w-full max-w-md">
              <div className="bg-white/5 border border-white/10 p-4 rounded text-center">
                  <p className="text-xs text-gray-500 font-mono uppercase mb-1">Total Reps</p>
                  <p className="text-4xl font-bold text-white">{totalReps}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded text-center">
                  <p className="text-xs text-gray-500 font-mono uppercase mb-1">Iron Loot</p>
                  <p className="text-4xl font-bold text-yellow-400">+{Math.floor(totalReps * 3.5)}</p>
              </div>
          </div>
          
          <CyberButton onClick={() => onComplete({ reps: totalReps, name: "DUNGEON CLEARED" })} icon="home">RETURN TO BASE</CyberButton>
        </div>
      )}
    </motion.div>
  );
};

export default DungeonRun;
