import React from 'react';
import { Creator } from '../types';
import { Crown, TrendingUp, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_CREATORS: Creator[] = [
  { rank: 1, name: 'Satoshi Vision', handle: '@satoshi_v', avatar: 'https://picsum.photos/seed/satoshi/100/100', marketCap: 12500000, price: 420.69, change24h: 12.5, isVerified: true },
  { rank: 2, name: 'Neon Queen', handle: '@neon_queen', avatar: 'https://picsum.photos/seed/neonq/100/100', marketCap: 8400000, price: 125.40, change24h: 5.2, isVerified: true },
  { rank: 3, name: 'Solana Degen', handle: '@sol_degen', avatar: 'https://picsum.photos/seed/sold/100/100', marketCap: 6200000, price: 89.20, change24h: -2.1, isVerified: false },
  { rank: 4, name: 'AI Artist', handle: '@gemini_pro', avatar: 'https://picsum.photos/seed/aiart/100/100', marketCap: 4100000, price: 45.00, change24h: 25.4, isVerified: true },
  { rank: 5, name: 'Meme Lord', handle: '@pepe_king', avatar: 'https://picsum.photos/seed/pepe/100/100', marketCap: 3800000, price: 12.40, change24h: 8.9, isVerified: false },
];

export const Leaderboard: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-b from-amber-500/20 to-transparent rounded-full mb-4 border border-amber-500/30">
              <Crown size={48} className="text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2 font-[Space_Grotesk]">THE ELITE 100</h2>
          <p className="text-slate-400 text-sm uppercase tracking-widest">Top Capitalized Creators by Market Value</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-950/50 text-xs text-slate-500 uppercase font-bold tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5">Creator</div>
              <div className="col-span-3 text-right">Market Cap</div>
              <div className="col-span-3 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/50">
              {MOCK_CREATORS.map((creator) => (
                  <div key={creator.handle} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/30 transition-colors group">
                      
                      <div className="col-span-1 text-center font-mono font-bold text-slate-400 group-hover:text-amber-400">
                          {creator.rank}
                      </div>
                      
                      <div className="col-span-5 flex items-center gap-3">
                          <Link to={`/u/${creator.handle.replace('@','')}`}>
                            <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-amber-500 transition-colors" />
                          </Link>
                          <div>
                              <div className="font-bold text-white flex items-center gap-1">
                                  {creator.name} 
                                  {creator.isVerified && <span className="text-[10px] bg-cyan-900/30 text-cyan-400 px-1 rounded border border-cyan-500/20">VERIFIED</span>}
                              </div>
                              <div className="text-xs text-slate-500 font-mono">{creator.handle}</div>
                          </div>
                      </div>

                      <div className="col-span-3 text-right">
                          <div className="font-mono font-bold text-white">${(creator.marketCap / 1000000).toFixed(1)}M</div>
                          <div className={`text-xs font-bold ${creator.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {creator.change24h >= 0 ? '+' : ''}{creator.change24h}%
                          </div>
                      </div>

                      <div className="col-span-3 flex justify-end gap-2">
                          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors">
                              <UserPlus size={16} />
                          </button>
                          <button className="flex items-center gap-1 px-3 py-2 bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors">
                              <TrendingUp size={14} /> Invest
                          </button>
                      </div>

                  </div>
              ))}
          </div>
      </div>

    </div>
  );
};