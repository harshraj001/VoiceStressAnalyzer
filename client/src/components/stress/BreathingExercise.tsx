import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BreathingExerciseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

enum BreathingState {
  Inhale,
  Hold,
  Exhale,
  Rest
}

// Make sure to export as default
export default function BreathingExercise({ open, onOpenChange }: BreathingExerciseProps) {
  const [breathingState, setBreathingState] = useState<BreathingState>(BreathingState.Rest);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cyclesRemaining, setCyclesRemaining] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const initialTimeRef = useRef(0);
  
  // Breathing pattern durations in seconds
  const inhaleDuration = 4;
  const holdDuration = 7;
  const exhaleDuration = 8;
  const restDuration = 2;
  
  // Start the breathing exercise
  const startExercise = () => {
    setBreathingState(BreathingState.Inhale);
    setTimeRemaining(inhaleDuration);
    initialTimeRef.current = inhaleDuration;
    setCyclesRemaining(3);
    setIsActive(true);
  };
  
  // Stop the breathing exercise
  const stopExercise = () => {
    setIsActive(false);
    setBreathingState(BreathingState.Rest);
  };
  
  // Get the text instruction based on the current state
  const getInstruction = () => {
    switch (breathingState) {
      case BreathingState.Inhale:
        return 'Inhale slowly through your nose';
      case BreathingState.Hold:
        return 'Hold your breath';
      case BreathingState.Exhale:
        return 'Exhale slowly through your mouth';
      case BreathingState.Rest:
        return 'Prepare for next breath';
      default:
        return 'Begin when ready';
    }
  };
  
  // Get color based on the breathing state
  const getStateColor = () => {
    switch (breathingState) {
      case BreathingState.Inhale:
        return 'bg-blue-500';
      case BreathingState.Hold:
        return 'bg-purple-500';
      case BreathingState.Exhale:
        return 'bg-green-500';
      case BreathingState.Rest:
        return 'bg-gray-400';
      default:
        return 'bg-blue-500';
    }
  };

  // Update the timer and state
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isActive) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          // Calculate progress percentage for the circle
          const newProgress = ((initialTimeRef.current - (prev - 1)) / initialTimeRef.current) * 100;
          setProgress(newProgress);
          
          if (prev <= 1) {
            // Time's up, transition to the next state
            switch (breathingState) {
              case BreathingState.Inhale:
                setBreathingState(BreathingState.Hold);
                initialTimeRef.current = holdDuration;
                return holdDuration;
              case BreathingState.Hold:
                setBreathingState(BreathingState.Exhale);
                initialTimeRef.current = exhaleDuration;
                return exhaleDuration;
              case BreathingState.Exhale:
                if (cyclesRemaining <= 1) {
                  // Exercise complete
                  setIsActive(false);
                  setBreathingState(BreathingState.Rest);
                  return 0;
                } else {
                  // Move to rest state between cycles
                  setBreathingState(BreathingState.Rest);
                  initialTimeRef.current = restDuration;
                  return restDuration;
                }
              case BreathingState.Rest:
                setBreathingState(BreathingState.Inhale);
                setCyclesRemaining(prev => prev - 1);
                initialTimeRef.current = inhaleDuration;
                return inhaleDuration;
              default:
                return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, breathingState, cyclesRemaining]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
            4-7-8 Breathing Exercise
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            A simple technique to help reduce stress and promote relaxation
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          {/* Breathing circle animation */}          <div className="relative w-full max-w-[250px] sm:max-w-[280px] aspect-square mb-6 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
              />
              <circle
                className={`transition-all duration-1000 ease-in-out ${
                  breathingState === BreathingState.Inhale ? "text-primary-500 dark:text-primary-400" :
                  breathingState === BreathingState.Hold ? "text-secondary-500 dark:text-secondary-400" :
                  breathingState === BreathingState.Exhale ? "text-green-500 dark:text-green-400" :
                  "text-gray-400 dark:text-gray-600"
                }`}
                strokeWidth="8"
                strokeDasharray="289.27"
                strokeDashoffset={`${289.27 - (progress / 100) * 289.27}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
              <div className="w-full max-w-[190px] sm:max-w-[220px]">
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{getInstruction()}</p>
                {isActive && (
                  <>
                    <p className="text-3xl sm:text-4xl font-bold mt-1 mb-1 text-primary-600 dark:text-primary-400">{timeRemaining}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cycles left: {cyclesRemaining}</p>
                  </>
                )}
                {!isActive && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Click Begin to start</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex gap-3 mt-2">
            {!isActive ? (
              <Button 
                variant="default" 
                onClick={startExercise}
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary-600 dark:hover:bg-primary-700 dark:text-white px-8"
              >
                Begin
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={stopExercise}
                className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700"
              >
                Stop
              </Button>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 space-y-2 w-full">
            <h3 className="font-medium text-center text-gray-900 dark:text-gray-100">How it works:</h3>
            <ol className="list-decimal pl-5 space-y-1 max-w-xs sm:max-w-sm mx-auto">
              <li><strong>Inhale</strong> quietly through your nose for 4 seconds</li>
              <li><strong>Hold</strong> your breath for 7 seconds</li>
              <li><strong>Exhale</strong> completely through your mouth for 8 seconds</li>
              <li>Repeat the cycle three times</li>
            </ol>
            
            <p className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400 pt-2">
              Regular practice of this exercise can help reduce anxiety and improve sleep quality
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Also export as named export for compatibility
export { BreathingExercise };