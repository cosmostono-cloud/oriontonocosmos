import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Chat } from '@google/genai';
import { createOracleChat } from '../services/geminiService';
import { Message } from '../types';

const OracleChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Saudações. Sou Órion. O que busca no cosmos hoje? ✨',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tenta conectar ao carregar
  useEffect(() => {
    try {
      chatSessionRef.current = createOracleChat();
      setConnectionError(null);
    } catch (e: any) {
      console.error("Falha ao iniciar chat:", e);
      setConnectionError(e.message || "Erro desconhecido ao iniciar");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    // Se houve erro na inicialização, tenta recriar
    if (!chatSessionRef.current) {
        try {
            chatSessionRef.current = createOracleChat();
            setConnectionError(null);
        } catch (e: any) {
             setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                text: `⚠️ Erro de Configuração: ${e.message}`,
                timestamp: new Date()
              }]);
            return;
        }
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const modelText = response.text || "O vácuo está silencioso. Tente sintonizar novamente 🌌.";

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: modelText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
      console.error("Chat error", error);
      
      let errorMessage = "Houve uma interferência na transmissão estelar. Tente novamente.";
      
      // Diagnóstico de erro para o usuário
      if (error.message && error.message.includes('API_KEY')) {
        errorMessage = "⚠️ Falta a API Key. Configure no Vercel (Settings > Environment Variables).";
      } else if (error.status === 400 || error.toString().includes('400')) {
        errorMessage = "⚠️ Erro na Requisição (400). A chave pode estar inválida.";
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="flex items-center justify-between p-6 border-b border-white/5 z-10">
        <h2 className="text-2xl text-purple-200 flex items-center gap-2 font-serif">
          <Sparkles className="text-yellow-200" size={20} />
          Oráculo Órion
        </h2>
      </header>
      
      {connectionError && (
          <div className="bg-red-500/20 text-red-200 p-2 text-center text-xs mx-4 mt-2 rounded border border-red-500/30 flex items-center justify-center gap-2">
              <AlertTriangle size={12} />
              {connectionError.includes('API_KEY') ? 'Configure a API KEY no Vercel' : 'Erro de Conexão'}
          </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 pb-24">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600/60 text-white rounded-tr-sm backdrop-blur-sm border border-indigo-400/30'
                  : 'bg-slate-900/60 text-purple-100 rounded-tl-sm border border-purple-500/20 backdrop-blur-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/50 p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center text-purple-300">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-sm">Sintonizando frequências...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 z-20">
        <div className="max-w-3xl mx-auto flex gap-2 glass-panel p-2 rounded-full shadow-2xl shadow-indigo-900/30">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Envie seu sinal para Órion..."
            className="flex-1 bg-transparent border-none text-white px-4 focus:ring-0 placeholder-indigo-300/40 outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OracleChat;