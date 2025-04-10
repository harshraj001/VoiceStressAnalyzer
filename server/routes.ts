import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStressAnalysisSchema, insertChatMessageSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import fetch from "node-fetch";

// Create uploads storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  } 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // POST /api/chat - Send message to Gemini and get response
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Use Gemini API (placeholder for the actual implementation)
      // In a real implementation, you would make a proper request to the Gemini API
      const response = await simulateGeminiResponse(message);
      
      return res.json({ 
        response 
      });
    } catch (error) {
      console.error("Error in chat API:", error);
      return res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  // POST /api/analyze-voice - Analyze voice recording
  app.post("/api/analyze-voice", upload.single('audio'), async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
      }

      // Get the audio file buffer
      const audioBuffer = req.file.buffer;
      
      // In a real implementation, you would:
      // 1. Send the audio to AssemblyAI for transcription and sentiment analysis
      // 2. Analyze audio features using libraries like librosa, parselmouth or pyAudioAnalysis
      // 3. Combine the results to calculate the stress level
      
      // For now, simulate the analysis
      const analysisResult = await simulateVoiceAnalysis(audioBuffer);
      
      return res.json(analysisResult);
    } catch (error) {
      console.error("Error in voice analysis API:", error);
      return res.status(500).json({ error: "Failed to analyze voice recording" });
    }
  });

  // Endpoint to save stress analysis result to database
  app.post("/api/stress-analysis", async (req, res) => {
    try {
      const validatedData = insertStressAnalysisSchema.parse(req.body);
      
      // Store in database (would be implemented in a real app)
      // In this demo, we're using client-side storage instead
      
      return res.status(201).json({ message: "Stress analysis saved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: "Failed to save stress analysis" });
    }
  });

  // GET /api/stress-history - Get stress analysis history for a user
  app.get("/api/stress-history", async (req, res) => {
    try {
      // In a real implementation, you would fetch from the database
      // Using the user ID from the authenticated session
      
      // For demo purposes, we're using client-side storage instead
      return res.json({ message: "Use client-side local storage for this demo" });
    } catch (error) {
      console.error("Error fetching stress history:", error);
      return res.status(500).json({ error: "Failed to fetch stress history" });
    }
  });

  return httpServer;
}

// Simulate Gemini API response (placeholder)
async function simulateGeminiResponse(message: string): Promise<string> {
  // Check if message contains keywords to customize response
  if (message.toLowerCase().includes("stress") || message.toLowerCase().includes("anxious")) {
    return "I understand you're feeling stressed. That's a normal response to challenging situations. Would you like to try a quick breathing exercise, learn about stress management techniques, or analyze your voice to measure your current stress levels?";
  }
  
  if (message.toLowerCase().includes("sleep") || message.toLowerCase().includes("insomnia")) {
    return "Sleep problems can both cause and be caused by stress. Here are some tips that might help:\n\n• Establish a regular sleep schedule\n• Create a relaxing bedtime routine\n• Limit screen time before bed\n• Create a comfortable sleep environment\n• Try relaxation techniques like deep breathing";
  }
  
  if (message.toLowerCase().includes("breathe") || message.toLowerCase().includes("breathing")) {
    return "Deep breathing is a powerful stress-reduction technique. Try this: Inhale slowly through your nose for 4 seconds, hold for 7 seconds, and exhale through your mouth for 8 seconds. Repeat this pattern 5 times. How do you feel after trying it?";
  }
  
  // Default response
  return "I'm here to help you manage stress and improve your well-being. You can ask me about stress management techniques, try a voice stress analysis, or discuss specific concerns you have about your mental well-being. How can I assist you today?";
}

// Simulate voice analysis (placeholder)
async function simulateVoiceAnalysis(audioBuffer: Buffer): Promise<any> {
  // In a real implementation, this would:
  // 1. Send audio to AssemblyAI for transcription and sentiment analysis
  // 2. Analyze audio features (pitch, rate, variability, etc.)
  // 3. Calculate stress indicators based on audio features
  
  // Generate a realistic-looking result with random values
  const voiceToneScore = Math.floor(Math.random() * 40) + 40; // 40-80 range
  const speechPaceScore = Math.floor(Math.random() * 50) + 40; // 40-90 range
  const voiceTremorScore = Math.floor(Math.random() * 40) + 20; // 20-60 range
  const sentimentScore = Math.floor(Math.random() * 40) + 40; // 40-80 range
  
  // Calculate overall stress level (weighted average)
  const stressLevel = Math.floor(
    (voiceToneScore * 0.3) + 
    (speechPaceScore * 0.25) + 
    (voiceTremorScore * 0.2) + 
    (sentimentScore * 0.25)
  );
  
  // Generate recommendations based on stress level
  const recommendations = [];
  if (stressLevel > 70) {
    recommendations.push(
      "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8",
      "Consider a 10-minute break to reset your mind",
      "Use progressive muscle relaxation to release physical tension"
    );
  } else if (stressLevel > 40) {
    recommendations.push(
      "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8",
      "Consider taking a short break to reset your mind",
      "Listen to calming sounds or music to reduce tension"
    );
  } else {
    recommendations.push(
      "Continue practicing mindfulness regularly",
      "Maintain your current stress management techniques",
      "Schedule regular breaks throughout your day"
    );
  }
  
  return {
    stressLevel,
    voiceToneScore,
    speechPaceScore,
    voiceTremorScore,
    sentimentScore,
    transcript: "This is a simulated transcript of what would be returned from the speech-to-text service.",
    recommendations
  };
}
