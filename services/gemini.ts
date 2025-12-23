
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHeroInsights(heroAlias: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide high-level SHIELD strategic analysis for ${heroAlias}. Include a brief tactical summary and potential multiverse threats. Keep it under 100 words.`,
      config: {
        systemInstruction: "You are J.A.R.V.I.S., a high-tech AI system. Your responses should be professional, technical, and slightly futuristic.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "ACCESS DENIED: Neural link failure.";
  }
}

export async function nexusSearch(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the Nexus Search Engine. Answer Marvel-related queries using recent data and provide web citations where possible. Keep it concise.",
      },
    });
    
    return {
      text: response.text,
      citations: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Nexus Search Error:", error);
    return { text: "Search interrupted by temporal anomaly.", citations: [] };
  }
}

export async function deepScanHero(heroName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a detailed SHIELD profile for the character: ${heroName}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Real name of the character" },
            alias: { type: Type.STRING, description: "Superhero name" },
            origin_world: { type: Type.STRING, description: "e.g. Earth-616" },
            powers: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING, description: "Brief tactical summary" }
          },
          required: ["name", "alias", "origin_world", "powers", "weaknesses", "description"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Deep Scan Error:", error);
    return null;
  }
}

export async function generateHeroImage(alias: string, description: string) {
  try {
    const prompt = `A cinematic, high-quality tactical SHIELD surveillance photo of the Marvel hero ${alias}. ${description}. Cinematic lighting, highly detailed, realistic, hero pose.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

export async function suggestNewHeroes() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Suggest 3 interesting Marvel characters, including their powers and alias.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              alias: { type: Type.STRING },
              powers: { type: Type.ARRAY, items: { type: Type.STRING } },
              origin_world: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return [];
  }
}
