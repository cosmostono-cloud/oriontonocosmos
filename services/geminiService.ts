import { GoogleGenAI, Chat, Type } from "@google/genai";
import { DailyWisdom, DreamInterpretation, StarMapReading } from "../types";

// --- CONFIGURAÇÃO ---
// Tenta ler a chave injetada pelo Vite
const apiKey = process.env.API_KEY || "";

// Log de diagnóstico (aparece no Console do navegador - F12)
console.log(`[GeminiService] Inicializando. Chave presente? ${apiKey ? "SIM (Tamanho: " + apiKey.length + ")" : "NÃO"}`);

// Inicializa o cliente. Se a chave for vazia, chamadas subsequentes falharão (o que é esperado e tratado).
const ai = new GoogleGenAI({ apiKey: apiKey });

// Modelo
const FAST_MODEL = 'gemini-2.5-flash';

// --- HELPERS ---

const ensureString = (input: any): string => {
  if (typeof input === 'string') return input;
  return JSON.stringify(input);
};

// Verifica se a chave existe ANTES de tentar chamar a API
const validateConnection = () => {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING: A chave da API não foi encontrada. Configure no Vercel em Settings > Environment Variables e faça um REDEPLOY.");
  }
  if (apiKey.includes("dummy")) {
     throw new Error("API_KEY_INVALID: A chave parece ser um valor de teste inválido.");
  }
};

export const hasApiKey = (): boolean => {
  return !!apiKey && apiKey.length > 10;
};

// --- FUNÇÕES EXPORTADAS ---

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
    // Retorna um fallback gracioso para não quebrar a home
    return {
      quote: "O universo fala com aqueles que escutam.",
      author: "Órion",
      insight: error.message.includes("MISSING") ? "Configure a API Key no Vercel." : "Conexão estelar instável."
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
    throw new Error(error.message || "Erro de conexão cósmica");
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
    throw new Error(error.message || "As estrelas não responderam.");
  }
};

export const createOracleChat = (): Chat => {
  validateConnection();
  
  return ai.chats.create({
    model: FAST_MODEL,
    config: {
      systemInstruction: "Você é 'Órion', guia do 'Tô no Cosmos'. Responda em Português (Brasil). Respostas CURTAS (max 2 frases). Místico, acolhedor. Use emojis ✨.",
    }
  });
};