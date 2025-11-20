import { GoogleGenAI } from "@google/genai";

// 1. Obtener la API Key inyectada por Vite
const getApiKey = () => {
    // Vite reemplazará 'process.env.API_KEY' por el string literal de tu configuración
    if (typeof process.env.API_KEY === 'string' && process.env.API_KEY.length > 0) {
        return process.env.API_KEY;
    }
    return undefined;
};

// 2. Inicializar Cliente
const getClient = () => {
    const apiKey = getApiKey();
    return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const checkApiKey = async (): Promise<boolean> => {
  // En Vercel, si la variable de entorno está puesta, esto es true.
  return !!getApiKey();
};

export const promptApiKeySelection = async () => {
  // En producción con Vercel, no pedimos key al usuario, usamos la del entorno.
  const key = getApiKey();
  if (!key) {
      alert("Critical Error: VITE_API_KEY not found in environment. Please check Vercel settings.");
  }
};

export const generateVeoVideo = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
      throw new Error("System Error: API Key configuration missing.");
  }

  const ai = getClient();
  
  try {
    console.log("Initiating Veo generation...");
    
    // 1. Iniciar Generación
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // 2. Esperar resultado (Polling)
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 8000)); // Esperar 8s
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Veo Progress:", operation.metadata);
    }

    // 3. Verificar errores
    if (operation.error) {
      throw new Error(`Veo Error: ${operation.error.message}`);
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Generation complete but no video URI returned.");
    }

    // 4. Descargar Video (Usando la Key para autenticar la descarga)
    const downloadUrl = `${videoUri}&key=${apiKey}`;
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
        if (response.status === 403) {
             throw new Error("Billing Error: Payment method not verified on Google Cloud Project.");
        }
        throw new Error(`Download Failed: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
      console.error("Deep Generation Error:", error);
      if (error.message?.includes('Billing') || error.toString().includes('403')) {
          throw new Error("Billing Required: Please ensure your Google Cloud project has billing enabled.");
      }
      throw error;
  }
};

export const analyzeTokenSecurity = async (tokenAddress: string, contractSnippet?: string): Promise<string> => {
  const ai = getClient();
  
  const prompt = `
    Role: Solana Security Auditor.
    Task: Analyze token for Rug Pull risks.
    Token: ${tokenAddress}
    
    Report format:
    - Bullet points
    - Risk Level: (Low/Medium/High)
    - Recommendation: (Buy/Avoid)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (e) {
    console.error("Analysis Error:", e);
    return "System overload. Please try again.";
  }
};