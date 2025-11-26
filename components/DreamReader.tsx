import React, { useState } from 'react';
import { Moon, Star, Feather, RefreshCw, ChevronRight } from 'lucide-react';
import { interpretDream } from '../services/geminiService';
import { DreamInterpretation } from '../types';

const DreamReader: React.FC = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterpret = async () => {
    if (!dreamText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await interpretDream(dreamText);
      setInterpretation(result);
    } catch (e) {
      setError("Não foi possível conectar com Órion no momento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setInterpretation(null);
    setDreamText('');
    setError(null);
  };

  if (interpretation) {
    return (
      <div className="p-6 pb-24 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-2xl mx-auto">
          <button onClick={reset} className="flex items-center text-sm text-purple-300 mb-6 hover:text-white transition-colors">
            <RefreshCw size={14} className="mr-2" /> Outro sonho
          </button>
          
          <h2 className="text-3xl mb-6 text-purple-100 flex items-center gap-3">
            <Moon className="text-purple-400 fill-purple-400/20" />
            Revelações
          </h2>

          <div className="glass-panel rounded-2xl p-6 mb-6 border-l-4 border-l-purple-500">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Essência</h3>
            <p className="text-slate-300 leading-relaxed">{interpretation.summary}</p>
          </div>

          <div className="grid gap-4 mb-6">
             <h3 className="text-lg font-semibold text-purple-200 mt-2">Símbolos</h3>
            {interpretation.symbols.map((sym, idx) => (
              <div key={idx} className="bg-slate-800/40 p-4 rounded-xl flex items-start gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300 mt-1">
                   <Star size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-purple-100 uppercase text-sm tracking-wider">{sym.name}</h4>
                  <p className="text-slate-400 text-sm mt-1">{sym.meaning}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900/30 rounded-2xl p-6 border border-indigo-500/30">
            <h3 className="text-lg font-semibold text-indigo-200 mb-2 flex items-center gap-2">
              <Feather size={18} /> Conselho de Órion
            </h3>
            <p className="text-indigo-100 italic">"{interpretation.guidance}"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-lg w-full z-10 text-center">
        <div className="mb-8 inline-block p-4 rounded-full bg-slate-800/50 ring-1 ring-white/10 animate-float">
          <Moon size={40} className="text-purple-300" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">Diário de Sonhos</h2>
        <p className="text-slate-400 mb-8">
          Descreva sua jornada onírica. Revelaremos os arquétipos e mensagens ocultas em seu subconsciente.
        </p>

        <div className="glass-panel p-1 rounded-2xl shadow-2xl relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
          <div className="relative bg-slate-900 rounded-xl p-4">
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Eu estava voando sobre um oceano prateado..."
              className="w-full h-40 bg-transparent border-none text-slate-200 placeholder-slate-600 focus:ring-0 resize-none text-lg leading-relaxed"
              disabled={isLoading}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleInterpret}
          disabled={!dreamText.trim() || isLoading}
          className="mt-8 group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white transition-all duration-200 bg-purple-600 rounded-full hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          {isLoading ? (
            <span className="flex items-center">
              <RefreshCw className="animate-spin mr-2" /> Consultando...
            </span>
          ) : (
            <span className="flex items-center">
              Revelar Significado <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DreamReader;