import { cn } from "@/lib/utils";
import { StressLevel } from "@/types";

interface StressLevelIndicatorProps {
  level: number;
  showLabel?: boolean;
  className?: string;
}

export function StressLevelIndicator({ 
  level, 
  showLabel = false,
  className 
}: StressLevelIndicatorProps) {
  // Determine stress category and colors
  let stressCategory: StressLevel = StressLevel.MEDIUM;
  let barColor = "bg-amber-500";
  let textColor = "text-amber-500";
  
  if (level < 40) {
    stressCategory = StressLevel.LOW;
    barColor = "bg-green-500";
    textColor = "text-green-600 dark:text-green-400";
  } else if (level > 70) {
    stressCategory = StressLevel.HIGH;
    barColor = "bg-red-500";
    textColor = "text-red-600 dark:text-red-400";
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${barColor} h-2 rounded-full`} 
            style={{ width: `${level}%` }}
          />
        </div>
        {showLabel && (
          <span className={`text-sm ${textColor} font-medium`}>
            {stressCategory}
          </span>
        )}
      </div>
    </div>
  );
}
