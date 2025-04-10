import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function HomePage() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative z-0 flex flex-col md:flex-row">
        <Sidebar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col max-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
          <ChatInterface onToggleMobileMenu={toggleMobileMenu} />
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 z-20 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 w-64 h-full p-4">
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 text-gray-500"
                onClick={toggleMobileMenu}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Mobile menu content */}
              <div className="mt-8">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
