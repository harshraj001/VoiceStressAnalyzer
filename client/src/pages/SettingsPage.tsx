import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { clearAllStoredData, getStressHistory, getChatMessages } from '@/lib/stressStorage';
import { Moon, Sun, Monitor, Save, Trash, Download } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      clearAllStoredData();
      alert('All data has been cleared successfully.');
    }
  };
  
  const handleExportData = () => {
    try {
      // Gather data from storage
      const stressHistory = getStressHistory();
      const chatMessages = getChatMessages();
      
      // Create a complete data object with metadata
      const exportData = {
        metadata: {
          appName: 'VoiceEase',
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        },
        stressAnalyses: stressHistory,
        conversations: chatMessages
      };
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a download URL
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `voiceease-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 relative z-0 flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto w-full px-4 py-6 md:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Settings
            </h2>
            
            <div className="space-y-6">
              {/* Appearance Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Appearance
                  </h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </span>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('light')}
                        className="flex items-center space-x-2"
                      >
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                        className="flex items-center space-x-2"
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('system')}
                        className="flex items-center space-x-2"
                      >
                        <Monitor className="h-4 w-4" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Data Management Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Data Management
                  </h3>
                </div>
                
                <div className="p-6 space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your data stored in VoiceEase. You can export your stress analysis history or clear all stored data.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      className="flex items-center space-x-2"
                      onClick={handleClearData}
                    >
                      <Trash className="h-4 w-4" />
                      <span>Clear All Data</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
