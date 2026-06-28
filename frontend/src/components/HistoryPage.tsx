import { useState, useEffect } from 'react';
import { Clock, Mail, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getHistory, HistoryRecord } from '../services/api';
import { toast } from 'sonner';

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
            {history.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 font-medium">{item.intent}</span>
                          <span className={`px-2 py-1 rounded-md border text-xs ${getUrgencyColor(item.urgency)}`}>
                            {item.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.summary}</p>
                        {!isExpanded && (
                          <p className="text-xs text-gray-500 mb-3">{item.email_content.substring(0, 100)}...</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(item.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>Emotion: {item.emotion}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Risk: {(item.risk_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100 mt-4">
                      <div className="mt-4 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2">Full Email Content</h3>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                            {item.email_content}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Emotion</h3>
                            <p className="text-sm text-gray-700">{item.emotion}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Tone</h3>
                            <p className="text-sm text-gray-700">{item.tone || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
