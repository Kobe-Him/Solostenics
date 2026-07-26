
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GhostOverlayProps {
  poseData: any; // Raw MediaPipe landmarks
  canvasWidth: number;
  canvasHeight: number;
  onCalibrationComplete: () => void;
  exercise?: string;
}

const GhostOverlay: React.FC<GhostOverlayProps> = ({ poseData, canvasWidth, canvasHeight, onCalibrationComplete, exercise }) => {
  const [status, setStatus] = useState<'SEARCHING' | 'GET_DOWN' | 'STRAIGHTEN_UP' | 'TOO_CLOSE' | 'TOO_FAR' | 'ALIGNING' | 'LOCKED'>('SEARCHING');
  const [lockTimer, setLockTimer] = useState(0);

  // Helper: Angle between 3 points
  const calculateAngle = (a: any, b: any, c: any) => {
    if (!a || !b || !c) return 0;
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  useEffect(() => {
    if (!poseData) {
      setStatus('SEARCHING');
      setLockTimer(0);
      return;
    }

    // 1. Get Landmarks
    const leftShoulder = poseData[11];
    const rightShoulder = poseData[12];
    const leftHip = poseData[23];
    const rightHip = poseData[24];
    const leftKnee = poseData[25];
    const rightKnee = poseData[26];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) return;

    // Visibility Check
    const visibility = (leftShoulder.visibility + leftHip.visibility + leftKnee.visibility) / 3;
    if (visibility < 0.5) {
      setStatus('SEARCHING');
      setLockTimer(0);
      return;
    }

    // 2. CHECK ORIENTATION
    const midShoulderX = (leftShoulder.x + rightShoulder.x) / 2;
    const midShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const midHipX = (leftHip.x + rightHip.x) / 2;
    const midHipY = (leftHip.y + rightHip.y) / 2;

    const dx = Math.abs(midShoulderX - midHipX);
    const dy = Math.abs(midShoulderY - midHipY);

    const isSquat = exercise === 'SQUATS';

    if (isSquat) {
        if (dx > dy * 1.1) {
            setStatus('GET_DOWN'); // Reuse same status or maybe add STAND_UP? I'll keep it simple
            setLockTimer(0);
            return;
        }
    } else {
        if (dy > dx) {
            setStatus('GET_DOWN'); // Tell user to get into plank
            setLockTimer(0);
            return;
        }
    }

    // 3. CHECK POSTURE (Hip Angle)
    // Are they sitting? (Hip angle ~90) or Straight (~180)?
    // Use the side that is most visible
    const isLeftVisible = leftShoulder.visibility > rightShoulder.visibility;
    const shoulder = isLeftVisible ? leftShoulder : rightShoulder;
    const hip = isLeftVisible ? leftHip : rightHip;
    const knee = isLeftVisible ? leftKnee : rightKnee;

    const hipAngle = calculateAngle(shoulder, hip, knee);
    
    // Allow some bend (pike/sag), but sitting is usually < 120
    if (hipAngle < 140) {
        setStatus('STRAIGHTEN_UP'); // Tell user to un-bend knees/hips
        setLockTimer(0);
        return;
    }

    // 4. CHECK DISTANCE (Frame fill)
    const bodyLen = Math.sqrt(dx*dx + dy*dy); 
    
    if (bodyLen > 0.85) {
      setStatus('TOO_CLOSE');
      setLockTimer(0);
    } else if (bodyLen < 0.25) {
      setStatus('TOO_FAR');
      setLockTimer(0);
    } else {
      // 5. ALL GOOD
      setStatus('LOCKED');
      setLockTimer(prev => prev + 1);
    }
  }, [poseData]);

  useEffect(() => {
    if (lockTimer > 45) { // Approx 1.5 seconds
      onCalibrationComplete();
    }
  }, [lockTimer, onCalibrationComplete]);

  const getMessage = () => {
    const isSquat = exercise === 'SQUATS';
    switch (status) {
      case 'SEARCHING': return "SHOW FULL BODY";
      case 'GET_DOWN': return isSquat ? "STAND UP STRAIGHT" : "ASSUME PLANK POSITION";
      case 'STRAIGHTEN_UP': return isSquat ? "STRAIGHTEN BACK" : "STRAIGHTEN HIPS";
      case 'TOO_CLOSE': return "BACK UP";
      case 'TOO_FAR': return "COME CLOSER";
      case 'LOCKED': return "SYNCING...";
      default: return "INITIALIZING";
    }
  };

  const getColor = () => {
    switch (status) {
      case 'GET_DOWN':
      case 'STRAIGHTEN_UP':
      case 'TOO_CLOSE': 
      case 'TOO_FAR': return 'border-critical text-critical';
      case 'LOCKED': return 'border-primary text-primary';
      default: return 'border-white/50 text-white';
    }
  };

  return (
    <div className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-300 pointer-events-none`}>
       {/* The Gatekeeper Box */}
       <div className={`relative transition-all duration-300 ${status === 'LOCKED' ? 'w-[90%] h-[90%]' : 'w-[70%] h-[50%]'} border-4 ${getColor()} flex items-center justify-center bg-black/40 backdrop-blur-[2px]`}>
          
          {/* Corner Markers */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 -translate-x-1 -translate-y-1 ${getColor()}`}></div>
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 translate-x-1 -translate-y-1 ${getColor()}`}></div>
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 -translate-x-1 translate-y-1 ${getColor()}`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 translate-x-1 translate-y-1 ${getColor()}`}></div>

          {/* Status Text */}
          <div className="text-center">
             <h2 className={`text-4xl font-display font-black uppercase tracking-widest drop-shadow-md ${status === 'LOCKED' ? 'text-primary animate-pulse' : 'text-white'}`}>
                {getMessage()}
             </h2>
             {/* Subtext for errors */}
             {status === 'GET_DOWN' && <p className="text-white bg-black font-mono text-sm mt-2">{exercise === 'SQUATS' ? 'SYSTEM REQUIRES VERTICAL FORM' : 'SYSTEM REQUIRES HORIZONTAL FORM'}</p>}
             {status === 'STRAIGHTEN_UP' && <p className="text-white bg-black font-mono text-sm mt-2">{exercise === 'SQUATS' ? 'RE-ALIGN YOUR POSTURE' : 'KNEES/HIPS MUST BE STRAIGHT'}</p>}
             
             {status === 'LOCKED' && (
                <div className="w-64 h-2 bg-gray-800 rounded-full mt-4 mx-auto overflow-hidden border border-primary/50">
                   <motion.div 
                     className="h-full bg-primary shadow-[0_0_10px_#00FFFF]"
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.min(100, (lockTimer / 45) * 100)}%` }}
                   />
                </div>
             )}
          </div>
       </div>

       {/* Scanline Effect */}
       <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default GhostOverlay;
