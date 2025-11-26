import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const MeditationTimer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [duration, setDuration] = useState(300);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    let interval: any;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        
        // Breathing logic (4-4-4 box breathing roughly mapped)
        const cycle = 12; // seconds
        const current = duration - timeLeft; // elapsed
        const mod = current % cycle;
        
        if (mod < 4) setPhase('inhale');
        else if (mod < 8) setPhase('hold');
        else setPhase('exhale');

      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setPhase('inhale');
  };

  const handleDurationChange = (minutes: number) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getInstructions = () => {
    if (!isActive) return "Prepare-se para relaxar";
    switch(phase) {
      case 'inhale': return "Inspire profundamente...";
      case 'hold': return "Segure o ar...";
      case 'exhale': return "Expire lentamente...";
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 relative">
       {/* Background Glow */}
       <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] transition-all duration-[4000ms] ${
         isActive && phase === 'inhale' ? 'bg-cyan-500/40 scale-150' : 
         isActive && phase === 'hold' ? 'bg-purple-500/40 scale-125' :
         isActive && phase === 'exhale' ? 'bg-indigo-500/30 scale-100' : 'bg-slate-700/20 scale-90'
       }`}></div>

      {/* Main Circle Animation */}
      <div className="relative mb-12">
        <div className={`w-64 h-64 border-2 border-white/10 rounded-full flex items-center justify-center relative transition-all duration-[4000ms] ease-in-out ${
           isActive && phase === 'inhale' ? 'scale-110 border-cyan-400/50' : 
           isActive && phase === 'hold' ? 'scale-110 border-purple-400/50' :
           isActive && phase === 'exhale' ? 'scale-95 border-indigo-400/50' : 'scale-100'
        }`}>
            <div className={`absolute inset-0 rounded-full border border-white/20 transition-all duration-[4000ms] ${
               isActive ? 'animate-pulse-glow' : ''
            }`}></div>
            
            <div className="text-center z-10">
                <div className="text-5xl font-light font-mono text-white mb-2 tabular-nums">
                    {formatTime(timeLeft)}
                </div>
                <div className="text-purple-200 font-medium uppercase tracking-widest text-sm animate-pulse">
                    {getInstructions()}
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-12 z-10">
        <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-white text-purple-900 flex items-center justify-center hover:bg-purple-50 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
        >
            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        >
            <RotateCcw size={20} />
        </button>
      </div>

      {/* Duration Selector */}
      <div className="flex gap-4 z-10">
        {[3, 5, 10].map(min => (
            <button
                key={min}
                onClick={() => handleDurationChange(min)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    duration === min * 60 
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
                {min} min
            </button>
        ))}
      </div>
    </div>
  );
};

export default MeditationTimer;