
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { WalletContext, UserContext } from './types';
import { ToastProvider } from './components/Toast';

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
              {/* Sidebar */}
              <div className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950 backdrop-blur-xl">
                <Sidebar />
              </div>

              {/* Mobile Header / Main Content Wrapper */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Top Bar */}
                <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
                  <div className="md:hidden font-bold text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-600">
                    KINECTIC
                  </div>
                  <div className="hidden md:block font-medium text-slate-400 text-xs uppercase tracking-wider">
                    Solana Mainnet <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block ml-2 animate-pulse"></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <WalletButton />
                  </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
                   {/* Dynamic Background Gradient (Gold Theme) */}
                   <div className="fixed inset-0 pointer-events-none z-0">
                      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
                      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[120px]" />
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
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                   </div>
                </main>

                {/* Mobile Bottom Nav */}
                <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4">
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
