import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Video, ShieldCheck, Activity, Settings, PieChart } from 'lucide-react';

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
        <div className="mb-4 px-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tighter">
            KINECTIC
          </h1>
          <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Viral Protocol</p>
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
                  ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
              `}
            >
              <item.icon size={mobile ? 20 : 22} className={active ? "text-cyan-400" : ""} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {!mobile && (
        <div className="mt-auto">
           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} className="text-green-400" />
                <span className="text-xs font-bold text-slate-300">SOL MARKET</span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Price:</span> <span className="text-green-400 font-mono">$143.20</span>
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Vol:</span> <span className="text-slate-200 font-mono">2.1B</span>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};