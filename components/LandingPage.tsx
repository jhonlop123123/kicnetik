import React, { useContext, useState, useEffect } from 'react';
import { Wallet, Fingerprint, ScanFace, ArrowRight, Diamond, Zap, Lock, Eye, Grid3X3 } from 'lucide-react';
import { WalletContext } from '../types';

interface LandingPageProps {
  currentStep: 'landing' | 'biometrics' | 'profile' | 'app';
  onBiometricSuccess: () => void;
  onProfileComplete: (name: string, handle: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ currentStep, onBiometricSuccess, onProfileComplete }) => {
  const { connect } = useContext(WalletContext);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  
  // Quantum Bio-Shield States
  // 0: Inactive, 1: Fingerprint, 2: Retina, 3: Pattern, 4: Complete
  const [verificationStage, setVerificationStage] = useState(0);
  const [patternInput, setPatternInput] = useState<number[]>([]);

  // Auto-advance logic for biometrics
  useEffect(() => {
    if (currentStep === 'biometrics' && verificationStage === 0) {
      setVerificationStage(1);
      
      // Stage 1: Fingerprint (2s)
      setTimeout(() => {
        setVerificationStage(2);
        
        // Stage 2: Retina (2s)
        setTimeout(() => {
            setVerificationStage(3);
            // Stops at 3, waits for user Pattern input
        }, 2500);

      }, 2500);
    }
  }, [currentStep, verificationStage]);

  const handlePatternClick = (nodeId: number) => {
    if (verificationStage !== 3) return;
    
    const newPattern = [...patternInput, nodeId];
    setPatternInput(newPattern);

    // Mock validation: assume any 4-node pattern is correct for this demo
    if (newPattern.length >= 4) {
        setTimeout(() => {
            setVerificationStage(4);
            setTimeout(() => {
                onBiometricSuccess();
            }, 1000);
        }, 500);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && handle) {
      onProfileComplete(name, handle.startsWith('@') ? handle : `@${handle}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-slate-200 relative overflow-hidden flex items-center justify-center font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] opacity-60" />
         <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[150px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-20 w-full max-w-lg p-6 flex flex-col items-center">
        
        {/* NEW LOGO: KINETIC SHARD */}
        <div className="mb-12 flex flex-col items-center animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="relative w-28 h-28 mb-6 group">
             <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full group-hover:bg-amber-400/30 transition-all duration-700"></div>
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl relative z-10">
                <defs>
                   <linearGradient id="goldGradLP" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#78350F" />
                   </linearGradient>
                </defs>
                <path d="M50 2 L98 27 V73 L50 98 L2 73 V27 Z" fill="none" stroke="url(#goldGradLP)" strokeWidth="1.5" className="opacity-40" />
                <path d="M35 25 L35 75" stroke="url(#goldGradLP)" strokeWidth="8" strokeLinecap="round" className="drop-shadow-lg" />
                <path d="M35 50 L70 20" stroke="url(#goldGradLP)" strokeWidth="8" strokeLinecap="round" className="drop-shadow-lg" />
                <path d="M35 50 L70 80" stroke="url(#goldGradLP)" strokeWidth="8" strokeLinecap="round" className="drop-shadow-lg" />
                <circle cx="35" cy="50" r="4" fill="#FFF" className="animate-pulse" />
             </svg>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-sm font-[Space_Grotesk]">
            KINECTIC
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-4 mb-2"></div>
          <p className="text-amber-500/80 text-sm tracking-[0.3em] uppercase font-semibold">The Viral Asset Protocol</p>
        </div>

        {/* CONTAINER CARD */}
        <div className="w-full backdrop-blur-xl bg-slate-950/40 border border-amber-500/20 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.05)] overflow-hidden relative min-h-[450px] flex flex-col justify-center">
           <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>

          {/* STEP 1: LANDING / CONNECT */}
          {currentStep === 'landing' && (
            <div className="p-8 md:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="text-center space-y-4">
                 <h2 className="text-2xl font-light text-white">
                    Turn <span className="font-serif italic text-amber-400">Attention</span> into <span className="font-serif italic text-amber-400">Equity</span>
                 </h2>
                 <p className="text-slate-400 leading-relaxed text-sm">
                   The first decentralized social exchange. Mint video moments as liquid assets. Verified by Solana.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                    <Diamond size={20} className="text-amber-400 mb-2" />
                    <span className="text-xs text-slate-300">Proof of Virality</span>
                 </div>
                 <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center">
                    <Zap size={20} className="text-amber-400 mb-2" />
                    <span className="text-xs text-slate-300">Instant Liquidity</span>
                 </div>
              </div>
              
              <button 
                onClick={() => connect()}
                className="group w-full relative overflow-hidden bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Wallet size={20} className="stroke-[2.5px]" />
                  <span>Connect Wallet</span>
                </div>
              </button>
              
              <div className="flex justify-center gap-6 text-[10px] text-slate-600 uppercase tracking-widest">
                 <span>Powered by Solana</span>
                 <span>•</span>
                 <span>Quantum Secure</span>
              </div>
            </div>
          )}

          {/* STEP 2: QUANTUM TRINITY (3-STEP BIOMETRICS) */}
          {currentStep === 'biometrics' && (
            <div className="p-10 flex flex-col items-center justify-center animate-in fade-in duration-500">
              
              <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                
                {/* Base Ring */}
                <div className="absolute inset-0 border border-amber-900/50 rounded-full"></div>
                
                {/* Rotating Scanners */}
                <div className={`absolute inset-0 border-2 border-amber-400/60 rounded-full border-t-transparent animate-spin`} style={{ animationDuration: '2s' }}></div>
                <div className={`absolute inset-4 border-2 border-amber-200/40 rounded-full border-b-transparent animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                
                {/* ICON DISPLAY AREA */}
                <div className="relative z-10 p-6 bg-black/80 rounded-full backdrop-blur-sm border border-amber-500/20 w-32 h-32 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                   {verificationStage === 1 && (
                       <Fingerprint size={48} className="text-amber-400 animate-pulse" />
                   )}
                   {verificationStage === 2 && (
                       <Eye size={48} className="text-cyan-400 animate-pulse" />
                   )}
                   {verificationStage >= 3 && (
                       <Lock size={48} className="text-purple-400" />
                   )}
                </div>
              </div>

              {/* TEXT FEEDBACK */}
              <div className="text-center space-y-2 mb-8">
                  <h2 className="text-2xl font-bold text-white">Quantum Bio-Shield</h2>
                  <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest">
                      <span className={verificationStage >= 1 ? "text-amber-400" : "text-slate-700"}>Touch</span>
                      <span className="text-slate-700">→</span>
                      <span className={verificationStage >= 2 ? "text-cyan-400" : "text-slate-700"}>Retina</span>
                      <span className="text-slate-700">→</span>
                      <span className={verificationStage >= 3 ? "text-purple-400" : "text-slate-700"}>Pattern</span>
                  </div>
              </div>

              {/* PATTERN INTERFACE (Only shows in stage 3) */}
              {verificationStage === 3 && (
                  <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                      <p className="text-center text-slate-400 text-xs mb-4">Verify Neural Pattern</p>
                      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((nodeId) => (
                              <button
                                key={nodeId}
                                onClick={() => handlePatternClick(nodeId)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${patternInput.includes(nodeId) ? 'bg-purple-400 shadow-[0_0_10px_#A855F7] scale-125' : 'bg-slate-700 hover:bg-slate-500'}`}
                              />
                          ))}
                      </div>
                  </div>
              )}

              {verificationStage === 4 && (
                  <div className="text-green-400 font-bold animate-pulse">ACCESS GRANTED</div>
              )}
            </div>
          )}

          {/* STEP 3: PROFILE */}
          {currentStep === 'profile' && (
            <div className="p-8 md:p-10 animate-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                   <div className="w-12 h-12 rounded-full bg-green-900/20 border border-green-500/30 flex items-center justify-center">
                       <ScanFace size={24} className="text-green-400" />
                   </div>
                   <div>
                       <h3 className="text-white font-bold text-lg">Identity Verified</h3>
                       <p className="text-slate-500 text-xs">Wallet: 8xTr...9j2K</p>
                   </div>
               </div>
               <h2 className="text-3xl font-light text-white mb-6">Mint Your <span className="text-amber-400">Profile</span></h2>
               <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="group">
                    <label className="block text-xs text-amber-500/70 uppercase tracking-wider mb-2 group-focus-within:text-amber-400 transition-colors">Display Name</label>
                    <input 
                       type="text" 
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       className="w-full bg-black/50 border-b border-slate-700 focus:border-amber-500 p-4 text-white outline-none transition-all placeholder:text-slate-700 font-serif text-lg"
                       placeholder="Satoshi Nakamoto"
                       required
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs text-amber-500/70 uppercase tracking-wider mb-2 group-focus-within:text-amber-400 transition-colors">Handle</label>
                    <input 
                       type="text" 
                       value={handle}
                       onChange={(e) => setHandle(e.target.value)}
                       className="w-full bg-black/50 border-b border-slate-700 focus:border-amber-500 p-4 text-white outline-none transition-all placeholder:text-slate-700 font-mono"
                       placeholder="@crypto_king"
                       required
                    />
                  </div>
                  <button 
                   type="submit"
                   disabled={!name || !handle}
                   className="w-full mt-8 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all shadow-lg hover:shadow-amber-500/20"
                  >
                    <span>Initialize Protocol</span> <ArrowRight size={18} />
                  </button>
               </form>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-700">By connecting, you agree to the <span className="text-slate-500 hover:text-amber-500 cursor-pointer transition-colors">Smart Contract Protocol</span> terms.</p>
        </div>

      </div>
      
      <style>{`
        @keyframes scan {
            0%, 100% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};