import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Mic } from "lucide-react";

interface HeaderProps {
  username?: string;
}

export function Header({ username = "Guest" }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Generate initials from username
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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

          <div className="flex items-center space-x-4">
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

            <div className="hidden md:block">
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full py-1 px-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-semibold">
                    {getInitials(username)}
                  </span>
                </span>
                <span className="text-sm font-medium">{username}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
