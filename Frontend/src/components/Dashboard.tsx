import { useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const sentimentTrendData = [
  { date: 'Mon', positive: 45, neutral: 30, negative: 25 },
  { date: 'Tue', positive: 52, neutral: 28, negative: 20 },
  { date: 'Wed', positive: 48, neutral: 32, negative: 20 },
  { date: 'Thu', positive: 61, neutral: 25, negative: 14 },
  { date: 'Fri', positive: 55, neutral: 30, negative: 15 },
  { date: 'Sat', positive: 42, neutral: 35, negative: 23 },
  { date: 'Sun', positive: 38, neutral: 40, negative: 22 },
];

const intentDistributionData = [
  { name: 'Refund Request', value: 35, color: '#3B82F6' },
  { name: 'Product Inquiry', value: 28, color: '#10B981' },
  { name: 'Technical Support', value: 22, color: '#F59E0B' },
  { name: 'Complaint', value: 10, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#6B7280' },
];

const complianceHeatmapData = [
  { day: 'Mon', gdpr: 12, financial: 8, pii: 5 },
  { day: 'Tue', gdpr: 15, financial: 10, pii: 7 },
  { day: 'Wed', gdpr: 10, financial: 6, pii: 4 },
  { day: 'Thu', gdpr: 8, financial: 12, pii: 6 },
  { day: 'Fri', gdpr: 18, financial: 14, pii: 9 },
  { day: 'Sat', gdpr: 5, financial: 3, pii: 2 },
  { day: 'Sun', gdpr: 4, financial: 2, pii: 1 },
];

export function Dashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const [intentFilter, setIntentFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');

  return (
    <div className="h-full p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Insights Dashboard</h1>
            <p className="text-gray-500">Track email analytics and compliance metrics</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Total Emails</p>
            <p className="text-gray-900">1,247</p>
            <p className="text-green-600 mt-1">+12.5%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Avg. Response Time</p>
            <p className="text-gray-900">2.3 hours</p>
            <p className="text-green-600 mt-1">-8.3%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Compliance Flags</p>
            <p className="text-gray-900">43</p>
            <p className="text-red-600 mt-1">+5.2%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-gray-500 mb-1">Positive Sentiment</p>
            <p className="text-gray-900">68.4%</p>
            <p className="text-green-600 mt-1">+3.1%</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Trend Chart */}
          <div id="DashboardChart1" className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sentimentTrendData}>
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
          <div id="DashboardChart2" className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Intent Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={intentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {intentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Heatmap */}
        <div id="DashboardChart3" className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">Compliance Alerts Heatmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={complianceHeatmapData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="gdpr" stroke="#3B82F6" strokeWidth={2} name="GDPR" />
              <Line type="monotone" dataKey="financial" stroke="#F59E0B" strokeWidth={2} name="Financial" />
              <Line type="monotone" dataKey="pii" stroke="#EF4444" strokeWidth={2} name="PII" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
