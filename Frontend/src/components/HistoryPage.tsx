import { Clock, Mail, AlertCircle } from 'lucide-react';

const mockHistory = [
  {
    id: 1,
    date: '2025-11-19 10:30 AM',
    intent: 'Refund Request',
    urgency: 'High',
    sentiment: 'Frustrated',
    preview: 'I ordered a product last week and it arrived damaged...',
  },
  {
    id: 2,
    date: '2025-11-19 09:15 AM',
    intent: 'Product Inquiry',
    urgency: 'Low',
    sentiment: 'Neutral',
    preview: 'Can you tell me more about the warranty coverage...',
  },
  {
    id: 3,
    date: '2025-11-18 04:45 PM',
    intent: 'Technical Support',
    urgency: 'Medium',
    sentiment: 'Confused',
    preview: 'I am having trouble setting up the software on my...',
  },
  {
    id: 4,
    date: '2025-11-18 02:20 PM',
    intent: 'Complaint',
    urgency: 'High',
    sentiment: 'Angry',
    preview: 'This is the third time I have contacted support...',
  },
  {
    id: 5,
    date: '2025-11-18 11:00 AM',
    intent: 'Product Inquiry',
    urgency: 'Low',
    sentiment: 'Positive',
    preview: 'I love your products! I wanted to ask about...',
  },
];

export function HistoryPage() {
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

        <div className="space-y-3">
          {mockHistory.map((item) => (
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
                  <p className="text-gray-600 mb-3">{item.preview}</p>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Sentiment: {item.sentiment}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
