import { StressAnalysisResult, StressLevel } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";

// Function to start voice recording
export const startRecording = async (): Promise<MediaRecorder> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    mediaRecorder.start();
    return mediaRecorder;
  } catch (error) {
    console.error("Error starting recording:", error);
    throw new Error("Could not access microphone. Please check permissions.");
  }
};

// Function to stop recording and get audio blob
export const stopRecording = (mediaRecorder: MediaRecorder): Promise<Blob> => {
  return new Promise((resolve) => {
    const audioChunks: BlobPart[] = [];
    
    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      resolve(audioBlob);
      
      // Stop all tracks to release the microphone
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
    
    mediaRecorder.stop();
  });
};

// Function to analyze the recorded voice
export const analyzeVoice = async (audioBlob: Blob): Promise<StressAnalysisResult> => {
  try {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const response = await fetch("/api/analyze-voice", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const analysisResult = await response.json();
    return mapApiResponseToResult(analysisResult);
  } catch (error) {
    console.error("Error analyzing voice:", error);
    // Instead of returning fake data, throw the error to be handled by the UI
    throw new Error("Failed to analyze voice. Please try again later.");
  }
};

// Map API response to our internal format
function mapApiResponseToResult(apiResponse: any): StressAnalysisResult {
  const stressLevel = apiResponse.stressLevel || 50;
  let stressCategory: StressLevel = StressLevel.MEDIUM;
  
  if (stressLevel < 40) stressCategory = StressLevel.LOW;
  else if (stressLevel > 70) stressCategory = StressLevel.HIGH;

  return {
    id: nanoid(),
    stressLevel: stressLevel,
    stressCategory: stressCategory,
    voiceToneScore: apiResponse.voiceToneScore || 50,
    voiceToneLabel: getScoreLabel(apiResponse.voiceToneScore, "Voice Tone"),
    speechPaceScore: apiResponse.speechPaceScore || 50,
    speechPaceLabel: getScoreLabel(apiResponse.speechPaceScore, "Speech Pace"),
    voiceTremorScore: apiResponse.voiceTremorScore || 50,
    voiceTremorLabel: getScoreLabel(apiResponse.voiceTremorScore, "Voice Tremor"),
    sentimentScore: apiResponse.sentimentScore || 50,
    sentimentLabel: getScoreLabel(apiResponse.sentimentScore, "Sentiment"),
    transcript: apiResponse.transcript || "",
    timestamp: new Date(),
    recommendations: apiResponse.recommendations || [
      "Try the 4-7-8 breathing technique: inhale for 4 seconds, hold for 7, exhale for 8",
      "Consider taking a short break to reset your mind",
      "Listen to calming sounds or music to reduce tension"
    ]
  };
}

// Generate labels based on score
function getScoreLabel(score: number, type: string): string {
  if (!score) return "Neutral";
  
  if (type === "Voice Tone") {
    if (score < 40) return "Calm";
    if (score < 70) return "Slightly Tense";
    return "Tense";
  }
  
  if (type === "Speech Pace") {
    if (score < 40) return "Slow";
    if (score < 70) return "Normal";
    return "Accelerated";
  }
  
  if (type === "Voice Tremor") {
    if (score < 40) return "Minimal";
    if (score < 70) return "Moderate";
    return "Significant";
  }
  
  if (type === "Sentiment") {
    if (score < 40) return "Positive";
    if (score < 70) return "Moderately Negative";
    return "Negative";
  }
  
  return "Neutral";
}

// No fallback method - we now show actual errors to users
