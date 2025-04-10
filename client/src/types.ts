// Types for the client application

export enum StressLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface ChatMessage {
  id: string;
  content: string;
  isUserMessage: boolean;
  timestamp: Date;
}

export interface StressAnalysisResult {
  id: string;
  stressLevel: number; // 0-100
  stressCategory: StressLevel;
  voiceToneScore: number; // 0-100
  voiceToneLabel: string;
  speechPaceScore: number; // 0-100
  speechPaceLabel: string;
  voiceTremorScore: number; // 0-100
  voiceTremorLabel: string;
  sentimentScore: number; // 0-100
  sentimentLabel: string;
  transcript?: string;
  timestamp: Date;
  recommendations: string[];
}

export interface StressHistoryEntry extends StressAnalysisResult {
  date: string;
  time: string;
  keyFactors: string;
}

export type TimeRange = 'week' | 'month' | 'year';

export interface User {
  id: string;
  username: string;
}
