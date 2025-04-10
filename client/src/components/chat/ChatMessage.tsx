import { ChatMessage as ChatMessageType } from "@/types";
import { Bot, User } from "lucide-react";
import { BotTypingIndicator, TypingAnimation } from "./TypingAnimation";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { content, isUserMessage } = message;

  // Convert string to an unordered list if it contains bullet points
  const formatContent = (text: string) => {
    if (text.includes("•") || text.includes("* ")) {
      const items = text
        .split(/\n/)
        .filter(line => line.trim().startsWith("•") || line.trim().startsWith("* "))
        .map(line => line.replace(/^[•*]\s*/, "").trim());
      
      if (items.length > 0) {
        const beforeList = text.split(/\n/)[0];
        
        return (
          <>
            <p>{beforeList}</p>
            <ul className="list-disc ml-5 mt-2">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </>
        );
      }
    }
    
    return <p>{text}</p>;
  };

  if (isUserMessage) {
    return (
      <div className="flex items-start mb-4 justify-end">
        <div className="mr-2 sm:mr-3 bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] sm:max-w-[75%] shadow-sm">
          <div className="text-sm sm:text-base break-words">
            {formatContent(content)}
          </div>
        </div>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden shadow-sm">
          <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shadow-sm">
        <Bot className="h-5 w-5 text-primary dark:text-primary" />
      </div>
      <div className="ml-2 sm:ml-3 bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] sm:max-w-[75%] shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 break-words">
          {message.isTyping ? (
            <BotTypingIndicator />
          ) : (
            message.typingText ? (
              <TypingAnimation text={content} />
            ) : (
              formatContent(content)
            )
          )}
        </div>
      </div>
    </div>
  );
}
