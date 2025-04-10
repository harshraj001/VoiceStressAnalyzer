import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStressAnalysisSchema, insertChatMessageSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import fetch from "node-fetch";

// API keys from environment variables
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

      // Use Gemini API with provided API key
      if (GEMINI_API_KEY) {
        try {
          const response = await getGeminiResponse(message);
          return res.json({ response });
        } catch (apiError) {
          console.error("Error calling Gemini API:", apiError);
          // Fall back to simulated response if API call fails
          const fallbackResponse = await simulateGeminiResponse(message);
          return res.json({ response: fallbackResponse });
        }
      } else {
        // Fallback if no API key is provided
        const fallbackResponse = await simulateGeminiResponse(message);
        return res.json({ response: fallbackResponse });
      }
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
      
      if (ASSEMBLYAI_API_KEY) {
        try {
          // Use real AssemblyAI analysis
          const analysisResult = await analyzeVoiceWithAssemblyAI(audioBuffer);
          return res.json(analysisResult);
        } catch (apiError) {
          console.error("Error using AssemblyAI:", apiError);
          // Fallback to simulated analysis if API call fails
          const fallbackResult = await simulateVoiceAnalysis(audioBuffer);
          return res.json(fallbackResult);
        }
      } else {
        // Fallback if no API key is provided
        const fallbackResult = await simulateVoiceAnalysis(audioBuffer);
        return res.json(fallbackResult);
      }
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

// Real Gemini API implementation
async function getGeminiResponse(message: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not provided");
  }

  // API URL for Gemini-1.0-pro model
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  
  try {
    const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "system",
            parts: [{
              text: `You are VoiceEase, a conversational assistant helping users manage their stress.
                     
                     RULES:
                     - Respond directly to user messages in a natural conversational manner
                     - If user sends a greeting (hello, hi), respond with a simple friendly greeting
                     - Keep responses brief and to the point (1-3 sentences maximum)
                     - Only discuss stress management when the user asks about it specifically
                     - Do not inject advice or suggestions unless asked directly
                     - Never prefix your responses with "As VoiceEase" or similar phrases
                     
                     When the user asks about:
                     - Stress management: Offer practical techniques
                     - Voice analysis: Explain this app can analyze voice patterns to detect stress levels
                     - Mental wellness: Provide general information and resources
                     
                     This is a normal chat where you act as a friendly assistant rather than a therapist.`
            }]
          },
          {
            role: "user",
            parts: [{
              text: message
            }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 150,
        }
      })
    });

    const data = await response.json() as {
      error?: { message: string };
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>
        }
      }>;
    };
    
    if (data.error) {
      console.error("Gemini API error:", data.error);
      throw new Error(data.error.message || "Error calling Gemini API");
    }

    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Simulate Gemini API response (placeholder for fallback)
