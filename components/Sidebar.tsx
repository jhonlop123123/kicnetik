import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, ShieldCheck, Activity, Settings, PieChart, Hexagon } from 'lucide-react';

interface SidebarProps {
  mobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Market Feed' },
    { path: '/create', icon: Video, label: 'Mint Video' },
    { path: '/portfolio', icon: PieChart, label: 'Portfolio' },
    { path: '/security', icon: ShieldCheck, label: 'Rug Scanner' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const containerClasses = mobile
    ? "flex justify-around w-full"
    : "flex flex-col p-6 gap-8 h-full";

  const linkBaseClasses = mobile
    ? "flex flex-col items-center gap-1 p-2 text-xs"
    : "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium";

  return (
    <nav className={containerClasses}>
      {!mobile && (
        <div className="mb-8 px-4 flex items-center gap-3">
          {/* New Kinetic Shard Logo - Small Version */}
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
                <path d="M35 50 L70 25" stroke="url(#goldGradSmall)" strokeWidth="6" strokeLinecap="round" />
                <path d="M35 50 L70 75" stroke="url(#goldGradSmall)" strokeWidth="6" strokeLinecap="round" />
             </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 bg-clip-text text-transparent tracking-tighter font-[Space_Grotesk]">
              KINECTIC
            </h1>
            <p className="text-amber-500/60 text-[10px] uppercase tracking-[0.2em]">Elite Protocol</p>
          </div>
        </div>
      )}

      <div className={mobile ? "flex w-full justify-between" : "flex flex-col gap-2"}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                ${linkBaseClasses}
                ${active 
                  ? 'bg-amber-900/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900'}
              `}
            >
              <item.icon size={mobile ? 20 : 22} className={active ? "text-amber-400" : ""} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {!mobile && (
        <div className="mt-auto">
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
      )}
    </nav>
  );
};