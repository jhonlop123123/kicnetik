
import React, { useContext, useState } from 'react';
import { UserContext, WalletContext } from '../types';
import { Shield, User, Bell, LogOut, Eye, Fingerprint, Users, Copy, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { username, handle, avatar, isBiometricVerified } = useContext(UserContext);
  const { disconnect, address } = useContext(WalletContext);
  const [copied, setCopied] = useState(false);

  const referralCode = "KINECTIC-AWAKEN-88";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
           <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
             <User size={20} className="text-cyan-400" /> Account
           </h3>
           <div className="flex items-center gap-4 mb-6">
             <img src={avatar} alt="Profile" className="w-16 h-16 rounded-full border-2 border-slate-700" />
             <div>
               <div className="font-bold text-xl text-white">{username}</div>
               <div className="text-slate-500">{handle}</div>
             </div>
             <button className="ml-auto text-sm bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
               Edit
             </button>
           </div>
        </div>

        {/* GROWTH / REFERRALS - NEW AGGRESSIVE FEATURE */}
        <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-24 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
           
           <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
             <Users size={20} className="text-amber-400" /> Expand the Network
           </h3>
           <p className="text-sm text-slate-400 mb-4">Bring the awakening to others. Earn 5% of trading fees from every user you unplug.</p>
           
           <div className="flex items-center gap-2 bg-black/50 border border-amber-500/20 p-3 rounded-xl">
              <div className="font-mono font-bold text-amber-100 tracking-wider flex-1">{referralCode}</div>
              <button 
                onClick={handleCopy}
                className="text-xs font-bold flex items-center gap-1 bg-amber-500 text-black px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors"
              >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'COPIED' : 'COPY CODE'}
              </button>
           </div>
        </div>

        {/* Security Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
           <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
             <Shield size={20} className="text-green-400" /> Security & Privacy
           </h3>
           
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
               <div className="flex items-center gap-3">
                 <Fingerprint className="text-slate-400" size={20} />
                 <div>
                   <div className="font-medium text-slate-200">Biometric Verification</div>
                   <div className="text-xs text-slate-500">Used for large transactions</div>
                 </div>
               </div>
               <div className={`px-3 py-1 rounded-full text-xs font-bold ${isBiometricVerified ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                 {isBiometricVerified ? 'ACTIVE' : 'INACTIVE'}
               </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
               <div className="flex items-center gap-3">
                 <Eye className="text-slate-400" size={20} />
                 <div>
                   <div className="font-medium text-slate-200">Wallet Connection</div>
                   <div className="text-xs text-slate-500 font-mono">{address || 'Not Connected'}</div>
                 </div>
               </div>
               <button 
                  onClick={disconnect}
                  className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"
               >
                  <LogOut size={14} /> Disconnect
               </button>
             </div>
           </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
           <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
             <Bell size={20} className="text-yellow-400" /> Notifications
           </h3>
           <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-slate-300">Price Alerts (+10%)</span>
                 <div className="w-10 h-6 bg-cyan-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-slate-300">Viral Challenge Invites</span>
                 <div className="w-10 h-6 bg-cyan-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
