import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getDashboardMetrics, DashboardMetrics } from '../services/api';
import { toast } from 'sonner';

export function Dashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const [intentFilter, setIntentFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="h-full p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-full">
          <div className="glass-effect-strong rounded-3xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-semibold">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="h-full p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-full">
          <div className="glass-effect-strong rounded-3xl p-12 text-center border border-red-500/30">
            <p className="text-red-400">Failed to load dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Insights Dashboard</h1>
            <p className="text-white/60">Track email analytics and compliance metrics</p>
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
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={intentFilter} onValueChange={setIntentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Intent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Intents</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                  <SelectItem value="inquiry">Product Inquiry</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="glass-effect-strong rounded-2xl border border-white/10 p-6 shadow-xl hover-lift">
            <p className="text-white/60 mb-1 text-sm">Total Emails</p>
            <p className="text-3xl font-bold text-white mb-1">{metrics.total_emails.toLocaleString()}</p>
            <p className="text-green-400 text-sm font-medium">↑ +12.5%</p>
          </div>
          <div className="glass-effect-strong rounded-2xl border border-white/10 p-6 shadow-xl hover-lift">
            <p className="text-white/60 mb-1 text-sm">Avg. Response Time</p>
            <p className="text-3xl font-bold text-white mb-1">{metrics.avg_response_time} <span className="text-lg">hours</span></p>
            <p className="text-green-400 text-sm font-medium">↓ -8.3%</p>
          </div>
          <div className="glass-effect-strong rounded-2xl border border-white/10 p-6 shadow-xl hover-lift">
            <p className="text-white/60 mb-1 text-sm">Compliance Flags</p>
            <p className="text-3xl font-bold text-white mb-1">{metrics.compliance_flags_count}</p>
            <p className="text-red-400 text-sm font-medium">↑ +5.2%</p>
          </div>
          <div className="glass-effect-strong rounded-2xl border border-white/10 p-6 shadow-xl hover-lift">
            <p className="text-white/60 mb-1 text-sm">Positive Sentiment</p>
            <p className="text-3xl font-bold text-white mb-1">{metrics.positive_sentiment_pct}%</p>
            <p className="text-green-400 text-sm font-medium">↑ +3.1%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          {/* Sentiment Trend Chart */}
          <div id="DashboardChart1" className="glass-effect-strong rounded-3xl border border-white/10 p-6 shadow-xl hover-lift">
            <h3 className="text-white font-semibold mb-4 text-lg">Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.sentiment_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                  }}
                />
                <Legend wrapperStyle={{ color: '#fff' }} />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={3} name="Positive" dot={{ fill: '#10B981', r: 4 }} />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={3} name="Neutral" dot={{ fill: '#6B7280', r: 4 }} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={3} name="Negative" dot={{ fill: '#EF4444', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Intent Distribution Chart */}
          <div id="DashboardChart2" className="glass-effect-strong rounded-3xl border border-white/10 p-6 shadow-xl hover-lift">
            <h3 className="text-white font-semibold mb-4 text-lg">Intent Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.intent_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.intent_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Heatmap */}
        <div id="DashboardChart3" className="glass-effect-strong rounded-3xl border border-white/10 p-6 shadow-xl hover-lift animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-white font-semibold mb-4 text-lg">Compliance Alerts Heatmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.compliance_heatmap}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="gdpr" stroke="#3B82F6" strokeWidth={3} name="GDPR" dot={{ fill: '#3B82F6', r: 4 }} />
              <Line type="monotone" dataKey="financial" stroke="#F59E0B" strokeWidth={3} name="Financial" dot={{ fill: '#F59E0B', r: 4 }} />
              <Line type="monotone" dataKey="pii" stroke="#EF4444" strokeWidth={3} name="PII" dot={{ fill: '#EF4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
