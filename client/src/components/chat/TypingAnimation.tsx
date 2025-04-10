import React, { useState, useEffect, useRef } from 'react';

interface TypingAnimationProps {
  text: string;
  onComplete?: () => void;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({ 
  text, 
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const animationCompleted = useRef(false);
  
  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    animationCompleted.current = false;
    
    // Split text into words
    const words = text.split(/\s+/);
    
    // Calculate total animation time (between 1-3 seconds)
    const minTime = 1000; // 1 second
    const maxTime = 3000; // 3 seconds
    
    // Calculate duration based on text length (longer text = closer to max time)
    const duration = Math.min(
      maxTime, 
      minTime + (text.length / 2)
    );
    
    // Add slight randomness (±10%)
    const finalDuration = duration * (0.9 + (Math.random() * 0.2));
    
    // Calculate interval between word reveals
    const intervalBetweenWords = finalDuration / words.length;
    
    // Array to store timeout IDs
    const timeouts: NodeJS.Timeout[] = [];
    
    // Function to reveal words one by one
    words.forEach((word, index) => {
      const timeout = setTimeout(() => {
        // Join all words up to current index
        const revealedText = words.slice(0, index + 1).join(' ');
        setDisplayedText(revealedText);
        
        // Check if this is the last word
        if (index === words.length - 1) {
          animationCompleted.current = true;
          if (onComplete) onComplete();
        }
      }, index * intervalBetweenWords);
      
      timeouts.push(timeout);
    });
    
    // Cleanup function to clear all timeouts if component unmounts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [text, onComplete]);
  
  // If text is empty, don't render anything
  if (!text) return null;
  
  // If animation completed but displayedText is somehow not complete, show full text
  if (animationCompleted.current && displayedText !== text) {
    return <div className="typing-effect">{text}</div>;
  }
  
  return (
    <div className="typing-effect">
      {displayedText || text}
    </div>
  );
};

export const BotTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center py-1">
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
      <span className="typing-dot"></span>
    </div>
  );
};
