import React from 'react';
import { Home, MessageCircle, Moon, Disc, Compass, ScrollText } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: AppView.HOME, label: 'Início', icon: Home },
    { id: AppView.STARMAP, label: 'Mapa', icon: Compass },
    { id: AppView.ORACLE, label: 'Oráculo', icon: MessageCircle },
    { id: AppView.RITUALS, label: 'Rituais', icon: ScrollText },
    { id: AppView.DREAMS, label: 'Sonhos', icon: Moon },
    { id: AppView.MEDITATION, label: 'Meditar', icon: Disc },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 pb-safe">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${
                isActive ? 'text-purple-300' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon
                size={isActive ? 20 : 18}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`}
              />
              <span className="text-[8px] uppercase tracking-wider font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;