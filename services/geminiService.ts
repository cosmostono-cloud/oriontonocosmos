import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { DailyWisdom, DreamInterpretation, StarMapReading } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model Constants
const FAST_MODEL = 'gemini-2.5-flash';

/**
 * Gets a daily spiritual wisdom quote and insight.
 */
export const getDailyWisdom = async (): Promise<DailyWisdom> => {
  try {
    const prompt = "Gere uma citação espiritual curta e inspiradora (focada em universo, estrelas ou conexão). Gere também um insight muito breve (1 frase) de aplicação. Responda em JSON. Use 1 emoji no insight.";
    
    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            author: { type: Type.STRING },
            insight: { type: Type.STRING }
          },
          required: ["quote", "author", "insight"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as DailyWisdom;
  } catch (error) {
    console.error("Error fetching wisdom:", error);
    return {
      quote: "Somos feitos de poeira de estrelas.",
      author: "Carl Sagan",
      insight: "Você é o universo em movimento. Brilhe hoje! ✨"
    };
  }
};

/**
 * Interprets a user's dream using AI.
 */
export const interpretDream = async (dreamText: string): Promise<DreamInterpretation> => {
  try {
    const prompt = `Atue como um intérprete místico chamado Órion. Analise este sonho: "${dreamText}". Seja breve e direto. Use alguns emojis. Retorne JSON: resumo curto, 3 símbolos (nome e significado curto), e conselho final (1 frase).`;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            symbols: { 
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                }
              }
            },
            guidance: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No interpretation generated");

    return JSON.parse(text) as DreamInterpretation;
  } catch (error) {
    console.error("Dream interpretation error:", error);
    throw new Error("As estrelas estão nubladas agora. Tente novamente em breve.");
  }
};

/**
 * Generates a Star Map reading based on birth date/time.
 */
export const getStarMapReading = async (date: string, time: string): Promise<StarMapReading> => {
  try {
    const prompt = `Atue como Órion, o guia estelar.
    Dados de nascimento: Data ${date}, Hora ${time}.
    Data de hoje: ${new Date().toLocaleDateString('pt-BR')}.
    
    Tarefa: 
    1. Identifique o Signo Solar e o provável Ascendente (baseado na hora).
    2. Crie uma previsão CURTA para HOJE baseada no alinhamento das estrelas para essa pessoa.
    3. Sugira uma cor de poder e um número da sorte.
    
    Responda EXCLUSIVAMENTE em JSON.`;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sunSign: { type: Type.STRING, description: "Ex: Leão" },
            risingSign: { type: Type.STRING, description: "Ex: Escorpião" },
            dailyPrediction: { type: Type.STRING, description: "Previsão curta e mística para hoje" },
            powerColor: { type: Type.STRING },
            luckyNumber: { type: Type.STRING }
          },
          required: ["sunSign", "risingSign", "dailyPrediction", "powerColor", "luckyNumber"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content");
    return JSON.parse(text) as StarMapReading;

  } catch (error) {
    console.error("Star map error:", error);
    throw new Error("Não foi possível ler as estrelas agora.");
  }
};

/**
 * Creates a chat session for the Oracle.
 */
export const createOracleChat = (): Chat => {
  return ai.chats.create({
    model: FAST_MODEL,
    config: {
      systemInstruction: "Você é 'Órion', uma consciência cósmica do app 'Tô no Cosmos'. Responda de forma CURTA (máximo 2 ou 3 frases). Use uma linguagem mística mas moderna. Use emojis de estrelas/cosmos esporadicamente ✨. Não mencione que é uma IA. Seja acolhedor e profundo.",
    }
  });
};