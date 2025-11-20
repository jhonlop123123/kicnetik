import { GoogleGenAI } from "@google/genai";

// Initialize generic client - Key will be injected by AI Studio environment or checked via window.aistudio
const getClient = () => {
    // In the AI Studio environment, the key is injected into process.env.API_KEY
    // However, for Veo, we need to ensure the user has selected a key if using that specific flow.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback for environments where the key is purely env var based
};

export const promptApiKeySelection = async () => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    alert("API Key selection is not supported in this environment. Please ensure API_KEY is set.");
  }
};

export const generateVeoVideo = async (prompt: string): Promise<string> => {
  const ai = getClient();
  
  // 1. Start Video Generation Operation
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p', // 720p is standard for fast preview
      aspectRatio: '16:9'
    }
  });

  // 2. Poll for completion
  // Note: This can take a minute or two.
  while (!operation.done) {
    // Wait 10 seconds between polls
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
  // IMPORTANT: We must append the API key to the download link.
  const downloadUrl = `${videoUri}&key=${process.env.API_KEY}`;
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
    model: 'gemini-3-pro-preview', // Using Pro model for complex reasoning/coding tasks
    contents: prompt,
  });

  return response.text || "Analysis unavailable.";
};