import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { StressAnalysisResult, TimeRange, StressHistoryEntry } from "@/types";
import { getStressHistory } from "@/lib/stressStorage";
import { format } from "date-fns";
import { StressAnalysisModal } from "./StressAnalysisModal";
import { X } from "lucide-react";

export function StressHistory() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [chartData, setChartData] = useState<any[]>([]);
  const [historyEntries, setHistoryEntries] = useState<StressHistoryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<StressAnalysisResult | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const history = getStressHistory();
    if (history.length > 0) {
      // Sort by timestamp (newest first)
      const sortedHistory = [...history].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Format entries for the table
      const formattedEntries = sortedHistory.map(entry => ({
        ...entry,
        date: format(new Date(entry.timestamp), "PPP"),
        time: format(new Date(entry.timestamp), "p"),
        keyFactors: getKeyFactors(entry)
      }));
      
      setHistoryEntries(formattedEntries);
      
      // Prepare chart data based on selected time range
      prepareChartData(history, timeRange);
    }
  }, [timeRange]);
  
  const handleViewDetails = (entry: StressAnalysisResult) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  // Format key factors from analysis
  const getKeyFactors = (analysis: StressAnalysisResult): string => {
    const factors = [];
    
    if (analysis.speechPaceScore > 70) factors.push("accelerated speech");
    if (analysis.voiceTremorScore > 70) factors.push("voice tremor");
    if (analysis.voiceToneScore > 70) factors.push("tense tone");
    if (analysis.sentimentScore > 70) factors.push("negative sentiment");
    
    if (factors.length === 0) {
      if (analysis.stressLevel < 40) {
        return "calm tone, positive sentiment";
      } else {
        return "mixed indicators";
      }
    }
    
    return factors.join(", ");
  };

  // Prepare data for the chart based on time range
  const prepareChartData = (history: StressAnalysisResult[], range: TimeRange) => {
    if (history.length === 0) {
      setChartData([]);
      return;
    }

    // Define time limits based on range
    const now = new Date();
    const timeLimits = {
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1)),
      year: new Date(now.setFullYear(now.getFullYear() - 1))
    };
    
    // Filter entries by time range
    const filteredHistory = history.filter(
      entry => new Date(entry.timestamp) >= timeLimits[range]
    );
    
    // Format data for chart
    const data = filteredHistory.map(entry => ({
      date: format(new Date(entry.timestamp), range === "week" ? "EEE" : range === "month" ? "dd MMM" : "MMM"),
      stressLevel: entry.stressLevel,
      voiceTone: entry.voiceToneScore,
      speechPace: entry.speechPaceScore,
      sentiment: entry.sentimentScore
    }));
    
    // Sort by date
    data.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setChartData(data);
  };

  // Handle time range filter change
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <>
      <div className="space-y-6">
        {/* History Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Stress Level Trends
          </h3>
          
          <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded-lg">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB'
                    }}
                    formatter={(value) => [`${value}%`]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="stressLevel" 
                    name="Stress Level"
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="voiceTone" 
                    name="Voice Tone"
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment" 
                    name="Sentiment"
                    stroke="#ec4899" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No stress history data available
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                type="button"
                onClick={() => handleTimeRangeChange("week")}
                variant={timeRange === "week" ? "default" : "outline"}
                className="rounded-l-lg rounded-r-none"
                size="sm"
              >
                Week
              </Button>
              <Button
                type="button"
                onClick={() => handleTimeRangeChange("month")}
                variant={timeRange === "month" ? "default" : "outline"}
                className="rounded-none"
                size="sm"
              >
                Month
              </Button>
              <Button
                type="button"
                onClick={() => handleTimeRangeChange("year")}
                variant={timeRange === "year" ? "default" : "outline"}
                className="rounded-r-lg rounded-l-none"
                size="sm"
              >
                Year
              </Button>
            </div>
          </div>
        </div>
        
        {/* Recent Entries Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Recent Entries
          </h3>
          
          {historyEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stress Level
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Key Factors
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {historyEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                        {entry.date}, {entry.time}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          entry.stressLevel < 40 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : entry.stressLevel > 70 
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" 
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        }`}>
                          {entry.stressCategory} ({entry.stressLevel}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {entry.keyFactors}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                        <Button 
                          variant="link"
                          className="text-primary dark:text-primary hover:text-primary-700 dark:hover:text-primary-300"
                          onClick={() => handleViewDetails(entry)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 dark:text-gray-400">
              <p>No stress analysis entries yet. Try analyzing your voice in the chat.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Stress Analysis Modal */}
      {selectedEntry && showDetailsModal && (
        <StressAnalysisModal
          result={selectedEntry}
          open={true}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}
