import React, { useState, useEffect } from 'react';
import { Video, Wand2, AlertCircle, Download, Loader2, Coins, TrendingUp, Wallet } from 'lucide-react';
import { checkApiKey, promptApiKeySelection, generateVeoVideo } from '../services/geminiService';

export const CreateVideo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);
  
  // Investment State
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [estimatedTokens, setEstimatedTokens] = useState<string>('0');

  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, []);

  // Mock calculation for token estimation
  useEffect(() => {
    const sol = parseFloat(investmentAmount) || 0;
    // Mock curve: 1 SOL = 100,000 Tokens roughly at launch
    const tokens = sol * 100000; 
    setEstimatedTokens(tokens.toLocaleString());
  }, [investmentAmount]);

  const handleGenerate = async () => {
    if (!hasKey) {
      try {
        await promptApiKeySelection();
        const keyExists = await checkApiKey();
        setHasKey(keyExists);
        if (!keyExists) return;
      } catch (e) {
        setError("Failed to select API key.");
        return;
      }
    }

    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const url = await generateVeoVideo(prompt);
      setGeneratedVideoUrl(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong generating the video.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
             <Video size={24} className="text-white" />
          </div>
          Mint & Launch Video
        </h2>
        <p className="text-slate-400">Generate cinematic content with Veo and launch it as a tradeable asset instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Generation */}
        <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Wand2 size={16} className="text-purple-400" /> 
                    Video Prompt
                </label>
                <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic cyberpunk city with golden rain, cinematic 4k..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none transition-all font-sans"
                />
                <div className="mt-2 text-xs text-slate-500 text-right">Model: Veo-3.1-fast</div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-start gap-3 text-red-300">
                <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
                </div>
            )}

            {/* Result Section */}
            {generatedVideoUrl && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="text-xl font-bold text-white mb-4">Preview Asset</h3>
                <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video group">
                    <video 
                    src={generatedVideoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full h-full object-contain"
                    />
                </div>
                </div>
            )}
            
            {/* Loading State */}
            {isGenerating && !generatedVideoUrl && (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                    <div className="inline-block relative">
                        <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Video size={20} className="text-slate-600 animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-4 text-slate-400 animate-pulse">Veo is rendering your imagination...</p>
                    <p className="text-xs text-slate-600 mt-2">Minting on Solana shortly after generation.</p>
                </div>
            )}
        </div>

        {/* Right Column: Investment Config */}
        <div className="space-y-6">
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Coins size={20} className="text-amber-400" /> Initial Buy
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Amount (SOL)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={investmentAmount}
                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                placeholder="0.0"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-4 pr-12 text-white font-mono text-lg outline-none transition-colors"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">SOL</div>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Est. Tokens</span>
                            <span className="text-white font-mono font-bold">{estimatedTokens}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Supply %</span>
                            <span className="text-amber-400 font-mono font-bold">
                                {investmentAmount ? ((parseFloat(investmentAmount) * 100000 / 1000000000) * 100).toFixed(4) : '0.00'}%
                            </span>
                        </div>
                    </div>

                    <div className="text-[10px] text-slate-500 leading-relaxed">
                        * By adding an initial investment, you become the first holder. This helps bootstrap liquidity for the bonding curve.
                    </div>
                </div>
            </div>

            <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                ${isGenerating || !prompt 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] text-black'}
            `}
            >
            {isGenerating ? (
                <>
                <Loader2 className="animate-spin" size={20} />
                Minting...
                </>
            ) : (
                <>
                <TrendingUp size={20} />
                Launch {investmentAmount ? `with ${investmentAmount} SOL` : ''}
                </>
            )}
            </button>
        </div>

      </div>
    </div>
  );
};