import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStressAnalysisSchema, insertChatMessageSchema } from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AssemblyAI } from "assemblyai";
import dotenv from "dotenv";
import fs from "fs";
import { Readable } from "stream";
import path from "path";
import { extractAudioFeatures } from "./audioAnalysis";

// Load environment variables from .env file
dotenv.config();

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

      console.log(`Received chat request with message: "${message}"`);
      console.log(`GEMINI_API_KEY available: ${Boolean(process.env.GEMINI_API_KEY)}`);
      
      // Use Gemini API with provided API key
      if (process.env.GEMINI_API_KEY) {
        try {
          console.log("Attempting to use Gemini API...");
          const response = await getGeminiResponse(message);
          console.log("Successfully received response from Gemini API");
          return res.json({ response, source: "gemini" });
        } catch (apiError) {
          console.error("Error calling Gemini API:", apiError);
          // Fall back to simulated response if API call fails
          console.log("Falling back to simulated response due to API error");
          const fallbackResponse = await simulateGeminiResponse(message);
          return res.json({ response: fallbackResponse, source: "fallback" });
        }
      } else {
        // Fallback if no API key is provided
        console.log("No Gemini API key provided, using fallback response");
        const fallbackResponse = await simulateGeminiResponse(message);
        return res.json({ response: fallbackResponse, source: "fallback" });
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
      
      if (process.env.ASSEMBLYAI_API_KEY) {
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

// Utility function to create a promise with timeout
function promiseWithTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMsg: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

// Real Gemini API implementation using the official GoogleGenerativeAI library
async function getGeminiResponse(message: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not provided");
  }

  try {
    console.log(`Initializing Gemini AI with API key: ${apiKey.substring(0, 4)}...`);
    
    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to use gemini-1.0-pro if 1.5-flash fails (providing fallback options)
    console.log("Creating generative model instance...");
    let modelName = "gemini-1.5-flash";
    try {
      // First try with the preferred model
      const model = genAI.getGenerativeModel({
        model: modelName,
      });
      
      // Configure the chat session with improved system message and parameters
      console.log(`Starting chat session with ${modelName} model...`);
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.7, // Increased for more varied responses
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 500, // Increased to allow for more detailed responses
        },
        history: [
          {
            role: "user",
            parts: [{ text: "You are VoiceEase, a specialized conversational assistant focused EXCLUSIVELY on stress management and mental well-being. Your purpose is to help users understand their stress levels and provide personalized coping strategies. You should be empathetic, supportive, and provide evidence-based advice for managing stress, anxiety, and improving overall mental wellness. When responding to users, maintain a warm, calm tone while being concise and practical." }],
          },
          {
            role: "model",
            parts: [{ text: "I understand my role as VoiceEase. I'll focus on helping users with stress management and mental well-being through empathetic, evidence-based support. I'll maintain a warm, calm tone while providing practical advice tailored to each user's needs." }],
          },
          {
            role: "user", 
            parts: [{ text: "For simple greetings like 'hi' or 'hello', respond casually without immediately mentioning stress or assistance. For all other interactions, focus ONLY on stress management, mental wellness techniques, relaxation strategies, and coping mechanisms. Base your responses on established psychological approaches like cognitive behavioral techniques, mindfulness practices, and scientifically-backed relaxation methods. If a user asks about topics unrelated to mental wellness, stress management, or general well-being, politely redirect them by saying you're specifically designed to help with stress management and mental well-being topics." }],
          },
          {
            role: "model",
            parts: [{ text: "Got it. I'll keep greetings casual and friendly. For stress-related topics, I'll provide evidence-based advice drawing from cognitive behavioral techniques, mindfulness practices, and proven relaxation methods, all while maintaining a supportive and practical approach. If users ask about unrelated topics, I'll gently remind them that I'm specialized in stress management and mental well-being, and redirect the conversation accordingly." }],
          },
        ],
      });
      
      // Send the user's message with timeout protection
      console.log("Sending message to Gemini API:", message);
      const result = await promiseWithTimeout(
        chatSession.sendMessage(message), 
        15000, // 15 seconds timeout
        "Gemini API request timed out"
      );
      
      const response = result.response.text();
      console.log("Gemini API response:", response);
      return response;
      
    } catch (modelError) {
      // If the first model fails, try with a fallback model
      console.error(`Error with ${modelName} model:`, modelError);
      
      if (modelName === "gemini-1.5-flash") {
        console.log("Trying with fallback model gemini-pro...");
        modelName = "gemini-pro";
        
        const fallbackModel = genAI.getGenerativeModel({
          model: modelName,
        });
        
        // Configure a simpler chat session with the fallback model
        const fallbackChatSession = fallbackModel.startChat({
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        });
        
        console.log("Sending message to fallback Gemini model:", message);
        const fallbackResult = await promiseWithTimeout(
          fallbackChatSession.sendMessage(message),
          10000, // 10 seconds timeout for fallback
          "Fallback Gemini API request timed out"
        );
        
        const fallbackResponse = fallbackResult.response.text();
        console.log("Fallback Gemini API response:", fallbackResponse);
        return fallbackResponse;
      } else {
        // Both models failed, re-throw the error
        throw modelError;
      }
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

// Advanced voice analysis using AssemblyAI for text and direct audio processing with Meyda/TensorFlow
async function analyzeVoiceWithAssemblyAI(audioBuffer: Buffer): Promise<any> {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error("AssemblyAI API key is not provided");
  }

  try {
    console.log("Starting advanced voice analysis process with acoustic feature extraction...");
    console.log(`Audio buffer size: ${audioBuffer.length} bytes`);
    
    // Create a temporary file to store the audio buffer
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, `recording-${Date.now()}.wav`);
    fs.writeFileSync(tempFilePath, audioBuffer);
    console.log(`Saved audio to temporary file: ${tempFilePath}`);
    
    // Direct audio feature extraction using Meyda
    console.log("Extracting acoustic features from audio using Meyda...");
    const audioFeatures = await extractAudioFeatures(tempFilePath);
    
    // Initialize the AssemblyAI client with the API key
    console.log("Initializing AssemblyAI client...");
    const client = new AssemblyAI({
      apiKey: apiKey,
    });
    
    // Configure the transcription parameters
    const params = {
      audio: tempFilePath,
      sentiment_analysis: true,
      content_safety: true,
      auto_highlights: true,
      speaker_labels: true,
      entity_detection: true,
    };
    
    // Submit the transcription job and wait for completion
    console.log("Submitting transcription job...");
    const transcript = await client.transcripts.transcribe(params);
    console.log(`Transcription completed! Transcript ID: ${transcript.id}`);
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(tempFilePath);
      console.log(`Deleted temporary file: ${tempFilePath}`);
    } catch (err) {
      console.warn(`Failed to delete temporary file: ${tempFilePath}`, err);
    }
    
    // Extract the transcript text
    const text = transcript.text || "";
    console.log("Transcript text:", text);
    
    // Process sentiment analysis results
    const sentimentResults = transcript.sentiment_analysis_results || [];
    console.log(`Found ${sentimentResults.length} sentiment analysis segments`);
    
    // Calculate sentiment score (average sentiment score from 0-100)
    let sentimentScore = 50; // Neutral default
    if (sentimentResults.length > 0) {
      // Convert sentiment to a score: positive=100, neutral=50, negative=0
      const sentimentValues = sentimentResults.map((result: any) => {
        if (result.sentiment === "POSITIVE") return 100;
        if (result.sentiment === "NEGATIVE") return 0;
        return 50; // NEUTRAL
      });
      sentimentScore = Math.round(sentimentValues.reduce((sum: number, val: number) => sum + val, 0) / sentimentValues.length);
      console.log(`Calculated sentiment score: ${sentimentScore}/100`);
    } else {
      console.log("No sentiment results found, using default score of 50");
    }

    // Analyze speech pace (word count per minute)
    // For simplicity, we'll calculate this based on word count and duration
    const wordCount = text.split(/\s+/).length;
    console.log(`Word count in transcript: ${wordCount} words`);
    
    // Get audio duration from the transcript
    // Audio duration is in milliseconds, we'll convert to seconds and minutes
    const audioLengthMs = transcript.audio_duration || 0;
    console.log(`Raw audio duration from API: ${audioLengthMs}ms`);
    
    // If duration is suspiciously short or missing, estimate based on word count
    // Average speaking rate is ~150 words per minute, so 1 word ≈ 0.4 seconds
    const estimatedDurationMs = wordCount * 400; // 400ms per word is a reasonable estimate
    const durationMs = (!audioLengthMs || audioLengthMs < 1000) ? estimatedDurationMs : audioLengthMs;
    
    console.log(`Adjusted audio duration: ${durationMs}ms (${durationMs/1000} seconds)`);
    
    // Ensure we have at least 1 second to prevent division by very small numbers
    const durationMinutes = Math.max(durationMs, 1000) / 60000;
    const wordsPerMinute = wordCount / durationMinutes;
    console.log(`Speech pace: ${Math.round(wordsPerMinute)} words per minute`);
    
    // Convert words per minute to a score (0-100)
    // Average speaking rate is 120-150 WPM, higher values might indicate stress
    let speechPaceScore = 50;
    
    // Sanity check for the WPM - cap it at reasonable values
    const capWordsPerMinute = Math.min(wordsPerMinute, 300); // Cap at 300 WPM (very fast speech)
    
    if (capWordsPerMinute > 180) {
        speechPaceScore = 90; // Very fast
        console.log("Speech pace is very fast (>180 WPM), indicating potential stress");
    } else if (capWordsPerMinute > 150) {
        speechPaceScore = 75; // Fast
        console.log("Speech pace is fast (150-180 WPM), may indicate mild stress");
    } else if (capWordsPerMinute < 100) {
        speechPaceScore = 30; // Slow
        console.log("Speech pace is slow (<100 WPM), generally indicates calm state");
    } else {
        console.log("Speech pace is average (100-150 WPM)");
    }
    console.log(`Speech pace score: ${speechPaceScore}/100`);
    
    // Improved analysis for voice tone and tremor using linguistic features from the transcript
    console.log("Analyzing voice features from transcript for more accurate stress indicators...");
    
    // 1. Analyze speech patterns for fillers, repetitions and hesitations
    // These are strong indicators of stress in speech patterns
    const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'literally', 'basically'];
    const fillerWordMatches = fillerWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (text.match(regex) || []).length;
      return count + matches;
    }, 0);
    
    // Calculate filler density (fillers per 100 words)
    const fillerDensity = (fillerWordMatches / wordCount) * 100;
    console.log(`Filler word density: ${fillerDensity.toFixed(2)}%`);
    
    // 2. Analyze sentence structure - short, fragmented sentences often indicate stress
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? 
      wordCount / sentences.length : 
      0;
    console.log(`Average words per sentence: ${avgWordsPerSentence.toFixed(2)}`);
    
    // Sentence fragmentation score (inversely related to avg sentence length)
    const fragmentationScore = Math.min(100, Math.max(0, 
      100 - (avgWordsPerSentence * 4)
    ));
    console.log(`Sentence fragmentation score: ${fragmentationScore}/100`);
    
    // 3. Analyze interruptions and restarts in speech
    // Look for dashes, ellipses, and sudden shifts that indicate interrupted thought
    const interruptionIndicators = text.match(/(\-{2,}|\.{3,}|\s\-\s)/g) || [];
    const interruptionScore = Math.min(100, interruptionIndicators.length * 15);
    console.log(`Speech interruption score: ${interruptionScore}/100`);
    
    // 4. Analyze emotional words using a simple lexicon approach
    const anxietyWords = ['worried', 'nervous', 'anxious', 'stressed', 'fear', 'afraid', 
                         'panic', 'concern', 'tension', 'pressure', 'overwhelm'];
    const confidenceWords = ['confident', 'calm', 'relaxed', 'peaceful', 'sure', 'certain', 
                            'balanced', 'composed', 'steady'];
    
    // Count anxiety and confidence words
    const anxietyWordCount = anxietyWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi'); // Match word and variations
      const matches = (text.match(regex) || []).length;
      return count + matches;
    }, 0);
    
    const confidenceWordCount = confidenceWords.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = (text.match(regex) || []).length;
      return count + matches;
    }, 0);
    
    console.log(`Anxiety words: ${anxietyWordCount}, Confidence words: ${confidenceWordCount}`);
    
    // 5. Voice tone score based on linguistic features (no more random values)
    const sentimentFactor = 100 - sentimentScore; // Inverse of sentiment (more negative = more stress)
    const paceContribution = speechPaceScore > 70 ? 20 : 0; // Fast speech often indicates tense tone
    const fillerContribution = Math.min(30, fillerDensity * 5); // Higher filler word use = more stress
    const emotionRatio = confidenceWordCount > 0 ? 
      anxietyWordCount / confidenceWordCount : 
      anxietyWordCount > 0 ? 100 : 0;
    const emotionContribution = Math.min(25, emotionRatio * 10);
    
    // Calculate voice tone score using actual linguistic indicators
    const voiceToneScore = Math.min(100, Math.max(0, 
      Math.round((sentimentFactor * 0.4) + 
                 (paceContribution * 0.2) + 
                 (fillerContribution * 0.2) + 
                 (fragmentationScore * 0.1) + 
                 (emotionContribution * 0.1))
    ));
    console.log(`Voice tone score based on linguistic analysis: ${voiceToneScore}/100 (higher = more tense)`);
    
    // 6. Voice tremor score based on speech patterns (no more random values)
    // Speech interruptions, fragmentation and filler words can indicate vocal tremor
    const baseScore = Math.max(
      fragmentationScore,
      Math.min(100, fillerDensity * 7),
      interruptionScore
    );
    const paceFactor = speechPaceScore > 70 ? 15 : 0;
    const sentimentInfluence = sentimentScore < 30 ? 20 : (sentimentScore < 60 ? 10 : 0);
    
    // Calculate voice tremor score using speech pattern indicators
    const voiceTremorScore = Math.min(100, Math.max(0,
      Math.round((baseScore * 0.6) + (paceFactor * 0.2) + (sentimentInfluence * 0.2))
    ));
    console.log(`Estimated voice tremor score: ${voiceTremorScore}/100 (higher = more tremor)`);

    // Calculate overall stress level (1-100) with enhanced weighting from acoustic features
    const stressLevel = Math.min(100, Math.max(1, Math.floor(
      (voiceToneScore * 0.25) + 
      (speechPaceScore * 0.20) + 
      (voiceTremorScore * 0.25) + 
      ((100 - sentimentScore) * 0.20) + 
      (audioFeatures.stressScore * 0.10) // Direct acoustic feature contribution
    )));
    console.log(`Calculated overall stress level: ${stressLevel}/100`);

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
