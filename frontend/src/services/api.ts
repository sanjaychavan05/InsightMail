/**
 * API Client for InsightMail Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface AnalyzeRequest {
  email: string;
  tone?: string; // professional, formal, friendly, empathetic, etc.
}

export interface RiskBreakdown {
  legal_risk: number;
  financial_risk: number;
  reputational_risk: number;
  operational_risk: number;
}

export interface RAGContext {
  id?: number;
  title: string;
  content: string;
  relevance_score?: number;
}

export interface AnalyzeResponse {
  intent: string;
  emotion: string;
  emotion_reason: string;
  urgency: string;
  compliance_flags: string[]; // Array of compliance issue strings
  summary: string;
  action_items: string[]; // Array of action item strings
  risk_score: number;
  risk_breakdown: RiskBreakdown;
  smart_reply: string;
  rag_context_used: RAGContext[];
  timestamp?: string;
  processing_time?: number;
}

export interface HistoryRecord {
  id: number;
  email_content: string;
  tone?: string;
  intent: string;
  emotion: string;
  urgency: string;
  risk_score: number;
  timestamp: string;
  summary: string;
}

export interface HistoryResponse {
  total: number;
  records: HistoryRecord[];
}

export interface SentimentTrendItem {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface IntentDistributionItem {
  intent: string;
  count: number;
}

export interface ComplianceTrendItem {
  date: string;
  compliant: number;
  flagged: number;
}

export interface UrgencyOverTimeItem {
  date: string;
  high: number;
  medium: number;
  low: number;
}

export interface AnalyticsResponse {
  sentiment_trend: SentimentTrendItem[];
  intent_distribution: IntentDistributionItem[];
  compliance_trend: ComplianceTrendItem[];
  urgency_over_time: UrgencyOverTimeItem[];
  total_emails_analyzed: number;
  average_risk_score: number;
}

export interface Settings {
  id: number;
  api_key?: string;
  api_endpoint?: string;
  model_name: string;
  enable_rag: boolean;
  enable_compliance_check: boolean;
  enable_risk_scoring: boolean;
  enable_smart_reply: boolean;
  rag_top_k: number;
  rag_similarity_threshold: number;
  default_tone: string;
  updated_at?: string;
}

export interface KnowledgeBaseItem {
  id: number;
  title: string;
  content: string;
  document_type?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseListResponse {
  total: number;
  documents: KnowledgeBaseItem[];
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
}): Promise<HistoryResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const response = await fetch(`${API_BASE_URL}/history?${queryParams}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get analytics dashboard data
 */
export const getAnalytics = async (days: number = 30): Promise<AnalyticsResponse> => {
  const response = await fetch(`${API_BASE_URL}/analytics?days=${days}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.statusText}`);
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
export const updateSettings = async (settings: Partial<Settings>): Promise<{ success: boolean; message: string; data: Settings }> => {
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

/**
 * Add document to knowledge base
 */
export const addKnowledgeBaseDocument = async (data: {
  title: string;
  content: string;
  document_type?: string;
  source?: string;
}): Promise<{ success: boolean; message: string; data: KnowledgeBaseItem }> => {
  const response = await fetch(`${API_BASE_URL}/kb/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to add document: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get knowledge base documents
 */
export const getKnowledgeBase = async (): Promise<KnowledgeBaseListResponse> => {
  const response = await fetch(`${API_BASE_URL}/kb/list`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch knowledge base: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Delete knowledge base document
 */
export const deleteKnowledgeBaseDocument = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/kb/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`);
  }

  return response.json();
};
