
import { GoogleGenAI, Type } from "@google/genai";

// Always use the direct named parameter for API key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCampaignInsights = async (voterData: any, pollData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes dados de campanha eleitoral e forneça 3 insights estratégicos curtos (máximo 150 caracteres cada). 
      Dados de eleitores: ${JSON.stringify(voterData)}
      Dados de pesquisas: ${JSON.stringify(pollData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              insight: { type: Type.STRING },
              action: { type: Type.STRING }
            },
            required: ["insight", "action"]
          }
        }
      }
    });

    // Access .text property directly (not a method) and handle potential undefined
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { insight: "Mantenha o foco na região central onde a indecisão é alta.", action: "Mobilizar equipe de rua" },
      { insight: "Eleitores de classe C mostram crescimento de apoio.", action: "Reforçar mídias sociais" }
    ];
  }
};
