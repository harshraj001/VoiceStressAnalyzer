import { StressAnalysisResult, ChatMessage } from "@/types";

const STORAGE_KEY_STRESS = "voiceease_stress_analyses";
const STORAGE_KEY_CHAT = "voiceease_chat_messages";

// Store stress analysis result in localStorage
export const saveStressAnalysis = (result: StressAnalysisResult): void => {
  try {
    const existingData = getStressHistory();
    const updatedData = [...existingData, result];
    localStorage.setItem(STORAGE_KEY_STRESS, JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error saving stress analysis:", error);
  }
};

// Get all stress history from localStorage
export const getStressHistory = (): StressAnalysisResult[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY_STRESS);
    if (!storedData) return [];
    return JSON.parse(storedData) as StressAnalysisResult[];
  } catch (error) {
    console.error("Error retrieving stress history:", error);
    return [];
  }
};

// Get stress history filtered by time range
export const getStressHistoryByTimeRange = (days: number): StressAnalysisResult[] => {
  try {
    const allHistory = getStressHistory();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return allHistory.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= cutoffDate;
    });
  } catch (error) {
    console.error("Error filtering stress history:", error);
    return [];
  }
};

// Save chat messages to localStorage
export const saveChatMessages = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat messages:", error);
  }
};

// Get chat messages from localStorage
export const getChatMessages = (): ChatMessage[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY_CHAT);
    if (!storedData) return [];
    return JSON.parse(storedData) as ChatMessage[];
  } catch (error) {
    console.error("Error retrieving chat messages:", error);
    return [];
  }
};

// Clear all stored data (for logout or reset)
export const clearAllStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_STRESS);
    localStorage.removeItem(STORAGE_KEY_CHAT);
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
};
