import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, TrendingUp, DollarSign, Award, Users, Activity, ShieldCheck } from 'lucide-react';
import { VideoAsset } from '../types';
import { ChartModal } from './ChartModal';

// Mock Data for the user profile
const MOCK_USER_VIDEOS = [
    { id: 1, thumb: 'https://picsum.photos/seed/icebucket/300/300', views: '1.2M', ticker: '$ICE' },
    { id: 2, thumb: 'https://picsum.photos/seed/veo_static/300/300', views: '850K', ticker: '$NEON' },
    { id: 3, thumb: 'https://picsum.photos/seed/cat/300/300', views: '4.5M', ticker: '$CAT' },
];

export const UserProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Mock "Creator Coin" data
  const creatorCoin: VideoAsset = {
      ticker: `$${handle?.toUpperCase().slice(0,4) || 'USER'}`,
      marketCap: 4500000,
      price: 8.45,
      priceChange24h: 15.2,
      holders: 1240,
      volume24h: 500000
  };

  const [showChart, setShowChart] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {showChart && <ChartModal asset={creatorCoin} onClose={() => setShowChart(false)} initialMode="buy" />}

      {/* Banner & Profile Header */}
      <div className="relative mb-20">
        <div className="h-48 w-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-b-3xl overflow-hidden">
            <div className="w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden shadow-2xl">
                <img src={`https://picsum.photos/seed/${handle}/200/200`} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    {handle} <ShieldCheck size={20} className="text-cyan-400" />
                </h1>
                <p className="text-slate-400">Digital Creator & Crypto Native</p>
            </div>
        </div>

        <div className="absolute -bottom-12 right-8 flex gap-3">
            <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${isFollowing ? 'bg-slate-800 text-slate-300' : 'bg-slate-800 border border-slate-600 text-white hover:bg-slate-700'}`}
            >
                <UserPlus size={18} />
                {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button 
                onClick={() => setShowChart(true)}
                className="px-6 py-3 rounded-xl font-bold transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] text-white flex items-center gap-2"
            >
                <TrendingUp size={18} />
                Invest in {creatorCoin.ticker}
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 mt-8">
         <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                <DollarSign size={14} /> Creator Mkt Cap
            </div>
            <div className="text-xl font-mono font-bold text-white">$4.5M</div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                <Activity size={14} /> Stock Price
            </div>
            <div className="text-xl font-mono font-bold text-green-400">$8.45 (+15%)</div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                <Users size={14} /> Investors
            </div>
            <div className="text-xl font-mono font-bold text-white">1,240</div>
         </div>
         <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                <Award size={14} /> Viral Ratio
            </div>
            <div className="text-xl font-mono font-bold text-purple-400">85%</div>
         </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-slate-800 mb-6">
          <div className="flex gap-8">
              <button className="pb-3 border-b-2 border-cyan-500 text-cyan-400 font-bold">Launched Tokens</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-medium">Portfolio</button>
              <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-medium">Investors</button>
          </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         {MOCK_USER_VIDEOS.map(video => (
             <div key={video.id} className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 cursor-pointer">
                 <img src={video.thumb} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                     <div className="flex justify-between items-end">
                         <div>
                             <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded mb-1 inline-block">{video.ticker}</span>
                             <div className="text-white font-bold">{video.views} Views</div>
                         </div>
                     </div>
                 </div>
             </div>
         ))}
         {/* Placeholder for empty state or more */}
         <div className="aspect-[9/16] rounded-xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600">
             <div className="text-center">
                 <div className="text-2xl font-bold opacity-20 mb-2">Coming Soon</div>
             </div>
         </div>
      </div>

    </div>
  );
};