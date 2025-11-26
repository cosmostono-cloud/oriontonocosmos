import React, { useState } from 'react';
import { Compass, Calendar, Clock, Star, RefreshCcw, Sparkles } from 'lucide-react';
import { getStarMapReading } from '../services/geminiService';
import { StarMapReading } from '../types';

const StarMap: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [reading, setReading] = useState<StarMapReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Formata a data enquanto digita: DD/MM/AAAA
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + '/' + v.slice(5);
    if (v.length > 10) v = v.slice(0, 10);
    setBirthDate(v);
  };

  // Formata a hora enquanto digita: HH:MM
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (v.length > 2) v = v.slice(0, 2) + ':' + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5);
    setBirthTime(v);
  };

  const handleAnalyze = async () => {
    if (birthDate.length < 10 || birthTime.length < 5) {
        alert("Por favor, preencha a data (DD/MM/AAAA) e hora (HH:MM) completas.");
        return;
    }
    setIsLoading(true);
    try {
      const result = await getStarMapReading(birthDate, birthTime);
      setReading(result);
    } catch (e: any) {
      alert(e.message || "As estrelas estão tímidas hoje. Verifique sua conexão ou a chave de API.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setReading(null);
    setBirthDate('');
    setBirthTime('');
  };

  if (reading) {
    return (
      <div className="p-6 pb-24 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-md mx-auto">
          <button onClick={reset} className="flex items-center text-xs text-purple-300 mb-6 hover:text-white transition-colors uppercase tracking-widest">
            <RefreshCcw size={12} className="mr-2" /> Novo Alinhamento
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-white mb-1">Mapa de Hoje</h2>
            <p className="text-indigo-300 text-sm">A dança dos astros para você</p>
          </div>

          {/* Cards de Signos */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-panel p-4 rounded-2xl text-center border-t border-orange-400/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 rounded-full blur-2xl"></div>
               <span className="text-xs text-slate-400 uppercase tracking-wider">Sol em</span>
               <div className="text-xl font-serif text-orange-100 mt-1">{reading.sunSign}</div>
            </div>
            <div className="glass-panel p-4 rounded-2xl text-center border-t border-blue-400/30 relative overflow-hidden">
               <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl"></div>
               <span className="text-xs text-slate-400 uppercase tracking-wider">Ascendente</span>
               <div className="text-xl font-serif text-blue-100 mt-1">{reading.risingSign}</div>
            </div>
          </div>

          {/* Previsão Principal */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-6 rounded-2xl border border-white/10 mb-6 shadow-lg relative">
            <Sparkles className="absolute top-4 right-4 text-yellow-200/50" size={20} />
            <h3 className="text-lg font-serif text-white mb-3">Revelação de Órion</h3>
            <p className="text-indigo-100 leading-relaxed italic">
              "{reading.dailyPrediction}"
            </p>
          </div>

          {/* Dicas Extras */}
          <div className="flex gap-4">
             <div className="flex-1 glass-panel p-3 rounded-xl flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 uppercase mb-1">Cor de Poder</span>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-current text-white shadow-[0_0_8px_currentColor]"></div>
                   <span className="font-medium text-white">{reading.powerColor}</span>
                </div>
             </div>
             <div className="flex-1 glass-panel p-3 rounded-xl flex flex-col items-center justify-center">
                <span className="text-[10px] text-slate-400 uppercase mb-1">Número da Sorte</span>
                <span className="font-serif text-xl text-white">{reading.luckyNumber}</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 relative">
       {/* Background Decoration */}
       <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-[50px]"></div>
       <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px]"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Compass size={32} className="text-indigo-300" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2">Mapa Estelar</h2>
          <p className="text-slate-400 text-sm px-6">
            Informe sua chegada ao mundo para que Órion calcule as energias do dia.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-1">Data de Nascimento</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-purple-300 transition-colors" size={18} />
              <input 
                type="text" 
                value={birthDate}
                onChange={handleDateChange}
                placeholder="25/05/1990"
                maxLength={10}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 pl-4">Formato: DD/MM/AAAA</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-slate-400 font-semibold ml-1">Horário (Aproximado)</label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-purple-300 transition-colors" size={18} />
              <input 
                type="text" 
                value={birthTime}
                onChange={handleTimeChange}
                placeholder="14:30"
                maxLength={5}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 pl-4">Formato: HH:MM</p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!birthDate || !birthTime || isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-4 rounded-xl shadow-lg shadow-purple-900/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
               <>
                 <Star className="animate-spin" size={18} />
                 <span>Lendo os astros...</span>
               </>
            ) : (
               <>
                 <Sparkles size={18} />
                 <span>Revelar Energias de Hoje</span>
               </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarMap;