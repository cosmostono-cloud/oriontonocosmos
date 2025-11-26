import { GoogleGenAI, Type } from "@google/genai";
import { DailyWisdom, DreamInterpretation, StarMapReading } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Modelo rápido para respostas ágeis
const FAST_MODEL = 'gemini-2.5-flash';

// --- HELPERS ---

export const hasApiKey = (): boolean => {
  return !!process.env.API_KEY;
};

const validateConnection = () => {
  if (!hasApiKey()) {
    console.warn("⚠️ Tentativa de uso sem API_KEY definida.");
    throw new Error("API_KEY_MISSING");
  }
};

const ensureString = (input: any): string => {
  if (typeof input === 'string') return input;
  return JSON.stringify(input);
};

// --- FUNÇÕES DE NEGÓCIO ---

export const getDailyWisdom = async (): Promise<DailyWisdom> => {
  try {
    validateConnection();
    const prompt = "Gere uma citação espiritual curta e inspiradora (focada em universo, estrelas ou conexão). Gere também um insight muito breve (1 frase) de aplicação prática. Responda em JSON. Use 1 emoji no insight. Tudo em Português do Brasil.";
    
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
    if (!text) throw new Error("Resposta vazia da IA");
    
    return JSON.parse(text) as DailyWisdom;
  } catch (error: any) {
    console.error("Erro Wisdom:", error);
    return {
      quote: "O universo fala com aqueles que escutam.",
      author: "Órion",
      insight: hasApiKey() ? "Sintonizando frequências..." : "Configure a API_KEY."
    };
  }
};

export const interpretDream = async (dreamText: string): Promise<DreamInterpretation> => {
  validateConnection();

  try {
    const prompt = `Atue como um intérprete místico chamado Órion. Analise este sonho: "${dreamText}". Seja breve e direto. Use alguns emojis. Retorne JSON: resumo curto, 3 símbolos (nome e significado curto), e conselho final (1 frase). Idioma: Português do Brasil.`;

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
    if (!text) throw new Error("Sem interpretação gerada");

    return JSON.parse(text) as DreamInterpretation;
  } catch (error: any) {
    console.error("Erro Dream:", error);
    throw new Error(error.message || "Erro ao interpretar sonho");
  }
};

export const getStarMapReading = async (date: string, time: string): Promise<StarMapReading> => {
  validateConnection();

  try {
    const prompt = `Atue como Órion. Dados: Data ${date}, Hora ${time}. Hoje: ${new Date().toLocaleDateString('pt-BR')}.
    Tarefa: 
    1. Signo Solar e Ascendente (estimado).
    2. Previsão CURTA para HOJE.
    3. Cor de poder e número da sorte.
    Responda JSON. Português Brasil.`;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sunSign: { type: Type.STRING },
            risingSign: { type: Type.STRING },
            dailyPrediction: { type: Type.STRING },
            powerColor: { type: Type.STRING },
            luckyNumber: { type: Type.STRING }
          },
          required: ["sunSign", "risingSign", "dailyPrediction", "powerColor", "luckyNumber"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem leitura estelar");
    
    return JSON.parse(ensureString(text)) as StarMapReading;
  } catch (error: any) {
    console.error("Erro StarMap:", error);
    throw new Error(error.message || "Erro no mapa estelar");
  }
};

export const createOracleChat = () => {
  validateConnection();
  
  return ai.chats.create({
    model: FAST_MODEL,
    config: {
      systemInstruction: "Você é 'Órion', guia do 'Tô no Cosmos'. Responda em Português (Brasil). Respostas CURTAS (max 2 frases). Místico, acolhedor. Use emojis ✨.",
    }
  });
};