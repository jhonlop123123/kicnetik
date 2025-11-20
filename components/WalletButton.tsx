import React, { useContext } from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { WalletContext } from '../types';

export const WalletButton: React.FC = () => {
  const { connected, address, connect, disconnect } = useContext(WalletContext);

  return (
    <button
      onClick={connected ? disconnect : connect}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
        ${connected 
          ? 'bg-slate-800 border border-slate-700 text-cyan-400 hover:border-red-500 hover:text-red-400' 
          : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]'}
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