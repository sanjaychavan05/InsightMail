# Frontend Integration Guide

## React/TypeScript Integration Snippet

### 1. Configure Environment Variable

In `Frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Create API Client Helper

Create `Frontend/src/services/api.ts`:

```typescript
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

export const analyzeEmail = async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
};

export const getHistory = async (params?: {
  limit?: number;
  offset?: number;
  intent?: string;
  urgency?: string;
  min_risk_score?: number;
}) => {
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

export const getDashboardMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard: ${response.statusText}`);
  }

  return response.json();
};

export const getSettings = async () => {
  const response = await fetch(`${API_BASE_URL}/settings`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.statusText}`);
  }

  return response.json();
};

export const updateSettings = async (settings: any) => {
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
```

### 3. Update EmailAnalyzer Component

In `Frontend/src/components/EmailAnalyzer.tsx`, replace the mock `analyzeEmail` function:

```typescript
import { analyzeEmail } from '../services/api';

// Replace the existing analyzeEmail function with:
const analyzeEmail = async () => {
  if (!emailInput.trim()) return;

  setIsLoading(true);

  try {
    // Call the real API
    const result = await analyzeEmail({
      email: emailInput,
      tone: selectedTone,
    });

    // Map API response to frontend format
    const mockResult: AnalysisResult = {
      intent: result.intent,
      emotion: result.emotion,
      urgency: result.urgency,
      complianceFlags: result.compliance_flags.map(f => `${f.type}: ${f.detail}`),
      summary: result.summary,
      actionItems: result.action_items.map(a => a.task),
      suggestedReply: result.smart_reply,
      emotionInsight: result.emotion_reason,
      riskScore: result.risk_score,
      riskBreakdown: {
        emotionIntensity: result.risk_breakdown.emotion_intensity,
        priority: result.risk_breakdown.priority,
        complianceRisk: result.risk_breakdown.compliance_risk,
        escalationLikelihood: result.risk_breakdown.escalation_likelihood,
      },
    };

    setAnalysisResult(mockResult);
  } catch (error) {
    console.error('Analysis error:', error);
    alert('Failed to analyze email. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Update HistoryPage Component

```typescript
import { useEffect, useState } from 'react';
import { getHistory } from '../services/api';

export function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory({ limit: 50 });
        setHistory(data.records);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ... rest of component
}
```

### 5. Update Dashboard Component

```typescript
import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../services/api';

export function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      }
    };

    fetchMetrics();
  }, []);

  // Use metrics.sentiment_trend, metrics.intent_distribution, etc.
}
```

## Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows PowerShell
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env and set GEMINI_API_KEY
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend**:
   ```bash
   cd Frontend
   echo "VITE_API_BASE_URL=http://localhost:8000" > .env
   npm install
   npm run dev
   ```

3. **Test Integration**:
   - Open http://localhost:5173
   - Paste an email in the analyzer
   - Click "Analyze Email"
   - Results should come from the backend API

## API Endpoints Reference

- `POST /analyze` - Analyze email
- `GET /history` - Get analysis history
- `GET /history/{id}` - Get specific record
- `GET /dashboard` - Get dashboard metrics
- `GET /settings` - Get settings
- `POST /settings` - Update settings

## Troubleshooting

- **CORS errors**: Check `CORS_ORIGINS` in backend `.env`
- **Connection refused**: Ensure backend is running on port 8000
- **API key errors**: Backend will run in mock mode if `GEMINI_API_KEY` not set
