import { useLocation, Link } from "wouter";
import { BarChart3, MessageSquare, BookOpen, Settings } from "lucide-react";

export function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around py-2">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-3 ${
            location === "/" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Chat</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`flex flex-col items-center py-2 px-3 ${
            location === "/history" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/resources">
          <a className={`flex flex-col items-center py-2 px-3 ${
            location === "/resources" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Resources</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={`flex flex-col items-center py-2 px-3 ${
            location === "/settings" 
              ? "text-primary dark:text-primary" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
