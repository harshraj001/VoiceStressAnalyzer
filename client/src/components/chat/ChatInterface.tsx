import { useState, useRef, useEffect } from "react";
import { Bot, Menu, Send, Mic } from "lucide-react";
import { nanoid } from "nanoid";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { StressAnalysisModal } from "@/components/stress/StressAnalysisModal";
import { ChatMessage, StressAnalysisResult } from "@/types";
import { startRecording, stopRecording, analyzeVoice } from "@/lib/voiceAnalysis";
import { getChatMessages, saveChatMessages, saveStressAnalysis } from "@/lib/stressStorage";
import { apiRequest } from "@/lib/queryClient";

interface ChatInterfaceProps {
  onToggleMobileMenu?: () => void;
}

export function ChatInterface({ onToggleMobileMenu }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StressAnalysisResult | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message and load previous messages from localStorage
  useEffect(() => {
    const storedMessages = getChatMessages();
    
    if (storedMessages.length === 0) {
      // If no messages are stored, add a welcome message
      const welcomeMessage: ChatMessage = {
        id: nanoid(),
        content: "Hello! I'm your VoiceEase stress assistant. I can help you manage stress, offer relaxation techniques, or analyze your voice to gauge your stress levels. How are you feeling today?",
        isUserMessage: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      saveChatMessages([welcomeMessage]);
    } else {
      setMessages(storedMessages);
    }
  }, []);

  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatMessages(messages);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: nanoid(),
      content: input,
      isUserMessage: true,
      timestamp: new Date(),
    };

    // Update UI immediately with user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Call Gemini API through our backend
      const response = await apiRequest("POST", "/api/chat", {
        message: input,
      });
      
      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: nanoid(),
        content: data.response || "I'm having trouble processing your request right now. Could you try again?",
        isUserMessage: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      
      // Fallback response if API fails
      const fallbackMessage: ChatMessage = {
        id: nanoid(),
        content: "I'm having trouble connecting to my services right now. Please try again in a moment.",
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, fallbackMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartRecording = async () => {
    try {
      const recorder = await startRecording();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Add a bot message indicating recording has started
      const recordingMessage: ChatMessage = {
        id: nanoid(),
        content: "I'm listening. Please speak for 15-30 seconds about your day or how you're feeling...",
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, recordingMessage]);
    } catch (error) {
      console.error("Failed to start recording:", error);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: nanoid(),
        content: "I couldn't access your microphone. Please check your browser permissions and try again.",
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorder) return;
    
    try {
      const audioBlob = await stopRecording(mediaRecorder);
      setIsRecording(false);
      setMediaRecorder(null);
      
      // Add a processing message
      const processingMessage: ChatMessage = {
        id: nanoid(),
        content: "Processing your voice... This will take a moment.",
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, processingMessage]);
      
      // Analyze the recording
      const result = await analyzeVoice(audioBlob);
      setAnalysisResult(result);
      setShowAnalysisModal(true);
      
      // Save analysis result to history
      saveStressAnalysis(result);
      
      // Add a message with the analysis summary
      const summaryMessage: ChatMessage = {
        id: nanoid(),
        content: `I've analyzed your voice. Your stress level is ${result.stressCategory.toLowerCase()} (${result.stressLevel}%). Would you like to see the detailed analysis or would you prefer some stress management recommendations?`,
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      // Replace the processing message with the summary
      setMessages((prev) => 
        prev.filter(msg => msg.id !== processingMessage.id).concat(summaryMessage)
      );
      
    } catch (error) {
      console.error("Error in recording process:", error);
      setIsRecording(false);
      setMediaRecorder(null);
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: nanoid(),
        content: "I had trouble processing your recording. Please try again.",
        isUserMessage: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary dark:text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Stress Assistant</h2>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full bg-gray-100 dark:bg-gray-700"
              onClick={onToggleMobileMenu}
            >
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto" id="chat-messages">
          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input with Voice Analysis Button */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4">
          {/* Voice Analysis Module */}
          <div className="mb-4 bg-gradient-to-r from-primary-100/70 to-secondary-100/70 dark:from-primary-900/30 dark:to-secondary-900/30 p-4 rounded-xl border border-primary-200 dark:border-primary-800">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-3 sm:mb-0">
                <h3 className="font-medium text-primary-700 dark:text-primary-300">
                  Voice Stress Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Speak naturally for 15-30 seconds
                </p>
              </div>

              {/* Voice Recording Button */}
              <Button
                variant="record"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                <span className="relative flex items-center justify-center w-6 h-6">
                  {isRecording && (
                    <span className="absolute w-6 h-6 bg-red-500/20 rounded-full animate-ping"></span>
                  )}
                  <Mic className="h-5 w-5" />
                </span>
                <span>{isRecording ? "Stop Recording" : "Analyze My Stress"}</span>
              </Button>
            </div>
          </div>

          {/* Text Input */}
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none px-4 py-3 text-gray-800 dark:text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSendMessage}
              className="mr-2 text-primary hover:text-primary dark:text-primary dark:hover:text-primary"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stress Analysis Results Modal */}
      {analysisResult && (
        <StressAnalysisModal
          result={analysisResult}
          open={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
        />
      )}
    </>
  );
}
