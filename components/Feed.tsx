import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, ShieldCheck, Play, TrendingUp, DollarSign, BarChart3, Flame, Clock, AlertOctagon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, VideoAsset } from '../types';
import { ChartModal } from './ChartModal';
import { CommentsModal } from './CommentsModal';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: { name: 'SolanaDev', handle: '@sol_builder', avatar: 'https://picsum.photos/seed/sol/100/100' },
    content: 'Just launched the Ice Bucket Challenge 2025 on-chain! Minting starts now. 🧊🪣 #SolanaChallenge',
    challengeTag: 'IceBucket2025',
    mediaUrl: 'https://picsum.photos/seed/icebucket/800/450',
    mediaType: 'video',
    likes: 420,
    commentsCount: 45,
    timestamp: '20m ago',
    createdAt: Date.now() - (20 * 60 * 1000),
    isSafe: true,
    assetData: {
      ticker: '$ICE',
      marketCap: 45000,
      price: 0.0042,
      priceChange24h: 125.5,
      holders: 310
    }
  },
  {
    id: '2',
    author: { name: 'NeonArtist', handle: '@future_vision', avatar: 'https://picsum.photos/seed/neon/100/100' },
    content: 'Generated this with the new Veo model. Early investors get airdrop of the prompt NFT.',
    mediaUrl: 'https://picsum.photos/seed/veo_static/800/450', 
    mediaType: 'video',
    likes: 1289,
    commentsCount: 120,
    timestamp: '4h ago',
    createdAt: Date.now() - (4 * 60 * 60 * 1000),
    isSafe: true,
    assetData: {
      ticker: '$NEON',
      marketCap: 1200000,
      price: 1.20,
      priceChange24h: 12.3,
      holders: 5420
    }
  },
  {
    id: '3',
    author: { name: 'MemeTrader', handle: '@degen_play', avatar: 'https://picsum.photos/seed/meme/100/100' },
    content: 'If this cat jumps, buy immediately. Analysis says it will moon. 🚀',
    mediaUrl: 'https://picsum.photos/seed/cat/800/450', 
    mediaType: 'image',
    likes: 89,
    commentsCount: 12,
    timestamp: '18h ago',
    createdAt: Date.now() - (18 * 60 * 60 * 1000),
    isSafe: false,
    assetData: {
      ticker: '$JUMP',
      marketCap: 2000,
      price: 0.0001,
      priceChange24h: -5.4,
      holders: 40
    }
  }
];

// Helper to calculate survival time
const getSurvivalStatus = (post: Post) => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const VIRAL_THRESHOLD_MCAP = 50000; // $50k mcap makes it immortal

  const isViral = (post.assetData?.marketCap || 0) > VIRAL_THRESHOLD_MCAP;
  const age = Date.now() - post.createdAt;
  const timeLeft = Math.max(0, ONE_DAY_MS - age);
  const progress = Math.min(100, (age / ONE_DAY_MS) * 100);
  
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return { isViral, timeLeft, hoursLeft, minsLeft, progress };
};

