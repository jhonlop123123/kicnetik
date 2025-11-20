
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, ShieldCheck, Activity, Settings, PieChart, Trophy, Plus } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Mobile Navigation Configuration
  // We only show specific items in the bottom dock
  const mobileNavItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/leaderboard', icon: Trophy, label: 'Top' },
    { path: '/create', icon: Plus, label: 'Mint', highlight: true }, // Special Central Button
    { path: '/security', icon: ShieldCheck, label: 'Scan' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const desktopNavItems = [
    { path: '/', icon: Home, label: 'Market Feed' },
    { path: '/create', icon: Video, label: 'Mint Video' },
    { path: '/leaderboard', icon: Trophy, label: 'Elite 100' },
    { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { path: '/security', icon: ShieldCheck, label: 'Rug Scanner' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  // RENDER MOBILE BOTTOM DOCK
  if (mobile) {
    return (
        <>
        {/* Gradient Fade at bottom for smooth scrolling content disappearance */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        
        <nav className="bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 pb-safe-area-bottom px-2">
            <div className="flex justify-around items-center h-16 relative">
                {mobileNavItems.map((item) => {
                    const active = isActive(item.path);
                    
                    // Special styling for the Central "Mint" Button
                    if (item.highlight) {
                        return (
                            <Link key={item.path} to={item.path} className="relative -top-5 group">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 ${active ? 'bg-amber-400 scale-110' : 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white hover:scale-105'}`}>
                                    <item.icon size={28} className={active ? 'text-black' : 'text-black'} strokeWidth={2.5} />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 h-full space-y-1 transition-colors ${active ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                            {/* Optional: tiny dot for active state instead of text */}
                            {active && <div className="w-1 h-1 bg-amber-400 rounded-full absolute bottom-2" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
        </>
    );
  }

  // RENDER DESKTOP SIDEBAR
  return (
    <nav className="flex flex-col p-6 gap-8 h-full">
      <div className="mb-8 px-4 flex items-center gap-3">
          {/* Kinetic Shard Logo - Desktop */}
          <div className="relative w-10 h-10 flex-shrink-0">
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                <defs>
                   <linearGradient id="goldGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="100%" stopColor="#B45309" />
                   </linearGradient>
                </defs>
                <path d="M50 0 L95 25 V75 L50 100 L5 75 V25 Z" fill="none" stroke="url(#goldGradSmall)" strokeWidth="4" />
                <path d="M35 25 L35 75" stroke="url(#goldGradSmall)" strokeWidth="6" strokeLinecap="round" />
                <path d="M35 50 L70 20" stroke="url(#goldGradSmall)" strokeWidth="6" strokeLinecap="round" />
                <path d="M35 50 L70 80" stroke="url(#goldGradSmall)" strokeWidth="6" strokeLinecap="round" />
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tighter font-[Space_Grotesk]">
              KINECTIC
            </h1>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-[0.2em]">Elite Protocol</p>
          </div>
      </div>

      <div className="flex flex-col gap-2">
        {desktopNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                ${active 
                  ? 'bg-amber-900/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'}
              `}
            >
              <item.icon size={22} className={active ? "text-amber-400" : ""} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto">
           {/* Sidebar Widget - Top Movers */}
           <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 px-2">Top Gainers (24h)</h4>
              <div className="space-y-2">
                 {['$NEON', '$ICE', '$VEO'].map((ticker, i) => (
                    <div key={ticker} className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-green-500/30 transition-colors cursor-pointer">
                       <span className="font-mono text-xs text-slate-300">{ticker}</span>
                       <span className="font-mono text-xs text-green-400">+{120 - (i*30)}%</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Activity size={16} className="text-green-500" />
                <span className="text-xs font-bold text-slate-300">SOL ORACLE</span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between relative z-10">
                <span>Price:</span> <span className="text-green-400 font-mono">$143.20</span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between relative z-10">
                <span>TPS:</span> <span className="text-amber-400 font-mono">2,450</span>
              </div>
           </div>
        </div>
    </nav>
  );
};
