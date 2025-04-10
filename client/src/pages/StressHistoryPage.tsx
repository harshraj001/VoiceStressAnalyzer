import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { StressHistory } from '@/components/stress/StressHistory';

export default function StressHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header username="John Doe" />

      <main className="flex-1 relative z-0 flex flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto w-full px-4 py-6 md:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Stress History
            </h2>
            
            <StressHistory />
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
