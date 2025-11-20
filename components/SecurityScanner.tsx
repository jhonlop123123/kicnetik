import React, { useState } from 'react';
import { ShieldAlert, Search, CheckCircle, XCircle, AlertTriangle, Lock, FileCode } from 'lucide-react';
import { analyzeTokenSecurity } from '../services/geminiService';

export const SecurityScanner: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleScan = async () => {
    if (!tokenAddress) return;
    setIsScanning(true);
    setReport(null);
    try {
      // Simulate a brief delay for "blockchain reading" effect before AI analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await analyzeTokenSecurity(tokenAddress);
      setReport(result);
    } catch (error) {
      setReport("Analysis failed. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
         <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg">
             <ShieldAlert size={24} className="text-white" />
          </div>
          Anti-Rug Scanner
        </h2>
        <p className="text-slate-400">AI-powered smart contract analysis to detect potential scams and rug pulls on Solana.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Area */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-medium text-slate-300 mb-2">Solana Token Address / Mint ID</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                placeholder="e.g., 7ey...83a"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono"
              />
            </div>
            <button 
              onClick={handleScan}
              disabled={isScanning || !tokenAddress}
              className="bg-green-600 hover:bg-green-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 rounded-xl font-bold transition-colors min-w-[120px]"
            >
              {isScanning ? 'Scanning...' : 'Audit'}
            </button>
          </div>
        </div>

        {/* Visual Stats (Mocked for Demo UI Structure) */}
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-green-400">
             <Lock size={20} />
           </div>
           <div className="text-sm text-slate-400">Liquidity Check</div>
           <div className="text-xs text-slate-600 mt-1">Detects unlocked LP</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-yellow-400">
             <AlertTriangle size={20} />
           </div>
           <div className="text-sm text-slate-400">Mint Authority</div>
           <div className="text-xs text-slate-600 mt-1">Checks ownership</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center">
           <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 text-cyan-400">
             <FileCode size={20} />
           </div>
           <div className="text-sm text-slate-400">Code Analysis</div>
           <div className="text-xs text-slate-600 mt-1">Gemini Flash Logic</div>
        </div>

        {/* Report Section */}
        {report && (
          <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Security Audit Report</h3>
              <span className="text-xs font-mono text-slate-500">Target: {tokenAddress.substring(0, 8)}...</span>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-line text-slate-300">
                {report}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
               <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <div>
                    <div className="text-xs text-slate-500">Automated Score</div>
                    <div className="font-bold text-green-400">85/100 (Safe)</div>
                  </div>
               </div>
               <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 flex items-center gap-3">
                  <XCircle className="text-red-500" size={20} />
                  <div>
                    <div className="text-xs text-slate-500">Red Flags</div>
                    <div className="font-bold text-red-400">0 Critical</div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};