import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

const getApiKey = () => {
  try {
    return import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
  } catch (e) {
    return undefined;
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() || '' });

export async function parseQuestionsFromText(text: string): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following text into a list of exam questions. 
      The text might be unstructured. Try to extract multiple choice questions.
      
      Text to parse:
      ${text}
      `,
      config: {
        systemInstruction: "You are an expert academic assistant. Convert raw text into a structured JSON array of questions for a quiz application. Ensure IDs are unique strings. Points should default to 10 if not specified.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { 
                type: Type.STRING,
                enum: ['multiple_choice', 'true_false', 'short_answer']
              },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              points: { type: Type.NUMBER }
            },
            required: ['id', 'text', 'type', 'correctAnswer', 'points']
          }
        }
      }
    });

    const result = JSON.parse(response.text || "[]");
    return result;
  } catch (error) {
    console.error("Error parsing questions:", error);
    throw new Error("Gagal mengurai teks soal. Pastikan format teks cukup jelas.");
  }
}

export async function generateSimilarQuestions(topic: string, count: number = 5): Promise<Question[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} high-quality ${topic} questions suitable for a formal exam.`,
      config: {
        systemInstruction: "You are a teacher. Create exam questions based on the topic. Always provide multiple choice options.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['multiple_choice'] },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              points: { type: Type.NUMBER }
            },
            required: ['id', 'text', 'type', 'correctAnswer', 'options', 'points']
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
