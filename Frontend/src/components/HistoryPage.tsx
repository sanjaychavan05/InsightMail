import { useState, useEffect } from 'react';
import { Clock, Mail, AlertCircle } from 'lucide-react';
import { getHistory, HistoryRecord } from '../services/api';
import { toast } from 'sonner';

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory({ limit: 50 });
        setHistory(data.records);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-gray-900">History</h1>
          <p className="text-gray-500">View previously analyzed emails</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No analysis history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{item.intent}</span>
                      <span className={`px-2 py-1 rounded-md border text-xs ${getUrgencyColor(item.urgency)}`}>
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{item.email_text.substring(0, 150)}...</p>
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Sentiment: {item.emotion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
