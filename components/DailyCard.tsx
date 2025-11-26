import React, { useEffect, useState } from 'react';
import { Sun, Quote, Loader } from 'lucide-react';
import { getDailyWisdom } from '../services/geminiService';
import { DailyWisdom } from '../types';

const DailyCard: React.FC = () => {
  const [wisdom, setWisdom] = useState<DailyWisdom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWisdom = async () => {
      try {
        const data = await getDailyWisdom();
        setWisdom(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchWisdom();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto p-4 animate-in fade-in zoom-in duration-700">
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-t border-white/20">
        <div className="absolute top-0 right-0 p-12 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6 text-orange-200">
            <Sun size={20} className="animate-spin-slow" />
            <span className="uppercase tracking-widest text-xs font-bold">Sabedoria do Dia</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-10 gap-3 text-slate-400">
              <Loader className="animate-spin" />
              <span className="text-sm">Conectando à fonte...</span>
            </div>
          ) : wisdom ? (
            <>
              <Quote className="text-white/20 mb-4 transform rotate-180" size={32} />
              <p className="text-2xl md:text-3xl font-serif text-white leading-tight mb-6">
                "{wisdom.quote}"
              </p>
              <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-6">
                <span className="text-orange-300 font-medium">— {wisdom.author}</span>
              </div>
              
              <div className="bg-slate-900/40 rounded-xl p-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-purple-300 font-bold mr-2">Insight:</span>
                  {wisdom.insight}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center text-red-300">Não foi possível carregar a sabedoria hoje.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCard;