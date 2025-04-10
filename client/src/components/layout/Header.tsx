import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Mic } from "lucide-react";

export function Header() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="relative z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-primary dark:text-primary">
              <Mic className="h-8 w-8" />
            </span>
            <h1 className="text-xl font-heading font-bold text-primary dark:text-primary">
              VoiceEase
            </h1>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
