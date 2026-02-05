
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeTask = async (taskTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `次のタスクをリマインダーのカテゴリ（今日, 予定あり, すべて, 完了済み）のいずれかに分類し、重要度（High, Medium, Low）を判定してください: "${taskTitle}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["category", "priority"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { category: "すべて", priority: "Medium" };
  }
};
