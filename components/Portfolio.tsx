import React, { useContext } from 'react';
import { UserContext } from '../types';
import { Wallet, TrendingUp, TrendingDown, PieChart, ArrowUpRight } from 'lucide-react';
import { Holding } from '../types';

// Mock Data
const MOCK_HOLDINGS: Holding[] = [
  { ticker: '$ICE', amount: 15000, avgEntry: 0.002, currentPrice: 0.0042, pnlPercent: 110, thumbnail: 'https://picsum.photos/seed/icebucket/100/100' },
  { ticker: '$NEON', amount: 500, avgEntry: 1.00, currentPrice: 1.20, pnlPercent: 20, thumbnail: 'https://picsum.photos/seed/veo_static/100/100' },
  { ticker: '$CAT', amount: 1000000, avgEntry: 0.0002, currentPrice: 0.0001, pnlPercent: -50, thumbnail: 'https://picsum.photos/seed/cat/100/100' },
];

export const Portfolio: React.FC = () => {
  const { username, handle, avatar } = useContext(UserContext);

  const totalValue = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.amount * h.currentPrice), 0);
  const totalCost = MOCK_HOLDINGS.reduce((acc, h) => acc + (h.amount * h.avgEntry), 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = (totalPnL / totalCost) * 100;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
         <div>
            <h2 className="text-3xl font-bold text-white">My Portfolio</h2>
            <p className="text-slate-400 text-sm">Track your viral bets</p>
         </div>
         <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 p-1">
            <img src={avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
         </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
         <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10">
            <div className="text-slate-400 font-medium mb-1 flex items-center gap-2">
                <Wallet size={16} /> Net Worth
            </div>
            <div className="text-5xl font-bold text-white tracking-tight mb-4">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            
            <div className="flex gap-4">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold ${totalPnL >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {totalPnL >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    ${Math.abs(totalPnL).toFixed(2)} ({totalPnLPercent.toFixed(2)}%)
                </div>
                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-sm">
                    <PieChart size={16} /> 3 Assets
                </div>
            </div>
         </div>
      </div>

      {/* Holdings List */}
      <h3 className="text-xl font-bold text-white mb-4">Active Investments</h3>
      <div className="space-y-4">
        {MOCK_HOLDINGS.map((holding) => (
            <div key={holding.ticker} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-600 transition-colors rounded-2xl p-4 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                    <img src={holding.thumbnail} alt={holding.ticker} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                        <div className="font-bold text-white text-lg">{holding.ticker}</div>
                        <div className="text-xs text-slate-500">{holding.amount.toLocaleString()} tokens</div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="font-mono font-bold text-white">
                        ${(holding.amount * holding.currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs font-bold flex items-center justify-end gap-1 ${holding.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent}%
                        {holding.pnlPercent >= 0 ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};