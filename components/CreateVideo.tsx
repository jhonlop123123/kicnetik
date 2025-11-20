import React, { useState, useEffect } from 'react';
import { Video, Wand2, AlertCircle, Download, Loader2 } from 'lucide-react';
import { checkApiKey, promptApiKeySelection, generateVeoVideo } from '../services/geminiService';

export const CreateVideo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    checkApiKey().then(setHasKey);
  }, []);

  const handleGenerate = async () => {
    if (!hasKey) {
      try {
        await promptApiKeySelection();
        // Re-check key after dialog
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg">
             <Video size={24} className="text-white" />
          </div>
          Veo AI Studio
        </h2>
        <p className="text-slate-400">Generate cinematic 1080p videos directly from text prompts using Google's Veo model.</p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <label className="block text-sm font-medium text-slate-300 mb-2">Describe your video imagination</label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cyberpunk street in Tokyo with neon lights reflecting in puddles, cinematic 4k..."
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-all"
        />
        
        <div className="flex justify-between items-center mt-4">
            <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Model: veo-3.1-fast
            </div>
            <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all
                ${isGenerating || !prompt 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_20px_rgba(192,38,211,0.4)] text-white'}
            `}
            >
            {isGenerating ? (
                <>
                <Loader2 className="animate-spin" size={18} />
                Dreaming...
                </>
            ) : (
                <>
                <Wand2 size={18} />
                Generate Video
                </>
            )}
            </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-start gap-3 text-red-300 mb-8">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Result Section */}
      {generatedVideoUrl && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-xl font-bold text-white mb-4">Generated Result</h3>
          <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video group">
            <video 
              src={generatedVideoUrl} 
              controls 
              autoPlay 
              loop 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 flex justify-end">
              <a 
                href={generatedVideoUrl} 
                download="kinectic_veo.mp4"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                  <Download size={16} />
                  Download MP4
              </a>
          </div>
        </div>
      )}
      
      {/* Loading State Visuals */}
      {isGenerating && !generatedVideoUrl && (
          <div className="text-center py-12">
             <div className="inline-block relative">
                 <div className="w-16 h-16 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                     <Video size={20} className="text-slate-600 animate-pulse" />
                 </div>
             </div>
             <p className="mt-4 text-slate-400 animate-pulse">Veo is rendering your imagination...</p>
             <p className="text-xs text-slate-600 mt-2">This usually takes about 30-60 seconds.</p>
          </div>
      )}
    </div>
  );
};