import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getAnalytics, AnalyticsResponse } from '../services/api';
import { toast } from 'sonner';

export function Dashboard() {
  const [dateRange, setDateRange] = useState('30');
  const [metrics, setMetrics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const days = parseInt(dateRange);
        const data = await getAnalytics(days);
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="h-full p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500">Track email analytics and trends</p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Total Emails</p>
            <p className="text-gray-900">{metrics.total_emails.toLocaleString()}</p>
            <p className="text-green-600 mt-1">+12.5%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Avg. Response Time</p>
            <p className="text-gray-900">{metrics.avg_response_time} hours</p>
            <p className="text-green-600 mt-1">-8.3%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Compliance Flags</p>
            <p className="text-gray-900">{metrics.compliance_flags_count}</p>
            <p className="text-red-600 mt-1">+5.2%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Positive Sentiment</p>
            <p className="text-gray-900">{metrics.positive_sentiment_pct}%</p>
            <p className="text-green-600 mt-1">+3.1%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.sentiment_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} name="Positive" />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} name="Neutral" />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} name="Negative" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Intent Distribution Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Intent Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.intent_distribution.map((item, index) => ({
                    name: item.intent,
                    value: item.count,
                    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.intent_distribution.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.compliance_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="compliant" stroke="#10B981" strokeWidth={2} name="Compliant" />
                <Line type="monotone" dataKey="flagged" stroke="#EF4444" strokeWidth={2} name="Flagged" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Urgency Over Time */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.urgency_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2} name="High" />
                <Line type="monotone" dataKey="medium" stroke="#F59E0B" strokeWidth={2} name="Medium" />
                <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2} name="Low" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
