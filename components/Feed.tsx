
import React, { useState, useRef, useContext } from 'react';
import { Heart, MessageCircle, Share2, ShieldCheck, Play, TrendingUp, DollarSign, BarChart3, Flame, Clock, AlertOctagon, Video, Image as ImageIcon, Upload, Coins, X, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post, VideoAsset } from '../types';
import { ChartModal } from './ChartModal';
import { CommentsModal } from './CommentsModal';
import { ToastContext } from '../types';

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
  const { addToast } = useContext(ToastContext);
  
  // Upload / Launch State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [initialBuyAmount, setInitialBuyAmount] = useState<string>('');
  const [showInvestmentInput, setShowInvestmentInput] = useState(false);
  const [isLaunchExpanded, setIsLaunchExpanded] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedFile(file.name);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToast('Liked', 'You liked this post', 'success');
  };

  const handleShare = (e: React.MouseEvent, ticker: string) => {
    e.stopPropagation();
    addToast('Network Expanded', `Linked ${ticker} to your node network.`, 'gold');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
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

      {/* COMPACT LAUNCH BAR (Collapsible on Mobile) */}
      <div className={`bg-slate-950/80 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-4 mb-6 shadow-lg transition-all ${isLaunchExpanded ? 'h-auto' : 'h-16 overflow-hidden'}`}>
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-amber-500/30 flex-shrink-0 overflow-hidden">
             <img src="https://picsum.photos/seed/me/100/100" alt="me" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 relative">
               {/* On mobile, clicking input expands the area */}
               <input 
                type="text" 
                onClick={() => setIsLaunchExpanded(true)}
                placeholder="Launch a viral challenge..." 
                className="bg-transparent w-full outline-none text-slate-200 placeholder-slate-500 text-sm md:text-lg font-medium h-8 md:h-10"
              />
          </div>
          
          <button onClick={() => setIsLaunchExpanded(!isLaunchExpanded)} className="md:hidden text-slate-500">
             {isLaunchExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* Expanded Controls */}
        <div className={`pt-4 mt-2 border-t border-slate-800/50 ${isLaunchExpanded ? 'block' : 'hidden md:block'}`}>
             {/* Selected File Pill */}
              {selectedFile && (
                  <div className="flex items-center gap-2 text-amber-400 text-xs bg-amber-900/20 px-3 py-1 rounded-full w-fit border border-amber-500/30 mb-3">
                      <Video size={12} /> {selectedFile}
                      <button onClick={() => setSelectedFile(null)} className="hover:text-white"><X size={12}/></button>
                  </div>
              )}

              {/* Investment Input Pill */}
              {showInvestmentInput && (
                <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 rounded-xl p-2 w-fit mb-3 animate-in fade-in slide-in-from-left-2">
                    <span className="text-xs font-bold text-green-400 pl-2 uppercase">Initial Buy:</span>
                    <input 
                        type="number" 
                        value={initialBuyAmount}
                        onChange={(e) => setInitialBuyAmount(e.target.value)}
                        placeholder="0.0 SOL"
                        className="bg-transparent border-none outline-none text-white font-mono w-20 text-sm placeholder-slate-500"
                        autoFocus
                    />
                    <button onClick={() => { setShowInvestmentInput(false); setInitialBuyAmount(''); }} className="text-green-400 hover:text-white pr-2">
                        <X size={14} />
                    </button>
                </div>
              )}

            <div className="flex justify-between items-center">
                <div className="flex gap-1 md:gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-slate-400 hover:text-amber-400 hover:bg-amber-900/20 px-2 md:px-3 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium"
                    >
                        <Video size={18} /> <span className="inline">Upload</span>
                    </button>
                    
                    <button 
                        onClick={() => setShowInvestmentInput(true)}
                        className={`flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg transition-colors text-xs md:text-sm font-medium ${showInvestmentInput ? 'text-green-400 bg-green-900/20' : 'text-slate-400 hover:text-green-400 hover:bg-green-900/10'}`}
                    >
                        <Coins size={18} /> <span className="inline">Invest</span>
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="video/*,image/*"
                        onChange={handleFileSelect} 
                    />
                </div>

                <button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
                    <Upload size={16} /> {initialBuyAmount ? `Launch (${initialBuyAmount} SOL)` : 'Launch'}
                </button>
            </div>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-6">
        {MOCK_POSTS.map((post) => {
          const { isViral, hoursLeft, minsLeft, progress } = getSurvivalStatus(post);

          return (
            <div key={post.id} className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all relative group shadow-xl">
              
              {/* SURVIVAL BAR */}
              {!isViral ? (
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 z-10">
                   <div 
                    className={`h-full transition-all duration-1000 ${progress > 80 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-600 to-yellow-400'}`}
                    style={{ width: `${100 - progress}%` }}
                   />
                </div>
              ) : (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 animate-gradient-x z-10 shadow-[0_0_15px_#FBBF24]" />
              )}

              {/* Post Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Link to={`/u/${post.author.handle.replace('@', '')}`}>
                      <img src={post.author.avatar} alt={post.author.handle} className="w-10 h-10 rounded-full border border-slate-700" />
                    </Link>
                    <div>
                      <div className="flex items-center gap-1">
                        <Link to={`/u/${post.author.handle.replace('@', '')}`} className="font-bold text-slate-200 text-sm">
                           {post.author.name}
                        </Link>
                        {post.isSafe && (
                          <ShieldCheck size={12} className="text-green-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{post.author.handle} • {post.timestamp}</p>
                    </div>
                  </div>
                  
                  {/* Viral Status / Timer Indicator */}
                  <div className="text-right flex flex-col items-end">
                     {isViral ? (
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[10px] uppercase tracking-wider mb-1 animate-pulse">
                            <Flame size={10} fill="currentColor" /> Immortal
                        </div>
                     ) : (
                        <div className={`flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider mb-1 ${progress > 80 ? 'text-red-500 animate-bounce' : 'text-slate-400'}`}>
                            <Clock size={10} /> {hoursLeft}h Left
                        </div>
                     )}
                     {post.assetData && (
                        <div className={`text-xs font-bold ${post.assetData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {post.assetData.priceChange24h >= 0 ? '+' : ''}{post.assetData.priceChange24h}%
                        </div>
                     )}
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-2 leading-relaxed">
                  {post.content} {post.challengeTag && <span className="text-amber-500 font-bold">#{post.challengeTag}</span>}
                </p>
              </div>

              {/* Media */}
              {post.mediaUrl && (
                <div className="w-full relative group cursor-pointer bg-black" onClick={() => post.assetData && setSelectedAsset({asset: post.assetData, mode: 'buy'})}>
                  <img src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover max-h-[500px]" />
                  
                  {post.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                          <div className="w-14 h-14 rounded-full bg-amber-500/20 backdrop-blur-md flex items-center justify-center border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                              <Play size={24} className="text-white fill-current ml-1" />
                          </div>
                      </div>
                  )}

                  {/* Overlay Investment Stats (Simplified for Mobile) */}
                  {post.assetData && (
                     <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-lg flex gap-3 shadow-lg">
                        <div>
                           <div className="text-[9px] text-slate-500 uppercase font-bold">Mkt Cap</div>
                           <div className="text-xs font-mono font-bold text-white">${(post.assetData.marketCap/1000).toFixed(1)}k</div>
                        </div>
                        <div className="w-px bg-slate-700"></div>
                        <div>
                           <div className="text-[9px] text-slate-500 uppercase font-bold">Price</div>
                           <div className="text-xs font-mono font-bold text-amber-400">${post.assetData.price}</div>
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
                    className="bg-slate-950 hover:bg-green-900/20 text-green-400 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors active:bg-green-900/30"
                  >
                    <TrendingUp size={16} /> BUY
                  </button>
                  <button 
                    onClick={() => setSelectedAsset({asset: post.assetData!, mode: 'sell'})}
                    className="bg-slate-950 hover:bg-red-900/20 text-red-400 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors active:bg-red-900/30"
                  >
                    <DollarSign size={16} /> SELL
                  </button>
                </div>
              )}

              {/* Social Actions */}
              <div className="flex items-center justify-between text-slate-500 p-3 bg-slate-950/60">
                <div className="flex gap-4">
                    <button onClick={handleLike} className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                    <Heart size={18} />
                    <span className="text-xs">{post.likes}</span>
                    </button>
                    
                    <button 
                        onClick={() => setCommentPost(post)}
                        className="flex items-center gap-1 hover:text-amber-400 transition-colors"
                    >
                    <MessageCircle size={18} />
                    <span className="text-xs">{post.commentsCount}</span>
                    </button>
                    
                    <button 
                    onClick={(e) => handleShare(e, post.assetData?.ticker || 'VIDEO')}
                    className={`flex items-center gap-1 transition-all ${isViral ? 'text-cyan-400 animate-pulse' : 'hover:text-white'}`}
                    >
                    <Globe size={18} />
                    </button>
                </div>

                <button 
                  onClick={() => post.assetData && setSelectedAsset({asset: post.assetData, mode: 'buy'})}
                  className="flex items-center gap-1 hover:text-white text-amber-500 transition-colors bg-amber-900/10 px-2 py-1 rounded border border-amber-500/20"
                >
                  <BarChart3 size={14} />
                  <span className="text-[10px] font-bold">CHART</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
