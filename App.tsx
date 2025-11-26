import React, { useState } from 'react';
import Navigation from './components/Navigation';
import OracleChat from './components/OracleChat';
import DreamReader from './components/DreamReader';
import MeditationTimer from './components/MeditationTimer';
import StarMap from './components/StarMap';
import DailyCard from './components/DailyCard';
import Rituals from './components/Rituals';
import { AppView } from './types';
import { Sparkles, Wind, Compass, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  const renderContent = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="flex flex-col h-full overflow-y-auto pb-24">
            <header className="p-8 pb-4 pt-12 text-center">
              <h1 className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-br from-indigo-200 via-white to-purple-200 mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Tô no Cosmos
              </h1>
              <p className="text-indigo-200/70 font-light tracking-wide">Explore seu universo interior</p>
            </header>
            
            <DailyCard />
            
            <div className="grid grid-cols-2 gap-3 px-4 max-w-lg mx-auto mt-6">
              <button 
                onClick={() => setCurrentView(AppView.STARMAP)}
                className="col-span-2 glass-panel p-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/5 transition-all group border-t border-indigo-300/20"
              >
                 <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                  <Compass size={24} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-medium text-slate-200 uppercase tracking-wide">Meu Mapa Estelar</span>
                  <span className="text-xs text-slate-400">Previsão diária personalizada</span>
                </div>
              </button>

              <button 
                onClick={() => setCurrentView(AppView.RITUALS)}
                className="col-span-2 glass-panel p-4 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all group border-t border-fuchsia-300/20"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-fuchsia-500/20 rounded-full text-fuchsia-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all">
                    <ScrollText size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-medium text-slate-200 uppercase tracking-wide">Diário de Rituais</span>
                    <span className="text-xs text-slate-400">Check-in e Gratidão</span>
                  </div>
                </div>
                <div className="text-fuchsia-300 text-xs bg-fuchsia-500/10 px-2 py-1 rounded">Hoje</div>
              </button>

              <button 
                onClick={() => setCurrentView(AppView.ORACLE)}
                className="glass-panel p-5 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all group border-t border-purple-400/20"
              >
                <div className="p-4 bg-purple-500/20 rounded-full text-purple-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
                  <Sparkles size={28} />
                </div>
                <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">Oráculo</span>
              </button>
              
              <button 
                onClick={() => setCurrentView(AppView.MEDITATION)}
                className="glass-panel p-5 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/5 transition-all group border-t border-cyan-400/20"
              >
                <div className="p-4 bg-cyan-500/20 rounded-full text-cyan-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all">
                  <Wind size={28} />
                </div>
                <span className="text-sm font-medium text-slate-200 uppercase tracking-wide">Respirar</span>
              </button>
            </div>
            
            <div className="px-8 mt-12 text-center">
               <p className="text-[10px] text-indigo-400/40 uppercase tracking-[0.2em]">© 2024 Tô no Cosmos</p>
            </div>
          </div>
        );
      case AppView.ORACLE:
        return <OracleChat />;
      case AppView.DREAMS:
        return <DreamReader />;
      case AppView.MEDITATION:
        return <MeditationTimer />;
      case AppView.STARMAP:
        return <StarMap />;
      case AppView.RITUALS:
        return <Rituals />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="bg-cosmos text-white h-screen w-full overflow-hidden relative selection:bg-indigo-500/30">
      {/* Global Animated Background Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-fuchsia-900/10 blur-[100px] animate-float"></div>
      </div>

      <main className="h-full w-full relative z-10">
        {renderContent()}
      </main>

      <Navigation currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
};

export default App;