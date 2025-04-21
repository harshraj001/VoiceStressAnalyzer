import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Moon, Sun, Mic, Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [infoOpen, setInfoOpen] = React.useState(false);

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

          <div className="flex items-center space-x-2">
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
            
            <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Developer Information"
                onClick={() => setInfoOpen(true)}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Info className="h-5 w-5 text-primary" />
              </Button>
              
              <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 shadow-lg border-2 border-primary/20">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center">
                    <span className="text-primary dark:text-primary mr-2">Developers Information</span>
                  </DialogTitle>
                  <DialogDescription className="text-gray-800 dark:text-gray-200">
                    <div className="mt-4 space-y-5">
                      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <h3 className="text-lg font-semibold text-primary dark:text-primary">About the Developers</h3>
                        <ul className="mt-3 text-sm space-y-2 text-gray-800 dark:text-gray-200">
                          <li className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                            <strong className="text-primary dark:text-primary">Harsh Raj</strong>
                            <span className="mx-2">-</span>
                            <span>Reg. no.: 12310271</span>
                          </li>
                          <li className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                            <strong className="text-primary dark:text-primary">Ayush</strong>
                            <span className="mx-2">-</span>
                            <span>Reg. no.: 12311916</span>
                          </li>
                          <li className="flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                            <strong className="text-primary dark:text-primary">Rahul Kumar</strong>
                            <span className="mx-2">-</span>
                            <span>Reg. no.: 12312284</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <h3 className="text-lg font-semibold text-primary dark:text-primary">Technologies Used</h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary rounded text-xs font-medium">React</span>
                          <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary rounded text-xs font-medium">TypeScript</span>
                          <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary rounded text-xs font-medium">TailwindCSS</span>
                          <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary rounded text-xs font-medium">Gemini AI</span>
                          <span className="px-2 py-1 bg-primary/10 text-primary dark:text-primary rounded text-xs font-medium">AssemblyAI</span>
                        </div>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
