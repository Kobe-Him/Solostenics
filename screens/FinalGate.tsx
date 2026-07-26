import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';

interface FinalGateProps {
  onNext: () => void;
}

const FinalGate: React.FC<FinalGateProps> = ({ onNext }) => {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'SELECT' | 'EMAIL' | 'PROCESSING'>('SELECT');
  const [processingStatus, setProcessingStatus] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = async () => {
    setShowGoogleModal(true);
    // Simulate the user interacting with the google popup
    await new Promise(r => setTimeout(r, 2500));
    setShowGoogleModal(false);
    
    setAuthMode('PROCESSING');
    setProcessingStatus('VERIFYING_TOKEN...');
    await new Promise(r => setTimeout(r, 1500));
    setProcessingStatus('AUTHENTICATED');
    await new Promise(r => setTimeout(r, 500));
    onNext();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setAuthMode('PROCESSING');
    setProcessingStatus('ENCRYPTING_CREDENTIALS...');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStatus('HANDSHAKE_ESTABLISHED...');
    await new Promise(r => setTimeout(r, 1000));
    setProcessingStatus('ACCESS_GRANTED');
    await new Promise(r => setTimeout(r, 500));
    onNext();
  };

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden items-center justify-center p-6">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      
      {/* MOCK GOOGLE MODAL */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="bg-white text-black w-full max-w-sm rounded-lg shadow-2xl overflow-hidden font-sans">
               {/* Mock Browser Header */}
               <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
                  <div className="flex gap-1">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white rounded px-2 text-[10px] text-gray-500 flex-1 text-center py-0.5">
                     accounts.google.com/signin/oauth
                  </div>
               </div>
               
               {/* Mock Content */}
               <div className="p-8 flex flex-col items-center">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Sign in with Google</h3>
                  <p className="text-sm text-gray-600 mb-8 text-center">Choose an account to continue to Project Solostenics</p>
                  
                  <div className="w-full space-y-2">
                     <div className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">H</div>
                        <div className="text-left">
                           <p className="text-sm font-medium">Hunter</p>
                           <p className="text-xs text-gray-500">hunter@example.com</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-sm">?</div>
                        <div className="text-left">
                           <p className="text-sm font-medium">Use another account</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 w-full flex justify-center">
                     <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Phase (Initial) */}
      {loading ? (
        <div className="text-center z-10 flex flex-col items-center justify-center w-full h-full space-y-8">
          <div className="relative">
             <div className="w-20 h-20 border-t-4 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,255,0.4)]"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary animate-pulse shadow-glow"></div>
             </div>
          </div>
          
          <motion.h2 
            animate={{ opacity: [0.6, 1, 0.6], textShadow: ["0 0 10px #00FFFF", "0 0 20px #00FFFF", "0 0 10px #00FFFF"] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-3xl font-display font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
          >
            Synchronizing...
          </motion.h2>
          
          <div className="font-mono text-xs text-primary space-y-3 text-left w-72 mx-auto bg-black/60 p-5 border border-primary/20 backdrop-blur-md rounded-sm shadow-lg">
             <p className="animate-pulse drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">&gt; GENERATING_DUNGEON_01...</p>
             <p className="animate-pulse delay-75 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">&gt; SPAWNING_MOBS...</p>
             <p className="animate-pulse delay-150 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">&gt; CALIBRATING_PAIN_SENSORS...</p>
          </div>
        </div>
      ) : (
        /* Auth Phase */
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="z-10 w-full max-w-md text-center flex flex-col items-center justify-center gap-10 h-full"
        >
          {/* Header Group */}
          <div className="flex flex-col items-center gap-6">
            <div className="border border-primary bg-primary/10 px-6 py-2 animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.3)]">
               <span className="font-mono text-sm font-bold text-primary tracking-[0.2em] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">ACCESS GRANTED</span>
            </div>

            <div className="relative">
               <h1 className="font-display text-5xl md:text-6xl font-bold text-white uppercase leading-none drop-shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                  Create<br/><span className="text-white/90">Account</span>
               </h1>
            </div>
            
            <p className="font-mono text-sm text-primary/80 max-w-xs mx-auto drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
              Save your progress. Do not lose your soul.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'SELECT' && (
              <motion.div 
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-6"
              >
                 {/* Google Sign In */}
                 <button 
                    onClick={handleGoogleLogin}
                    className="w-full h-14 bg-white text-black font-sans font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors rounded-sm relative overflow-hidden group shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">Sign in with Google</span>
                 </button>

                 {/* Email Sign In */}
                 <CyberButton onClick={() => setAuthMode('EMAIL')} variant="ghost" fullWidth icon="mail">
                    Sign in with Email
                 </CyberButton>
              </motion.div>
            )}

            {authMode === 'EMAIL' && (
              <motion.form 
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleEmailLogin}
                className="w-full space-y-6 text-left bg-black/80 p-8 border border-primary/20 rounded-sm backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              >
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono text-primary tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">EMAIL_ADDRESS</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black border border-primary/40 p-4 text-white font-mono focus:border-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all placeholder:text-gray-700"
                      placeholder="hunter@savage.system"
                      autoFocus
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono text-primary tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">PASSWORD</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black border border-primary/40 p-4 text-white font-mono focus:border-primary focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all placeholder:text-gray-700"
                      placeholder="••••••••"
                    />
                 </div>

                 <div className="pt-4 space-y-4">
                    <CyberButton variant="primary" fullWidth icon="login">
                       ESTABLISH LINK
                    </CyberButton>
                    <button 
                      type="button"
                      onClick={() => setAuthMode('SELECT')}
                      className="w-full text-center text-[10px] font-mono text-gray-500 hover:text-white uppercase tracking-widest hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all"
                    >
                       &lt; RETURN_TO_GATE
                    </button>
                 </div>
              </motion.form>
            )}

            {authMode === 'PROCESSING' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full py-8 space-y-8 flex flex-col items-center"
              >
                 <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,255,255,0.6)]"></div>
                    <div className="absolute inset-3 border-r-2 border-critical rounded-full animate-spin direction-reverse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="material-symbols-outlined text-white text-4xl animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">fingerprint</span>
                    </div>
                 </div>
                 <p className="font-mono text-sm text-primary animate-pulse tracking-widest drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
                    {processingStatus}
                 </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Decorative Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
         <p className="font-mono text-[8px] text-white/20 tracking-[0.5em] drop-shadow-sm">SYSTEM_VERSION_1.0.4</p>
      </div>
    </div>
  );
};

export default FinalGate;