export const Feed: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<{asset: VideoAsset, mode: 'buy' | 'sell'} | null>(null);
  const [commentPost, setCommentPost] = useState<Post | null>(null);

  return (
    <div className="w-full max-w-2xl mx-auto pb-24">
      
      {/* Chart/Trade Modal */}
      {selectedAsset && (
        <ChartModal 
            asset={selectedAsset.asset} 
            initialMode={selectedAsset.mode}
            onClose={() => setSelectedAsset(null)} 
        />
      )}

      {/* Comments Modal */}
      {commentPost && (
        <CommentsModal post={commentPost} onClose={() => setCommentPost(null)} />
      )}

      {/* Status Update Input */}
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0 overflow-hidden">
             <img src="https://picsum.photos/seed/me/100/100" alt="me" />
          </div>
          <input 
            type="text" 
            placeholder="Launch a viral challenge ($TICKER)..." 
            className="bg-transparent w-full outline-none text-slate-200 placeholder-slate-500"
          />
        </div>
        <div className="flex justify-end mt-3 pt-3 border-t border-slate-800/50">
          <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-cyan-500/20">
            Mint & Post
          </button>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-8">
        {MOCK_POSTS.map((post) => {
          const { isViral, hoursLeft, minsLeft, progress } = getSurvivalStatus(post);

          return (
            <div key={post.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-600 transition-all relative group">
              
              {/* SURVIVAL BAR */}
              {!isViral ? (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800 z-10">
                   <div 
                    className={`h-full transition-all duration-1000 ${progress > 80 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                    style={{ width: `${100 - progress}%` }}
                   />
                </div>
              ) : (
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 animate-gradient-x z-10" />
              )}

              {/* Post Header */}
              <div className="p-5 pb-3 pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Link to={`/u/${post.author.handle.replace('@', '')}`}>
                      <img src={post.author.avatar} alt={post.author.handle} className="w-10 h-10 rounded-full border border-slate-700 hover:border-cyan-500 transition-colors" />
                    </Link>
                    <div>
                      <div className="flex items-center gap-1">
                        <Link to={`/u/${post.author.handle.replace('@', '')}`} className="font-bold text-slate-200 hover:text-cyan-400 transition-colors">
                           {post.author.name}
                        </Link>
                        {post.isSafe && (
                          <ShieldCheck size={14} className="text-green-400" aria-label="Verified Safe" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{post.author.handle} • {post.timestamp}</p>
                    </div>
                  </div>
                  
                  {/* Viral Status / Timer Indicator */}
                  <div className="text-right flex flex-col items-end">
                     {isViral ? (
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs uppercase tracking-wider mb-1 animate-pulse">
                            <Flame size={12} fill="currentColor" /> Immortalized
                        </div>
                     ) : (
                        <div className={`flex items-center gap-1 font-bold text-xs uppercase tracking-wider mb-1 ${progress > 80 ? 'text-red-500 animate-bounce' : 'text-slate-400'}`}>
                            <Clock size={12} /> {hoursLeft}h {minsLeft}m Left
                        </div>
                     )}
                     {post.assetData && (
                        <div className={`text-xs font-bold ${post.assetData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {post.assetData.priceChange24h >= 0 ? '+' : ''}{post.assetData.priceChange24h}%
                        </div>
                     )}
                  </div>
                </div>

                <p className="text-slate-300 mb-3 leading-relaxed">
                  {post.content} {post.challengeTag && <span className="text-pink-400 font-bold">#{post.challengeTag}</span>}
                </p>
              </div>

              {/* Media */}
              {post.mediaUrl && (
                <div className="w-full relative group cursor-pointer bg-black" onClick={() => post.assetData && setSelectedAsset({asset: post.assetData, mode: 'buy'})}>
                  <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
                  
                  {post.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-xl">
                              <Play size={24} className="text-white fill-current ml-1" />
                          </div>
                      </div>
                  )}

                  {/* Warning Overlay if burning soon */}
                  {!isViral && progress > 80 && (
                    <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 animate-pulse shadow-lg">
                        <AlertOctagon size={12} /> DELETION IMMINENT
                    </div>
                  )}
                  
                  {/* Overlay Investment Stats */}
                  {post.assetData && (
                     <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl flex gap-4 shadow-2xl hover:scale-105 transition-transform">
                        <div>
                           <div className="text-[10px] text-slate-500 uppercase font-bold">Market Cap</div>
                           <div className="text-sm font-mono font-bold text-white">${post.assetData.marketCap.toLocaleString()}</div>
                        </div>
                        <div className="w-px bg-slate-700"></div>
                        <div>
                           <div className="text-[10px] text-slate-500 uppercase font-bold">Price</div>
                           <div className="text-sm font-mono font-bold text-cyan-400">${post.assetData.price}</div>
                        </div>
                     </div>
                  )}
                </div>
              )}

              {/* Trading Actions */}
              {post.assetData && (
                <div className="grid grid-cols-2 gap-px bg-slate-800 border-t border-b border-slate-800">
                  <button 
                    onClick={() => setSelectedAsset({asset: post.assetData!, mode: 'buy'})}
                    className="bg-slate-900 hover:bg-green-900/20 text-green-400 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:bg-slate-800"
                  >
                    <TrendingUp size={16} /> BUY {post.assetData.ticker}
                  </button>
                  <button 
                    onClick={() => setSelectedAsset({asset: post.assetData!, mode: 'sell'})}
                    className="bg-slate-900 hover:bg-red-900/20 text-red-400 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors group-hover:bg-slate-800"
                  >
                    <DollarSign size={16} /> SELL
                  </button>
                </div>
              )}

              {/* Social Actions */}
              <div className="flex items-center gap-6 text-slate-500 p-4 bg-slate-900/40">
                <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group/heart">
                  <Heart size={18} className="group-hover/heart:scale-110 transition-transform" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                
                {/* Discuss / Comments Button */}
                <button 
                    onClick={() => setCommentPost(post)}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.commentsCount || 0} Discuss</span>
                </button>

                <button 
                  onClick={() => post.assetData && setSelectedAsset({asset: post.assetData, mode: 'buy'})}
                  className="flex items-center gap-2 hover:text-white text-cyan-400 transition-colors ml-auto bg-cyan-900/20 px-3 py-1 rounded-lg border border-cyan-900/50"
                >
                  <BarChart3 size={16} />
                  <span className="text-xs font-bold">VIEW CHART</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};