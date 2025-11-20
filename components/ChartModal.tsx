
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Activity, Zap, Wallet, ArrowDownUp, Loader2, CheckCircle, Lock } from 'lucide-react';
import { VideoAsset } from '../types';

interface ChartModalProps {
  asset: VideoAsset;
  onClose: () => void;
  initialMode?: 'buy' | 'sell';
}

export const ChartModal: React.FC<ChartModalProps> = ({ asset, onClose, initialMode = 'buy' }) => {
  const [mode, setMode] = useState<'buy' | 'sell'>(initialMode);
  const [amount, setAmount] = useState<string>('');
  const [step, setStep] = useState<'input' | 'signing' | 'success'>('input');

  // Mock wallet balance
  const solBalance = 14.5;
  const tokenBalance = 15000;

  // Calculate estimated output
  const numericAmount = parseFloat(amount) || 0;
  const estimatedOutput = mode === 'buy' 
    ? (numericAmount / asset.price).toFixed(2) 
    : (numericAmount * asset.price).toFixed(2);

  const handleExecute = async () => {
    if (!amount) return;
    
    // Step 1: Request Signature (Psychological Friction)
    setStep('signing');
    
    // Simulate wallet interaction time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Success
    setStep('success');
    
    setTimeout(() => {
        onClose();
    }, 2000);
  };

  const setPercentage = (percent: number) => {
    if (mode === 'buy') {
        setAmount((solBalance * percent).toFixed(2));
    } else {
        setAmount((tokenBalance * percent).toFixed(0));
    }
  };

  const generateChartPath = () => {
    const points = [];
    let y = 50;
    for (let i = 0; i <= 100; i += 5) {
      y += (Math.random() - 0.45) * 20; 
      y = Math.max(10, Math.min(90, y));
      points.push(`${i * 4},${y}`);
    }
    return points.join(' ');
  };

  const chartPath = generateChartPath();
  const isGreen = asset.priceChange24h >= 0;
  const strokeColor = isGreen ? "#4ade80" : "#f87171";

  // --- SUCCESS STATE ---
  if (step === 'success') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-green-500/30 rounded-3xl p-12 flex flex-col items-center text-center shadow-[0_0_50px_rgba(74,222,128,0.2)]">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle size={40} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Transaction Confirmed</h2>
                <p className="text-slate-400 mb-6">Successfully {mode === 'buy' ? 'bought' : 'sold'} {asset.ticker}</p>
                <div className="text-xs font-mono text-slate-500 bg-slate-950 px-4 py-2 rounded-lg">Signature: 5xG...9jK</div>
            </div>
        </div>
      );
  }

  // --- SIGNING SIMULATION STATE ---
  if (step === 'signing') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 flex flex-col items-center text-center max-w-sm w-full">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin"></div>
                    <Lock size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Requesting Signature</h2>
                <p className="text-slate-400 text-sm mb-6">Please approve the transaction in your wallet.</p>
                <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-left">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Action</div>
                    <div className="text-sm text-white font-mono">{mode.toUpperCase()} {asset.ticker}</div>
                </div>
            </div>
        </div>
      );
  }

  // --- MAIN CHART/TRADE UI ---
  return (
    <div className="fixed inset-0 z-50 flex md:items-center items-end justify-center md:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Close Click Area */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="w-full md:max-w-lg bg-slate-900 border-t md:border border-slate-700 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[95vh] md:max-h-[90vh] animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 z-10">
        
        {/* Mobile Pull Handle */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 bg-slate-900" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-start flex-shrink-0 bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{asset.ticker}</h2>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isGreen ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isGreen ? '+' : ''}{asset.priceChange24h}%
                </span>
            </div>
            <div className="text-3xl font-mono font-bold text-white mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                ${asset.price.toFixed(6)}
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors hidden md:block">
            <X size={20} />
          </button>
        </div>

        {/* Chart Area (Compressed height for mobile) */}
        <div className="relative h-40 md:h-48 bg-slate-950 w-full overflow-hidden group flex-shrink-0">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                {[...Array(24)].map((_, i) => (
                    <div key={i} className="border-r border-b border-slate-800/30"></div>
                ))}
            </div>
            <svg className="absolute inset-0 w-full h-full preserve-3d" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path 
                    d={`M0,100 L0,${chartPath.split(' ')[0].split(',')[1]} ${chartPath} L400,100 Z`} 
                    fill="url(#chartGradient)" 
                />
                <polyline 
                    points={chartPath} 
                    fill="none" 
                    stroke={strokeColor} 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                />
            </svg>
        </div>

        {/* TRADING INTERFACE */}
        <div className="flex-1 bg-slate-900 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                <button 
                    onClick={() => setMode('buy')}
                    className={`flex-1 py-3 md:py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${mode === 'buy' ? 'text-green-400 bg-green-900/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Buy
                    {mode === 'buy' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>}
                </button>
                <button 
                    onClick={() => setMode('sell')}
                    className={`flex-1 py-3 md:py-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${mode === 'sell' ? 'text-red-400 bg-red-900/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Sell
                    {mode === 'sell' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>}
                </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto pb-safe-area-bottom">
                
                {/* Input Group */}
                <div className="space-y-2 md:space-y-4">
                    <div className="flex justify-between text-xs text-slate-400 px-1">
                        <span>Amount</span>
                        <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => setPercentage(1)}>
                            <Wallet size={12} /> 
                            Balance: {mode === 'buy' ? `${solBalance} SOL` : `${tokenBalance.toLocaleString()} ${asset.ticker}`}
                        </span>
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full bg-slate-950 border-2 rounded-2xl py-3 md:py-4 pl-4 pr-20 text-xl md:text-2xl font-mono text-white outline-none focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all ${mode === 'buy' ? 'focus:border-green-500/50 border-slate-800' : 'focus:border-red-500/50 border-slate-800'}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 pointer-events-none">
                            {mode === 'buy' ? 'SOL' : asset.ticker}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {[0.25, 0.5, 1].map((pct) => (
                            <button 
                                key={pct}
                                onClick={() => setPercentage(pct)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors"
                            >
                                {pct * 100}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Output Estimate */}
                <div className="flex justify-between items-center bg-slate-950/50 p-3 md:p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-xs md:text-sm">You receive (est)</span>
                    <div className="text-right">
                        <div className="text-lg md:text-xl font-bold text-white">
                            {estimatedOutput} <span className="text-xs md:text-sm text-slate-500">{mode === 'buy' ? asset.ticker : 'SOL'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Action Button */}
                <button 
                    onClick={handleExecute}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className={`
                        w-full py-3 md:py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${mode === 'buy' 
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] text-white' 
                            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:shadow-[0_0_30px_rgba(248,113,113,0.4)] text-white'
                        }
                    `}
                >
                    {mode === 'buy' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    {mode.toUpperCase()} NOW
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
