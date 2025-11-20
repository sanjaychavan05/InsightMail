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
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="h-full p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">History</h1>
          <p className="text-white/60">View previously analyzed emails</p>
        </div>

        {loading ? (
          <div className="text-center py-12 glass-effect-strong rounded-3xl">
            <p className="text-white/60">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 glass-effect-strong rounded-3xl">
            <Mail className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
            <p className="text-white/60">No analysis history yet</p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            {history.map((item, index) => (
              <div
                key={item.id}
                className="glass-effect-strong rounded-3xl border border-white/10 p-6 shadow-xl hover-lift cursor-pointer transition-all"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-semibold">{item.intent}</span>
                      <span className={`px-3 py-1 rounded-xl border text-sm font-medium ${getUrgencyColor(item.urgency)}`}>
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-white/70 mb-4 line-clamp-2">{item.email_text.substring(0, 150)}...</p>
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
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
