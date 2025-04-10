import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StressAnalysisResult } from "@/types";
import { StressLevelIndicator } from "./StressLevelIndicator";

interface StressAnalysisModalProps {
  result: StressAnalysisResult;
  open: boolean;
  onClose: () => void;
}

export function StressAnalysisModal({ 
  result, 
  open, 
  onClose 
}: StressAnalysisModalProps) {
  if (!open) return null;

  // Get badge color based on level
  const getBadgeColorClass = (score: number) => {
    if (score < 40) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    } else if (score < 70) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    } else {
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Stress Analysis Results
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Stress Level Indicator */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center">
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Stress Level
              </span>
              <h4 className={`text-2xl font-bold ${
                result.stressLevel < 40 
                  ? "text-green-500" 
                  : result.stressLevel > 70 
                    ? "text-red-500" 
                    : "text-amber-500"
              }`}>
                {result.stressCategory}
              </h4>
            </div>
            
            <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full ${
                  result.stressLevel < 40 
                    ? "bg-green-500" 
                    : result.stressLevel > 70 
                      ? "bg-red-500" 
                      : "bg-amber-500"
                }`} 
                style={{ width: `${result.stressLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Analysis Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Analysis Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Voice Tone Pattern
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClass(result.voiceToneScore)}`}>
                  {result.voiceToneLabel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Speech Pace
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClass(result.speechPaceScore)}`}>
                  {result.speechPaceLabel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Voice Tremor
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClass(result.voiceTremorScore)}`}>
                  {result.voiceTremorLabel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Sentiment Analysis
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColorClass(result.sentimentScore)}`}>
                  {result.sentimentLabel}
                </span>
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Recommendations
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {result.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mt-1 mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default">
            Try Breathing Exercise
          </Button>
        </div>
      </div>
    </div>
  );
}
