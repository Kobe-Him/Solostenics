import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberButton from '../components/ui/CyberButton';

interface PaymentGatewayProps {
  onNext: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onNext }) => {
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;
    
    setProcessing(true);
    // Simulate API call / Encryption
    await new Promise(r => setTimeout(r, 2000));
    setComplete(true);
    // Success animation time
    await new Promise(r => setTimeout(r, 2000));
    onNext();
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <header className="relative z-10 flex justify-end items-center pb-6 border-b border-primary/20 mb-6">
         <div className="flex items-center gap-2 text-right">
            <div>
               <h1 className="font-display font-bold text-xl text-white tracking-wider leading-none">SECURE CHECKOUT</h1>
               <p className="font-mono text-[9px] text-primary/60 tracking-widest">ENCRYPTED_CHANNEL_TLS_1.3</p>
            </div>
            <span className="material-symbols-outlined text-primary text-xl">lock_clock</span>
         </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full">
         
         {/* Order Summary */}
         <div className="bg-[#0a0a0a] border border-primary/30 p-4 mb-6 relative">
             <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-primary"></div>
             <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-primary"></div>
             
             <h3 className="font-mono text-xs text-gray-400 uppercase mb-3 border-b border-white/10 pb-1">Order Summary</h3>
             <div className="flex justify-between items-center mb-1">
                <span className="text-white font-display font-bold text-lg">HUNTER PASS</span>
                <span className="text-white font-mono text-lg">$9.99</span>
             </div>
             <div className="flex justify-between items-center text-xs text-gray-500 font-mono mb-2">
                <span>Monthly Subscription</span>
                <span>Recurring</span>
             </div>
             <div className="text-[10px] text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-sm">
                ITEM_ID: H_PASS_001
             </div>
         </div>

         {/* Payment Form */}
         <AnimatePresence mode="wait">
            {!complete ? (
               <motion.form 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handlePayment} 
                  className="space-y-4"
               >
                  <div className="space-y-1">
                     <label className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">Cardholder Name</label>
                     <input type="text" placeholder="HUNTER NAME" className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-primary focus:outline-none uppercase placeholder:text-gray-700" required />
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">Card Number</label>
                     <div className="relative">
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-primary focus:outline-none placeholder:text-gray-700" required maxLength={19} />
                        <span className="material-symbols-outlined absolute right-3 top-3 text-gray-500 text-sm">credit_card</span>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-primary focus:outline-none placeholder:text-gray-700" required maxLength={5} />
                     </div>
                     <div className="space-y-1 flex-1">
                        <label className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">CVC</label>
                        <input type="text" placeholder="123" className="w-full bg-black border border-white/20 p-3 text-white font-mono text-sm focus:border-primary focus:outline-none placeholder:text-gray-700" required maxLength={3} />
                     </div>
                  </div>

                  {/* Terms and Conditions Checkbox */}
                  <div className="pt-2 flex items-start gap-3 group cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                     <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-primary border-primary' : 'border-primary/50 bg-black group-hover:border-primary'}`}>
                        {termsAccepted && <span className="material-symbols-outlined text-black text-xs font-bold">check</span>}
                     </div>
                     <p className="text-[10px] text-gray-400 font-mono leading-tight flex-1 select-none">
                        I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>, <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>, and authorize the recurring monthly charge of $9.99 until cancelled.
                     </p>
                  </div>

                  <div className="pt-4">
                     {processing ? (
                        <div className="w-full h-14 bg-primary/10 border border-primary flex items-center justify-center gap-3">
                           <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                           <span className="font-mono text-xs text-primary animate-pulse tracking-widest">PROCESSING_TRANSACTION...</span>
                        </div>
                     ) : (
                        <CyberButton variant="primary" fullWidth icon="lock" disabled={!termsAccepted}>
                           AUTHORIZE $9.99
                        </CyberButton>
                     )}
                     <p className="text-center text-[9px] text-gray-600 font-mono mt-3">
                        <span className="material-symbols-outlined text-[10px] align-middle mr-1">verified_user</span>
                        Payments processed securely via Stripe (Simulated).
                        <br/>
                        <span className="text-[8px] opacity-60">LEGAL DISCLAIMER: This is a prototype interface. No real money is processed.</span>
                     </p>
                  </div>
               </motion.form>
            ) : (
               <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 border border-primary/50 bg-primary/5"
               >
                  <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                     <span className="material-symbols-outlined text-4xl text-primary">check</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">PAYMENT SUCCESSFUL</h2>
                  <p className="font-mono text-xs text-primary/80 tracking-widest">WELCOME TO THE ELITE.</p>
                  <p className="font-mono text-[10px] text-gray-500 mt-4">REDIRECTING...</p>
               </motion.div>
            )}
         </AnimatePresence>
      </main>
    </div>
  );
};

export default PaymentGateway;