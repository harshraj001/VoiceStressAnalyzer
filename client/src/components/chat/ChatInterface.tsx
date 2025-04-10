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

    // Create a temporary typing message
    const typingMessageId = nanoid();
    const typingMessage: ChatMessage = {
      id: typingMessageId,
      content: "",
      isUserMessage: false,
      timestamp: new Date(),
      isTyping: true,
    };

    // Show typing indicator
    setMessages((prev) => [...prev, typingMessage]);

    try {
      // Call Gemini API through our backend
      const response = await apiRequest("POST", "/api/chat", {
        message: input,
      });
      
      const data = await response.json();
      const responseText = data.response || "I'm having trouble processing your request right now. Could you try again?";
      
      // Simulate typing with gradual text reveal
      await typeMessage(typingMessageId, responseText);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      
      // Fallback response if API fails
      const fallbackText = "I'm having trouble connecting to my services right now. Please try again in a moment.";
      
      // Simulate typing with the fallback message
      await typeMessage(typingMessageId, fallbackText);
    }
  };

  // Function to simulate typing animation character by character
  const typeMessage = async (messageId: string, finalText: string) => {
    // Show typing indicator (bouncing dots) for a moment before starting to type
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Typing speed - adjust for faster or slower typing
    const typingSpeed = 30; // milliseconds per character
    
    // Change from typing indicator to character-by-character typing
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isTyping: false, typingText: "", content: finalText }
          : msg
      )
    );
    
    // Type character by character
    let currentText = "";
    for (let i = 0; i < finalText.length; i++) {
      currentText += finalText.charAt(i);
      
      // Update the typing text for the message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, typingText: currentText }
            : msg
        )
      );
      
      // Random typing speed variation to make it more natural
      const randomDelay = Math.floor(Math.random() * 30) + typingSpeed;
      await new Promise(resolve => setTimeout(resolve, randomDelay));
    }
    
    // After finishing typing, remove typingText and set the content
    await new Promise(resolve => setTimeout(resolve, 100));
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, typingText: undefined, content: finalText }
          : msg
      )
    );
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
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  // Clear chat messages except for the welcome message
                  const welcomeMessage: ChatMessage = {
                    id: nanoid(),
                    content: "Hello! I'm your VoiceEase stress assistant. I can help you manage stress, offer relaxation techniques, or analyze your voice to gauge your stress levels. How are you feeling today?",
                    isUserMessage: false,
                    timestamp: new Date(),
                  };
                  setMessages([welcomeMessage]);
                  saveChatMessages([welcomeMessage]);
                }}
                className="flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                <span className="hidden sm:inline">New Chat</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" 
          id="chat-messages"
          style={{ paddingBottom: '70px' }}
        >
          {messages.map((message) => (
            <ChatMessageComponent key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Chat Input with Voice Analysis Button */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-4 pt-3 sticky bottom-0 pb-24 md:pb-4">
          {/* Voice Analysis Module */}
          <div className="mb-4 bg-gradient-to-r from-primary-100/70 to-secondary-100/70 dark:from-primary-900/30 dark:to-secondary-900/30 p-3 sm:p-4 rounded-xl border border-primary-200 dark:border-primary-800 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="mb-2 sm:mb-0 text-center sm:text-left">
                <h3 className="font-medium text-primary-700 dark:text-primary-300">
                  Voice Stress Analysis
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Speak naturally for 15-30 seconds
                </p>
              </div>

              {/* Voice Recording Button */}
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                className="min-w-[160px] transition-all duration-200"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                <span className="relative flex items-center justify-center w-5 h-5 mr-1.5">
                  {isRecording && (
                    <span className="absolute w-5 h-5 bg-red-500/30 rounded-full animate-ping"></span>
                  )}
                  <Mic className={`h-4 w-4 ${isRecording ? "text-white" : ""}`} />
                </span>
                <span className="text-sm">{isRecording ? "Stop Recording" : "Analyze My Stress"}</span>
              </Button>
            </div>
          </div>
          
          {/* Text Input */}
          <div className="relative bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center shadow-sm w-full overflow-hidden">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none px-4 py-3 text-gray-800 dark:text-white min-h-[44px] w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording}
              style={{ WebkitAppearance: 'none' }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className={`mr-2 ${input.trim() ? "text-primary hover:text-primary-600 dark:text-primary dark:hover:text-primary-400" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"}`}
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
