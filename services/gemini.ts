
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHeroInsights(heroAlias: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide high-level SHIELD strategic analysis for ${heroAlias}. Include a brief tactical summary and potential multiverse threats.`,
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

export async function getMultiverseCanonEvents(heroAlias: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 3 potential 'Canon Events' for ${heroAlias} that are crucial to their development in any timeline.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              event: { type: Type.STRING },
              significance: { type: Type.STRING },
              fixed_point: { type: Type.BOOLEAN }
            },
            required: ["event", "significance", "fixed_point"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Canon Error:", error);
    return [];
  }
}