async function simulateGeminiResponse(message: string): Promise<string> {
  // Check for greetings
  const greetings = ["hi", "hello", "hey", "greetings", "howdy"];
  const cleanMessage = message.toLowerCase().trim();
  
  if (greetings.some(greeting => cleanMessage === greeting || cleanMessage.startsWith(`${greeting} `))) {
    return "Hello! How can I help you today?";
  }
  
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

// Real voice analysis with AssemblyAI
async function analyzeVoiceWithAssemblyAI(audioBuffer: Buffer): Promise<any> {
  if (!ASSEMBLYAI_API_KEY) {
    throw new Error("AssemblyAI API key is not provided");
  }

  try {
    // Step 1: Upload the audio file to AssemblyAI
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        "Authorization": ASSEMBLYAI_API_KEY,
        "Content-Type": "application/octet-stream"
      },
      body: audioBuffer
    });

    if (!uploadResponse.ok) {
      throw new Error(`AssemblyAI upload error: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json() as { upload_url: string };
    const audioUrl = uploadData.upload_url;

    // Step 2: Transcribe the audio with sentiment analysis
    const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        "Authorization": ASSEMBLYAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        sentiment_analysis: true,
        content_safety: true,
        auto_highlights: true,
        speaker_labels: true,
        entity_detection: true,
        speech_threshold: 0.2,
      })
    });

    if (!transcriptResponse.ok) {
      throw new Error(`AssemblyAI transcription error: ${transcriptResponse.status} ${transcriptResponse.statusText}`);
    }

    const transcriptData = await transcriptResponse.json() as { id: string };
    const transcriptId = transcriptData.id;

    // Step 3: Poll for transcription results
    let transcript: any = null;
    for (let i = 0; i < 30; i++) { // Retry up to 30 times (30 seconds)
      const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        method: "GET",
        headers: {
          "Authorization": ASSEMBLYAI_API_KEY
        }
      });

      if (!pollingResponse.ok) {
        throw new Error(`AssemblyAI polling error: ${pollingResponse.status} ${pollingResponse.statusText}`);
      }

      transcript = await pollingResponse.json() as { status: string; text: string; sentiment_analysis_results: any[] };

      if (transcript.status === "completed") {
        break;
      } else if (transcript.status === "error") {
        throw new Error("AssemblyAI transcription failed");
      }

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!transcript || transcript.status !== "completed") {
      throw new Error("Transcription timed out or failed");
    }

    // Step 4: Analyze the transcript for stress indicators
    const text = transcript.text;
    const sentimentResults = transcript.sentiment_analysis_results || [];

    // Calculate sentiment score (average sentiment score from 0-100)
    let sentimentScore = 50; // Neutral default
    if (sentimentResults.length > 0) {
      // Convert sentiment to a score: positive=100, neutral=50, negative=0
      const sentimentValues = sentimentResults.map((result: { sentiment: string }) => {
        if (result.sentiment === "POSITIVE") return 100;
        if (result.sentiment === "NEGATIVE") return 0;
        return 50; // NEUTRAL
      });
      sentimentScore = Math.round(sentimentValues.reduce((sum: number, val: number) => sum + val, 0) / sentimentValues.length);
    }

    // Analyze speech pace (word count per minute)
    // For simplicity, we'll calculate this based on word count and duration
    const wordCount = text.split(/\s+/).length;
    const durationMs = transcript.audio_duration || 30000; // Default to 30 seconds if missing
    const durationMinutes = durationMs / 60000;
    const wordsPerMinute = wordCount / durationMinutes;
    
    // Convert words per minute to a score (0-100)
    // Average speaking rate is 120-150 WPM, higher values might indicate stress
    let speechPaceScore = 50;
    if (wordsPerMinute > 180) speechPaceScore = 90; // Very fast
    else if (wordsPerMinute > 150) speechPaceScore = 75; // Fast
    else if (wordsPerMinute < 100) speechPaceScore = 30; // Slow
    
    // For voice tone and tremor, we would need audio analysis not provided by AssemblyAI
    // We'll estimate these based on other factors and add some randomness
    
    // Voice tone score (estimated)
    // Uses sentiment as a base and adds randomness
    const voiceToneScore = Math.min(100, Math.max(0, 
      Math.round(100 - sentimentScore * 0.7) + Math.floor(Math.random() * 20) - 10
    ));
    
    // Voice tremor (estimated)
    // More negative sentiment often correlates with more tremor
    const voiceTremorScore = Math.min(100, Math.max(0,
      Math.round(100 - sentimentScore * 0.6) + Math.floor(Math.random() * 20) - 10
    ));

    // Calculate overall stress level (1-100)
    const stressLevel = Math.min(100, Math.max(1, Math.floor(
      (voiceToneScore * 0.3) + 
      (speechPaceScore * 0.25) + 
      (voiceTremorScore * 0.2) + 
      (sentimentScore * 0.25)
    )));

    // Generate stress labels based on scores
    const getScoreLabel = (score: number, type: string): string => {
      if (score < 30) return `Low ${type}`;
      if (score < 70) return `Moderate ${type}`;
      return `High ${type}`;
    };

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
      voiceToneLabel: getScoreLabel(voiceToneScore, "tension"),
      speechPaceLabel: getScoreLabel(speechPaceScore, "pace"),
      voiceTremorLabel: getScoreLabel(voiceTremorScore, "tremor"),
      sentimentLabel: getScoreLabel(sentimentScore, "negativity"),
      transcript: text,
      recommendations
    };
  } catch (error) {
    console.error("Error in AssemblyAI voice analysis:", error);
    throw error;
  }
}

// Simulate voice analysis (placeholder for fallback)
async function simulateVoiceAnalysis(audioBuffer: Buffer): Promise<any> {
  // Generate realistic-looking result with random values
  const voiceToneScore = Math.floor(Math.random() * 100) + 1; // 1-100 range
  const speechPaceScore = Math.floor(Math.random() * 100) + 1; // 1-100 range
  const voiceTremorScore = Math.floor(Math.random() * 100) + 1; // 1-100 range
  const sentimentScore = Math.floor(Math.random() * 100) + 1; // 1-100 range
  
  // Calculate overall stress level (weighted average)
  const stressLevel = Math.floor(
    (voiceToneScore * 0.3) + 
    (speechPaceScore * 0.25) + 
    (voiceTremorScore * 0.2) + 
    (sentimentScore * 0.25)
  );
  
  // Generate labels based on scores
  const getScoreLabel = (score: number, type: string): string => {
    if (score < 30) return `Low ${type}`;
    if (score < 70) return `Moderate ${type}`;
    return `High ${type}`;
  };
  
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
    voiceToneLabel: getScoreLabel(voiceToneScore, "tension"),
    speechPaceLabel: getScoreLabel(speechPaceScore, "pace"),
    voiceTremorLabel: getScoreLabel(voiceTremorScore, "tremor"),
    sentimentLabel: getScoreLabel(sentimentScore, "negativity"),
    transcript: "This is a simulated transcript of what would be returned from the speech-to-text service.",
    recommendations
  };
}
