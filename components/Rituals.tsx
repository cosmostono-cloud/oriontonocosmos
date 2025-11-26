import React, { useState, useEffect } from 'react';
import { Check, Heart, Feather, Sun, Droplets, Leaf, Sparkles } from 'lucide-react';

// Static configuration to prevent serialization issues with React Components (Icons)
const RITUAL_TASKS = [
  { id: 'hydration', label: 'Hidratação Consciente', icon: Droplets },
  { id: 'silence', label: 'Momento de Silêncio', icon: Sun },
  { id: 'nature', label: 'Conexão com a Natureza', icon: Leaf },
  { id: 'kindness', label: 'Ato de Gentileza', icon: Heart },
];

const Rituals: React.FC = () => {
  const [gratitudeList, setGratitudeList] = useState<string[]>(['', '', '']);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString();
      const savedData = localStorage.getItem(`cosmos_rituals_${today}`);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.gratitudeList) setGratitudeList(parsed.gratitudeList);
        
        // Handle migration from old format (where full objects were saved) to new format (ids only)
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
           // Old format detection: elements are objects
           if (parsed.tasks.length > 0 && typeof parsed.tasks[0] === 'object') {
              const completedIds = parsed.tasks
                .filter((t: any) => t.completed)
                .map((t: any) => t.id);
              setCompletedTasks(completedIds);
           } else {
             // It might be the wrong key, but let's handle if it was stored as tasks: [ids]
             // (Unlikely based on previous code, but safe to ignore)
           }
        } 
        
        // Correct new format key
        if (parsed.completedTasks && Array.isArray(parsed.completedTasks)) {
          setCompletedTasks(parsed.completedTasks);
        }
      }
    } catch (e) {
      console.error("Failed to load rituals:", e);
      // Fallback to clear state if data is corrupted
    }
  }, []);

  // Save and calculate progress
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    // Only save serializable data (strings, numbers, booleans, arrays of these)
    const dataToSave = { gratitudeList, completedTasks };
    localStorage.setItem(`cosmos_rituals_${today}`, JSON.stringify(dataToSave));

    // Calculate progress
    const totalItems = RITUAL_TASKS.length + 3; // 3 gratitudes
    const completedCount = completedTasks.length;
    const filledGratitudes = gratitudeList.filter(g => g.trim().length > 0).length;
    const currentProgress = Math.round(((completedCount + filledGratitudes) / totalItems) * 100);
    
    setProgress(currentProgress);
  }, [completedTasks, gratitudeList]);

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => 
      prev.includes(id) 
        ? prev.filter(taskId => taskId !== id) 
        : [...prev, id]
    );
  };

  const handleGratitudeChange = (index: number, value: string) => {
    const newList = [...gratitudeList];
    newList[index] = value;
    setGratitudeList(newList);
  };

  return (
    <div className="h-full overflow-y-auto p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-full mb-3 ring-1 ring-purple-500/40">
            <Feather size={24} className="text-purple-300" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-1">Diário de Rituais</h2>
          <p className="text-slate-400 text-sm">Alinhe sua frequência diária</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-slate-800/50 rounded-full h-4 overflow-hidden border border-white/5 relative">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-widest uppercase text-white drop-shadow-md">
            Sincronização: {progress}%
          </div>
        </div>

        {/* Gratitude Section */}
        <div className="glass-panel p-6 rounded-2xl mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           
           <h3 className="text-lg font-serif text-fuchsia-200 mb-4 flex items-center gap-2">
             <Heart size={18} className="text-fuchsia-400" />
             Tríade da Gratidão
           </h3>
           <p className="text-xs text-slate-400 mb-4 uppercase tracking-wide">3 coisas positivas de hoje</p>
           
           <div className="space-y-3 relative z-10">
             {gratitudeList.map((text, idx) => (
               <div key={idx} className="relative group">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-500/50 font-serif text-sm">{idx + 1}.</span>
                 <input
                   type="text"
                   value={text}
                   onChange={(e) => handleGratitudeChange(idx, e.target.value)}
                   placeholder="Sou grato por..."
                   className="w-full bg-slate-900/40 border border-fuchsia-500/20 rounded-xl py-3 pl-8 pr-4 text-white placeholder-slate-600 focus:outline-none focus:bg-slate-900/80 focus:border-fuchsia-500/50 transition-all"
                 />
                 {text.trim().length > 3 && (
                   <Sparkles size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300 animate-pulse" />
                 )}
               </div>
             ))}
           </div>
        </div>

        {/* Habits Checklist */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-serif text-indigo-200 mb-4 flex items-center gap-2">
             <Check size={18} className="text-indigo-400" />
             Práticas Cósmicas
           </h3>
           
           <div className="space-y-3">
             {RITUAL_TASKS.map((task) => {
               const isCompleted = completedTasks.includes(task.id);
               return (
               <button
                 key={task.id}
                 onClick={() => toggleTask(task.id)}
                 className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-300 group border ${
                   isCompleted 
                     ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-indigo-500/50' 
                     : 'bg-slate-900/20 border-white/5 hover:bg-slate-800/40'
                 }`}
               >
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                   isCompleted ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-slate-500 group-hover:border-indigo-400'
                 }`}>
                   {isCompleted && <Check size={14} className="text-white" />}
                 </div>
                 
                 <div className="flex-1 text-left">
                    <span className={`text-sm font-medium transition-colors ${
                      isCompleted ? 'text-indigo-200 line-through decoration-indigo-500/50' : 'text-slate-300'
                    }`}>
                      {task.label}
                    </span>
                 </div>

                 <task.icon size={18} className={`${
                   isCompleted ? 'text-indigo-400' : 'text-slate-600'
                 }`} />
               </button>
             )})}
           </div>
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <div className="mt-8 text-center p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 animate-pulse-glow">
            <Sparkles className="mx-auto text-yellow-300 mb-2" />
            <p className="text-white font-serif">Alinhamento Completo</p>
            <p className="text-xs text-indigo-200">O universo sorri para você.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Rituals;