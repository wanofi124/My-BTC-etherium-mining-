import { GoogleGenAI } from "@google/genai";
import { MarketData } from "../types";

const processEnvApiKey = process.env.API_KEY;

// Fallback data if API key is missing or fails
const MOCK_DATA: MarketData = {
  trend: 'bullish',
  advice: "Quantum nodes detect a 400% efficiency spike. Hold assets.",
  volatilityIndex: 88
};

export const getMarketAnalysis = async (currentHashRate: number): Promise<MarketData> => {
  if (!processEnvApiKey) {
    console.warn("Gemini API Key missing. Using simulation mode.");
    return MOCK_DATA;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: processEnvApiKey });
    
    // We use gemini-2.5-flash for speed
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, futuristic cryptocurrency market analysis based on a simulated hash rate of ${currentHashRate} TH/s.
      Return ONLY a JSON object with this schema (do not use markdown code blocks):
      {
        "trend": "bullish" | "bearish" | "neutral",
        "advice": "string (max 15 words, sound technically advanced)",
        "volatilityIndex": number (0-100)
      }`,
    });

    const text = response.text;
    if (!text) return MOCK_DATA;

    // Clean up potential markdown formatting if the model adds it despite instructions
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as MarketData;

  } catch (error) {
    console.error("Gemini AI Analysis Failed:", error);
    return MOCK_DATA;
  }
};