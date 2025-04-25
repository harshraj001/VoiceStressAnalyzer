import { useLocation, Link } from "wouter";
import { BarChart3, MessageSquare, BookOpen, Settings, Wind } from "lucide-react";
import { StressLevelIndicator } from "@/components/stress/StressLevelIndicator";
import { BreathingExercise } from "@/components/stress/BreathingExercise";
import { Button } from "@/components/ui/button";
import { getStressHistory } from "@/lib/stressStorage";
import { useEffect, useState } from "react";
import { StressAnalysisResult } from "@/types";

export function Sidebar() {
  const [location] = useLocation();
  const [latestAnalysis, setLatestAnalysis] = useState<StressAnalysisResult | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);

  useEffect(() => {
    const history = getStressHistory();
    if (history.length > 0) {
      // Sort by timestamp (newest first) and get the latest
      const sortedHistory = [...history].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLatestAnalysis(sortedHistory[0]);
    }
  }, []);

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 border-r border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/">
          <a
            className={`flex items-center space-x-3 px-3 py-2 ${
              location === "/"
                ? "bg-primary-50 dark:bg-gray-700/50 text-primary dark:text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } rounded-lg`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Chat</span>
          </a>
        </Link>
        
        {/* Breathing Exercise Button */}
        <a
          className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer"
          onClick={() => setShowBreathingExercise(true)}
        >
          <Wind className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <span className="font-medium">Breathing Exercise</span>
        </a>
        
        <Link href="/history">
          <a
            className={`flex items-center space-x-3 px-3 py-2 ${
              location === "/history"
                ? "bg-primary-50 dark:bg-gray-700/50 text-primary dark:text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } rounded-lg`}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Stress History</span>
          </a>
        </Link>
        <Link href="/resources">
          <a
            className={`flex items-center space-x-3 px-3 py-2 ${
              location === "/resources"
                ? "bg-primary-50 dark:bg-gray-700/50 text-primary dark:text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } rounded-lg`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Resources</span>
          </a>
        </Link>
        <Link href="/settings">
          <a
            className={`flex items-center space-x-3 px-3 py-2 ${
              location === "/settings"
                ? "bg-primary-50 dark:bg-gray-700/50 text-primary dark:text-primary"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            } rounded-lg`}
          >
            <Settings className="h-5 w-5" />
            <span className="font-medium">Settings</span>
          </a>
        </Link>
      </nav>

      {/* Stress Level Summary Card */}
      <div className="p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Recent Stress Level
          </h3>
          {latestAnalysis ? (
            <>
              <StressLevelIndicator 
                level={latestAnalysis.stressLevel} 
                showLabel 
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {latestAnalysis.stressLevel}% stress level detected in your last voice analysis.
              </p>
              <Link href="/history">
                <a>
                  <Button 
                    className="mt-3 w-full text-sm" 
                    variant="default" 
                    size="sm"
                  >
                    View History
                  </Button>
                </a>
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                No stress analysis yet. Try analyzing your voice in the chat.
              </p>
              <Link href="/">
                <a>
                  <Button 
                    className="w-full text-sm" 
                    variant="default" 
                    size="sm"
                  >
                    Start Analysis
                  </Button>
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Breathing Exercise Modal */}
      <BreathingExercise
        open={showBreathingExercise}
        onOpenChange={setShowBreathingExercise}
      />
    </aside>
  );
}
