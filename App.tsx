
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Feed } from './components/Feed';
import { CreateVideo } from './components/CreateVideo';
import { SecurityScanner } from './components/SecurityScanner';
import { WalletButton } from './components/WalletButton';
import { LandingPage } from './components/LandingPage';
import { Settings } from './components/Settings';
import { Portfolio } from './components/Portfolio';
import { UserProfile } from './components/UserProfile';
import { Leaderboard } from './components/Leaderboard';
import { Protocol } from './components/Protocol';
import { WalletContext, UserContext } from './types';
import { ToastProvider } from './components/Toast';
import { PieChart } from 'lucide-react';

const App: React.FC = () => {
  // Auth State Machine: 'landing' | 'biometrics' | 'profile' | 'app'
  const [authState, setAuthState] = useState<'landing' | 'biometrics' | 'profile' | 'app'>('landing');
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const [userProfile, setUserProfile] = useState({
    username: "CryptoNomad",
    handle: "@nomad_sol",
    avatar: "https://picsum.photos/seed/user1/100/100",
    isBiometricVerified: false
  });

  const connectWallet = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setWalletConnected(true);
    setWalletAddress("8xTr...9j2K");
    setAuthState('biometrics');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setAuthState('landing');
    setUserProfile(prev => ({ ...prev, isBiometricVerified: false }));
  };

  const verifyBiometrics = async () => {
    // The LandingPage handles the timing of the complex sequence now
    setUserProfile(prev => ({ ...prev, isBiometricVerified: true }));
    setAuthState('profile');
  };

  const completeProfile = (name: string, handle: string) => {
    setUserProfile(prev => ({ ...prev, username: name, handle: handle }));
    setAuthState('app');
  };

  const updateProfile = (data: { name?: string; handle?: string; avatar?: string }) => {
    setUserProfile(prev => ({
        ...prev,
        username: data.name || prev.username,
        handle: data.handle || prev.handle,
        avatar: data.avatar || prev.avatar
    }));
  };

  // Render logic based on state
  if (authState !== 'app') {
    return (
      <UserContext.Provider value={{ 
        ...userProfile, 
        updateProfile,
        setProfile: completeProfile, 
        verifyBiometrics 
      }}>
        <WalletContext.Provider value={{ 
          connected: walletConnected, 
          address: walletAddress, 
          connect: connectWallet, 
          disconnect: disconnectWallet 
        }}>
          <LandingPage 
            currentStep={authState} 
            onBiometricSuccess={verifyBiometrics}
            onProfileComplete={completeProfile}
          />
        </WalletContext.Provider>
      </UserContext.Provider>
    );
  }

  return (
    <ToastProvider>
      <UserContext.Provider value={{ 
        ...userProfile, 
        updateProfile,
        setProfile: completeProfile, 
        verifyBiometrics 
      }}>
        <WalletContext.Provider value={{ 
          connected: walletConnected, 
          address: walletAddress, 
          connect: connectWallet, 
          disconnect: disconnectWallet 
        }}>
          <Router>
            <div className="flex h-screen bg-black text-slate-200 overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
              {/* Sidebar (Desktop) */}
              <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 backdrop-blur-xl">
                <Sidebar />
              </div>

              {/* Mobile Header / Main Content Wrapper */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Top Bar */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 z-30 shrink-0">
                  <div className="md:hidden flex items-center gap-2">
                     {/* Mini Logo for Mobile */}
                     <div className="w-8 h-8 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                            <defs>
                              <linearGradient id="goldGradMob" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#FCD34D" />
                                  <stop offset="100%" stopColor="#B45309" />
                              </linearGradient>
                            </defs>
                            <path d="M50 0 L95 25 V75 L50 100 L5 75 V25 Z" fill="none" stroke="url(#goldGradMob)" strokeWidth="4" />
                            <path d="M35 25 L35 75" stroke="url(#goldGradMob)" strokeWidth="6" strokeLinecap="round" />
                            <path d="M35 50 L70 20" stroke="url(#goldGradMob)" strokeWidth="6" strokeLinecap="round" />
                            <path d="M35 50 L70 80" stroke="url(#goldGradMob)" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                     </div>
                     <span className="font-bold text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600">
                      KINECTIC
                     </span>
                  </div>
                  
                  <div className="hidden md:block font-medium text-slate-400 text-xs uppercase tracking-wider">
                    Solana Mainnet <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-2 animate-pulse"></span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Mobile Portfolio Shortcut */}
                    <Link to="/portfolio" className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-amber-400 bg-slate-900/80 border border-slate-700 active:scale-95 transition-transform">
                       <PieChart size={18} />
                    </Link>
                    <WalletButton />
                  </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto scroll-smooth relative">
                   {/* Mobile Bottom Nav Spacing */}
                   <div className="pb-24 md:pb-8 p-4 md:p-8 min-h-full">
                      {/* Dynamic Background Gradient (Gold Theme) */}
                      <div className="fixed inset-0 pointer-events-none z-0">
                          <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-600/10 rounded-full blur-[80px] md:blur-[120px]" />
                          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-slate-800/20 rounded-full blur-[80px] md:blur-[120px]" />
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                      </div>
                      
                      <div className="relative z-10 max-w-5xl mx-auto">
                        <Routes>
                          <Route path="/" element={<Feed />} />
                          <Route path="/leaderboard" element={<Leaderboard />} />
                          <Route path="/u/:handle" element={<UserProfile />} />
                          <Route path="/create" element={<CreateVideo />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/security" element={<SecurityScanner />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/protocol" element={<Protocol />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </div>
                   </div>
                </main>

                {/* Mobile Bottom Nav (Fixed Dock) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
                  <Sidebar mobile />
                </div>
              </div>
            </div>
          </Router>
        </WalletContext.Provider>
      </UserContext.Provider>
    </ToastProvider>
  );
};

export default App;
