export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  HOME = 'HOME',
  ORACLE = 'ORACLE',
  DREAMS = 'DREAMS',
  MEDITATION = 'MEDITATION',
  STARMAP = 'STARMAP',
  RITUALS = 'RITUALS'
}

export interface DailyWisdom {
  quote: string;
  author: string;
  insight: string;
}

export interface DreamInterpretation {
  summary: string;
  symbols: { name: string; meaning: string }[];
  guidance: string;
}

export interface StarMapReading {
  sunSign: string;
  risingSign: string;
  dailyPrediction: string;
  powerColor: string;
  luckyNumber: string;
}