import React, { useContext } from 'react';
import { UserContext, WalletContext } from '../types';
import { Shield, User, Bell, LogOut, Eye, Fingerprint } from 'lucide-react';

export const Settings: React.FC = () => {
  const { username, handle, avatar, isBiometricVerified } = useContext(UserContext);
  const { disconnect, address } = useContext(WalletContext);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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