/**
 * API Client for InsightMail Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface AnalyzeRequest {
  email: string;
  tone?: 'formal' | 'empathetic' | 'friendly' | 'assertive';
}

export interface ComplianceFlag {
  type: string;
  detail: string;
  severity: string;
}

export interface ActionItem {
  task: string;
  assignee: string;
  deadline?: string | null;
}

export interface RiskBreakdown {
  emotion_intensity: number;
  priority: number;
  compliance_risk: number;
  escalation_likelihood: number;
}

export interface AnalyzeResponse {
  intent: string;
  emotion: string;
  emotion_reason: string;
  urgency: string;
  compliance_flags: ComplianceFlag[];
  summary: string;
  action_items: ActionItem[];
  risk_score: number;
  risk_breakdown: RiskBreakdown;
  smart_reply: string;
  timestamp: string;
}

export interface HistoryRecord {
  id: number;
  email_text: string;
  intent: string;
  emotion: string;
  emotion_reason: string;
  urgency: string;
  compliance_flags: ComplianceFlag[];
  summary: string;
  action_items: ActionItem[];
  risk_score: number;
  risk_breakdown: RiskBreakdown;
  smart_reply: string;
  tone_used: string;
  timestamp: string;
}

export interface HistoryResponse {
  total: number;
  records: HistoryRecord[];
}

export interface DashboardMetrics {
  total_emails: number;
  avg_response_time: number;
  compliance_flags_count: number;
  positive_sentiment_pct: number;
  sentiment_trend: Array<{ date: string; positive: number; neutral: number; negative: number }>;
  intent_distribution: Array<{ name: string; value: number; color: string }>;
  compliance_heatmap: Array<{ day: string; gdpr: number; financial: number; pii: number }>;
}

export interface Settings {
  api_endpoint: string;
  api_key: string;
  auto_analyze: boolean;
  enhanced_sentiment: boolean;
  extract_action_items: boolean;
  high_urgency_alerts: boolean;
  compliance_alerts: boolean;
  daily_summary: boolean;
  data_retention_days: number;
  anonymize_pii: boolean;
}

/**
 * Analyze an email using the backend API
 */
export const analyzeEmail = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || `Analysis failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get analysis history with optional filters
 */
export const getHistory = async (params?: {
  limit?: number;
  offset?: number;
  intent?: string;
  urgency?: string;
  min_risk_score?: number;
}): Promise<HistoryResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.intent) queryParams.set('intent', params.intent);
  if (params?.urgency) queryParams.set('urgency', params.urgency);
  if (params?.min_risk_score) queryParams.set('min_risk_score', params.min_risk_score.toString());

  const response = await fetch(`${API_BASE_URL}/history?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get a specific history record by ID
 */
export const getHistoryRecord = async (id: number): Promise<HistoryRecord> => {
  const response = await fetch(`${API_BASE_URL}/history/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch record: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get application settings
 */
export const getSettings = async (): Promise<Settings> => {
  const response = await fetch(`${API_BASE_URL}/settings`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Update application settings
 */
export const updateSettings = async (settings: Partial<Settings>): Promise<Settings> => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update settings: ${response.statusText}`);
  }

  return response.json();
};
