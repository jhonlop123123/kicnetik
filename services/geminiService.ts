import { GoogleGenAI } from "@google/genai";

// Robust API Key retrieval for Vite/Vercel environment
const getApiKey = () => {
    // 1. Try Standard Process Env (polyfilled in vite.config.ts)
    // The build tool (Vite) replaces process.env.API_KEY with the actual string value.
    // We access it directly to ensure the replacement happens.
    if (process.env.API_KEY) {
        return process.env.API_KEY;
    }
    return undefined;
};

// Initialize generic client
const getClient = () => {
    const apiKey = getApiKey();
    // Note: If apiKey is undefined here, the SDK might throw or user must select key via window.aistudio
    return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return !!getApiKey();
};

export const promptApiKeySelection = async () => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    // Fallback for Vercel/Production if key is missing
    console.warn("API Key selection not supported in this environment. Please set VITE_API_KEY in Vercel.");
    alert("Please configure VITE_API_KEY in your environment settings.");
  }
};

export const generateVeoVideo = async (prompt: string): Promise<string> => {
  const ai = getClient();
  const apiKey = getApiKey();
  
  // 1. Start Video Generation Operation
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // 2. Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
    console.log("Veo Status:", operation.metadata);
  }

  // 3. Extract Result
  if (operation.error) {
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!videoUri) {
    throw new Error("No video URI returned from Veo.");
  }

  // 4. Fetch the actual video bytes
  // Append key if available
  const downloadUrl = apiKey ? `${videoUri}&key=${apiKey}` : videoUri;
  
  const response = await fetch(downloadUrl);
  if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const analyzeTokenSecurity = async (tokenAddress: string, contractSnippet?: string): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    You are a world-class Solana Smart Contract Auditor and Security Expert.
    Analyze the following token context for potential "Rug Pull" risks.
    
    Token Address (Simulated Context): ${tokenAddress}
    Contract Snippet (if available): ${contractSnippet || "Standard SPL Token implementation assumed."}

    Provide a concise, bulleted security report analyzing:
    1. Mint Authority (Is it renounced?)
    2. Liquidity Lock status (Is it burned or locked?)
    3. Top Holders distribution (Is it centralized?)
    4. Suspicious function calls (blacklist, pause, etc.)

    Conclude with a RISK LEVEL: LOW, MEDIUM, HIGH, or CRITICAL.
    Keep the tone professional, technical, but accessible.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', 
    contents: prompt,
  });

  return response.text || "Analysis unavailable.";
};