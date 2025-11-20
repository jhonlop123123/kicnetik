import React, { useContext } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { WalletContext } from '../types';

export const WalletButton: React.FC = () => {
  const { connected, address, connect, disconnect } = useContext(WalletContext);

  return (
    <button
      onClick={connected ? disconnect : connect}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border
        ${connected 
          ? 'bg-slate-900 border-slate-700 text-amber-400 hover:border-red-500 hover:text-red-400' 
          : 'bg-amber-500 text-black border-amber-400 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'}
      `}
    >
      {connected ? (
        <>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-mono">{address}</span>
          <LogOut size={14} className="ml-1" />
        </>
      ) : (
        <>
          <Wallet size={16} />
          <span>Connect</span>
        </>
      )}
    </button>
  );
};